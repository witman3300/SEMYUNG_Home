"""
세명장교 비즈니스센터 — FastAPI 백엔드
공개 : /api/config /api/chat /api/contact(+자동이메일) /api/blog
관리 : /api/admin/*  (Supabase Auth Bearer 토큰 인증)
       summary · contacts(+상태) · customers · payments · posts
정적 : 멀티페이지(index.html 등) 서빙
배포 : Railway · DB: Supabase · LLM: Anthropic Claude
"""
from __future__ import annotations

import os
import ssl
import asyncio
import logging
import smtplib
from email.message import EmailMessage
from pathlib import Path

import httpx
from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field, field_validator

try:
    import anthropic
except ImportError:
    anthropic = None

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("semyung")
ROOT = Path(__file__).resolve().parent.parent

# ---- 환경변수 ----
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
CLAUDE_MODEL = os.getenv("CLAUDE_MODEL", "claude-opus-5")
CLAUDE_EFFORT = os.getenv("CLAUDE_EFFORT", "low")  # low|medium|high|xhigh|max
SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "")           # 있으면 이 이메일만 관리자 허용
KAKAO_CHANNEL_URL = os.getenv("KAKAO_CHANNEL_URL", "https://pf.kakao.com/")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*")
TARGET_CUSTOMERS = int(os.getenv("TARGET_CUSTOMERS", "1000"))
# SMTP (문의 자동이메일)
SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASS = os.getenv("SMTP_PASS", "")
MAIL_FROM = os.getenv("MAIL_FROM", SMTP_USER)
MAIL_TO = os.getenv("MAIL_TO", "")

CENTER_FACTS = """
[세명장교 비즈니스센터]
- 주소: 서울특별시 중구 삼일대로 363, 장교빌딩 810호 / 전화 02-762-3009 / 24시간 연중무휴
- 운영 9년(2016 창업) / 창업·금융 25년 경력 / 목표 입주 1,000개
- 경영이념: 고객만족·행복추구·초지일관
- 지하철 1·2·3·4·5호선(을지로2가·을지로입구·명동) 인접, 고용노동부·서울고용노동청 인접(노동·노무 특화)
- AI 창업 플랫폼 '사업하자'(sauphaja.ai.kr) 연동, 24시간 AI 챗봇·자동 창업진단
[서비스] 1.비상주사무실(월 최저가·즉시입주·사업자등록) 2.창업컨설팅(25년) 3.AI교육 4.금융컨설팅(삼성생명 25년)
[요금] (부가세 별도)
 · 비상주: 개인 월 5만원, 법인 월 7.5만원 (6개월 일시불 시 50% 할인, 주변 시세 대비 50% 파격 할인)
 · 상주: 1인석(고정) 30만원(보증금 30만), 1인실 40만원(보증금 40만), 2인실 50만원(보증금 50만), 3인실 60만원(보증금 60만)
""".strip()
SYSTEM_PROMPT = (
    "당신은 '세명장교 비즈니스센터'의 친절하고 전문적인 AI 상담원입니다. 아래 정보를 바탕으로 "
    "정확하고 간결하게(2~4문장) 답변하세요. 사업 아이템/창업 질문에는 강점·리스크·다음 단계를 짚어 "
    "'창업진단'을 돕고, 필요하면 사업하자(sauphaja.ai.kr)나 전화 02-762-3009 상담을 안내하세요. "
    "모르는 내용은 지어내지 말고 친근한 존댓말을 사용합니다. 사용자가 영어로 물으면 영어로 답합니다.\n\n"
    + CENTER_FACTS
)

app = FastAPI(title="세명장교 비즈니스센터 API", version="3.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in ALLOWED_ORIGINS.split(",")] if ALLOWED_ORIGINS != "*" else ["*"],
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["*"],
)

_client = None
def get_claude():
    global _client
    if _client is None and anthropic and ANTHROPIC_API_KEY:
        _client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    return _client

def supa_headers(prefer: str | None = None) -> dict:
    h = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}", "Content-Type": "application/json"}
    if prefer:
        h["Prefer"] = prefer
    return h

def require_supabase():
    if not (SUPABASE_URL and SUPABASE_KEY):
        raise HTTPException(status_code=503, detail="Supabase가 설정되지 않았습니다.")

async def verify_admin(authorization: str | None):
    """Supabase Auth 액세스 토큰(Bearer) 검증."""
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="인증이 필요합니다.")
    token = authorization.split(" ", 1)[1].strip()
    apikey = SUPABASE_ANON_KEY or SUPABASE_KEY
    if not (SUPABASE_URL and apikey):
        raise HTTPException(status_code=503, detail="Supabase Auth가 설정되지 않았습니다.")
    try:
        async with httpx.AsyncClient(timeout=10) as hc:
            r = await hc.get(f"{SUPABASE_URL}/auth/v1/user",
                             headers={"apikey": apikey, "Authorization": f"Bearer {token}"})
    except Exception as e:  # noqa: BLE001
        logger.exception("auth verify error: %s", e)
        raise HTTPException(status_code=502, detail="인증 서버 오류")
    if r.status_code != 200:
        raise HTTPException(status_code=401, detail="유효하지 않은 세션입니다.")
    user = r.json()
    if ADMIN_EMAIL and (user.get("email") or "").lower() != ADMIN_EMAIL.lower():
        raise HTTPException(status_code=403, detail="관리자 권한이 없습니다.")
    return user

def _send_email_sync(subject: str, body: str):
    if not (SMTP_HOST and MAIL_TO):
        return
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = MAIL_FROM or SMTP_USER or "no-reply@semyung.co.kr"
    msg["To"] = MAIL_TO
    msg.set_content(body)
    ctx = ssl.create_default_context()
    if SMTP_PORT == 465:
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, context=ctx, timeout=15) as s:
            if SMTP_USER:
                s.login(SMTP_USER, SMTP_PASS)
            s.send_message(msg)
    else:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as s:
            s.starttls(context=ctx)
            if SMTP_USER:
                s.login(SMTP_USER, SMTP_PASS)
            s.send_message(msg)


# ===========================================================
# 스키마
# ===========================================================
class ChatTurn(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    history: list[ChatTurn] = Field(default_factory=list)
    lang: str = "ko"
    @field_validator("history")
    @classmethod
    def cap(cls, v): return v[-10:]

class ContactRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    phone: str = Field(..., min_length=1, max_length=40)
    email: str = Field("", max_length=200)
    interest: str = Field("", max_length=100)
    message: str = Field(..., min_length=1, max_length=4000)

class PostRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=300)
    category: str = Field("", max_length=100)
    excerpt: str = Field("", max_length=500)
    content: str = Field(..., min_length=1)
    published: bool = True

class CustomerRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    phone: str = Field("", max_length=40)
    email: str = Field("", max_length=200)
    plan: str = Field("", max_length=50)
    monthly_fee: int = 0
    status: str = Field("이용중", max_length=20)
    start_date: str | None = None
    note: str = Field("", max_length=1000)

class PaymentRequest(BaseModel):
    customer_id: int | None = None
    customer_name: str = Field("", max_length=100)
    amount: int = 0
    method: str = Field("", max_length=30)
    paid_at: str | None = None
    note: str = Field("", max_length=500)

class StatusRequest(BaseModel):
    status: str = Field(..., max_length=20)


# ===========================================================
# 공개 API
# ===========================================================
@app.get("/api/health")
def health():
    return {"status": "ok", "claude": bool(get_claude()),
            "supabase": bool(SUPABASE_URL and SUPABASE_KEY),
            "auth": bool(SUPABASE_URL and (SUPABASE_ANON_KEY or SUPABASE_KEY)),
            "email": bool(SMTP_HOST and MAIL_TO), "model": CLAUDE_MODEL}

@app.get("/api/config")
def config():
    """프론트(Supabase Auth·카카오)용 공개 설정."""
    return {"supabaseUrl": SUPABASE_URL, "supabaseAnonKey": SUPABASE_ANON_KEY,
            "kakaoUrl": KAKAO_CHANNEL_URL, "target": TARGET_CUSTOMERS}

@app.post("/api/chat")
def chat(req: ChatRequest):
    client = get_claude()
    if not client:
        raise HTTPException(status_code=503, detail="AI 상담이 아직 설정되지 않았습니다. 02-762-3009로 연락 주세요.")
    messages = [{"role": t.role, "content": t.content} for t in req.history if t.role in ("user", "assistant")]
    messages.append({"role": "user", "content": req.message})
    try:
        resp = client.messages.create(model=CLAUDE_MODEL, max_tokens=1024, system=SYSTEM_PROMPT, messages=messages,
                                      output_config={"effort": CLAUDE_EFFORT})
        reply = next((b.text for b in resp.content if b.type == "text"), "").strip()
        return {"reply": reply or "죄송합니다. 다시 한 번 질문해 주시겠어요?"}
    except Exception as e:  # noqa: BLE001
        logger.exception("chat error: %s", e)
        raise HTTPException(status_code=502, detail="AI 응답 생성 중 오류가 발생했습니다.")

@app.post("/api/contact")
async def contact(req: ContactRequest):
    record = req.model_dump()
    stored = False
    if SUPABASE_URL and SUPABASE_KEY:
        try:
            async with httpx.AsyncClient(timeout=10) as hc:
                r = await hc.post(f"{SUPABASE_URL}/rest/v1/contacts", headers=supa_headers("return=minimal"), json=record)
            stored = r.status_code < 400
            if not stored:
                logger.error("contact insert %s: %s", r.status_code, r.text)
        except Exception as e:  # noqa: BLE001
            logger.exception("contact save error: %s", e)
    else:
        logger.info("[CONTACT] (Supabase 미설정) %s", record)
    # 자동 이메일 알림 (베스트에포트: 실패해도 접수는 성공)
    try:
        body = (f"[세명장교 홈페이지 문의]\n\n이름: {record['name']}\n연락처: {record['phone']}\n"
                f"이메일: {record.get('email','')}\n관심: {record.get('interest','')}\n\n{record['message']}\n")
        await asyncio.to_thread(_send_email_sync, f"[문의] {record['name']} 님", body)
    except Exception as e:  # noqa: BLE001
        logger.warning("mail send failed: %s", e)
    return {"ok": True, "stored": stored}

@app.get("/api/blog")
async def blog_list():
    if not (SUPABASE_URL and SUPABASE_KEY):
        return []
    url = (f"{SUPABASE_URL}/rest/v1/posts?select=id,title,category,excerpt,content,created_at"
           "&published=eq.true&order=created_at.desc")
    try:
        async with httpx.AsyncClient(timeout=10) as hc:
            r = await hc.get(url, headers=supa_headers())
        return r.json() if r.status_code < 400 else []
    except Exception as e:  # noqa: BLE001
        logger.exception("blog list: %s", e)
        return []

@app.get("/api/blog/{post_id}")
async def blog_detail(post_id: int):
    require_supabase()
    url = (f"{SUPABASE_URL}/rest/v1/posts?select=id,title,category,excerpt,content,created_at"
           f"&id=eq.{post_id}&published=eq.true")
    async with httpx.AsyncClient(timeout=10) as hc:
        r = await hc.get(url, headers=supa_headers())
    rows = r.json() if r.status_code < 400 else []
    if not rows:
        raise HTTPException(status_code=404, detail="글을 찾을 수 없습니다.")
    return rows[0]


# ===========================================================
# 관리자 API (Supabase Auth Bearer)
# ===========================================================
async def _get(url: str):
    async with httpx.AsyncClient(timeout=10) as hc:
        r = await hc.get(url, headers=supa_headers())
    if r.status_code >= 400:
        raise HTTPException(status_code=502, detail="조회 실패")
    return r.json()

async def _mutate(method: str, url: str, json=None, prefer="return=minimal"):
    async with httpx.AsyncClient(timeout=10) as hc:
        r = await hc.request(method, url, headers=supa_headers(prefer), json=json)
    if r.status_code >= 400:
        logger.error("mutate %s %s -> %s: %s", method, url, r.status_code, r.text)
        raise HTTPException(status_code=502, detail="저장 실패")
    try:
        return r.json()
    except Exception:  # noqa: BLE001
        return None

@app.get("/api/admin/summary")
async def admin_summary(authorization: str | None = Header(default=None)):
    await verify_admin(authorization); require_supabase()
    from datetime import date
    customers = await _get(f"{SUPABASE_URL}/rest/v1/customers?select=id,status")
    payments = await _get(f"{SUPABASE_URL}/rest/v1/payments?select=amount,paid_at")
    active = [c for c in customers if c.get("status") == "이용중"]
    ym = date.today().strftime("%Y-%m")
    revenue_total = sum(int(p.get("amount") or 0) for p in payments)
    revenue_month = sum(int(p.get("amount") or 0) for p in payments if str(p.get("paid_at") or "").startswith(ym))
    count = len(customers)
    return {"customer_count": count, "active_count": len(active),
            "revenue_total": revenue_total, "revenue_month": revenue_month,
            "target": TARGET_CUSTOMERS, "progress": round(count / TARGET_CUSTOMERS * 100, 1) if TARGET_CUSTOMERS else 0}

# ---- 문의 ----
@app.get("/api/admin/contacts")
async def admin_contacts(authorization: str | None = Header(default=None)):
    await verify_admin(authorization); require_supabase()
    return await _get(f"{SUPABASE_URL}/rest/v1/contacts?select=*&order=created_at.desc")

@app.patch("/api/admin/contacts/{cid}")
async def admin_contact_status(cid: int, req: StatusRequest, authorization: str | None = Header(default=None)):
    await verify_admin(authorization); require_supabase()
    await _mutate("PATCH", f"{SUPABASE_URL}/rest/v1/contacts?id=eq.{cid}", {"status": req.status})
    return {"ok": True}

# ---- 고객 ----
@app.get("/api/admin/customers")
async def admin_customers(authorization: str | None = Header(default=None)):
    await verify_admin(authorization); require_supabase()
    return await _get(f"{SUPABASE_URL}/rest/v1/customers?select=*&order=created_at.desc")

@app.post("/api/admin/customers")
async def admin_customer_create(req: CustomerRequest, authorization: str | None = Header(default=None)):
    await verify_admin(authorization); require_supabase()
    data = {k: v for k, v in req.model_dump().items() if v not in (None, "")}
    res = await _mutate("POST", f"{SUPABASE_URL}/rest/v1/customers", data, "return=representation")
    return {"ok": True, "customer": (res or [None])[0]}

@app.put("/api/admin/customers/{cid}")
async def admin_customer_update(cid: int, req: CustomerRequest, authorization: str | None = Header(default=None)):
    await verify_admin(authorization); require_supabase()
    await _mutate("PATCH", f"{SUPABASE_URL}/rest/v1/customers?id=eq.{cid}", req.model_dump())
    return {"ok": True}

@app.delete("/api/admin/customers/{cid}")
async def admin_customer_delete(cid: int, authorization: str | None = Header(default=None)):
    await verify_admin(authorization); require_supabase()
    await _mutate("DELETE", f"{SUPABASE_URL}/rest/v1/customers?id=eq.{cid}")
    return {"ok": True}

# ---- 결제/매출 ----
@app.get("/api/admin/payments")
async def admin_payments(authorization: str | None = Header(default=None)):
    await verify_admin(authorization); require_supabase()
    return await _get(f"{SUPABASE_URL}/rest/v1/payments?select=*&order=paid_at.desc")

@app.post("/api/admin/payments")
async def admin_payment_create(req: PaymentRequest, authorization: str | None = Header(default=None)):
    await verify_admin(authorization); require_supabase()
    data = {k: v for k, v in req.model_dump().items() if v not in (None, "")}
    res = await _mutate("POST", f"{SUPABASE_URL}/rest/v1/payments", data, "return=representation")
    return {"ok": True, "payment": (res or [None])[0]}

@app.delete("/api/admin/payments/{pid}")
async def admin_payment_delete(pid: int, authorization: str | None = Header(default=None)):
    await verify_admin(authorization); require_supabase()
    await _mutate("DELETE", f"{SUPABASE_URL}/rest/v1/payments?id=eq.{pid}")
    return {"ok": True}

# ---- 블로그 ----
@app.get("/api/admin/posts")
async def admin_posts(authorization: str | None = Header(default=None)):
    await verify_admin(authorization); require_supabase()
    return await _get(f"{SUPABASE_URL}/rest/v1/posts?select=*&order=created_at.desc")

@app.post("/api/admin/posts")
async def admin_post_create(req: PostRequest, authorization: str | None = Header(default=None)):
    await verify_admin(authorization); require_supabase()
    res = await _mutate("POST", f"{SUPABASE_URL}/rest/v1/posts", req.model_dump(), "return=representation")
    return {"ok": True, "post": (res or [None])[0]}

@app.put("/api/admin/posts/{pid}")
async def admin_post_update(pid: int, req: PostRequest, authorization: str | None = Header(default=None)):
    await verify_admin(authorization); require_supabase()
    await _mutate("PATCH", f"{SUPABASE_URL}/rest/v1/posts?id=eq.{pid}", req.model_dump())
    return {"ok": True}

@app.delete("/api/admin/posts/{pid}")
async def admin_post_delete(pid: int, authorization: str | None = Header(default=None)):
    await verify_admin(authorization); require_supabase()
    await _mutate("DELETE", f"{SUPABASE_URL}/rest/v1/posts?id=eq.{pid}")
    return {"ok": True}


# ===========================================================
# 정적 프론트엔드
# ===========================================================
for sub in ("css", "js", "icons", "images"):
    d = ROOT / sub
    if d.is_dir():
        app.mount(f"/{sub}", StaticFiles(directory=str(d)), name=sub)

ALLOWED_SUFFIX = {".html", ".json", ".webmanifest", ".js", ".ico", ".png", ".txt", ".xml", ".svg"}

@app.get("/{path:path}")
def serve_frontend(path: str):
    if path in ("", "/"):
        return FileResponse(str(ROOT / "index.html"))
    if "/" not in path and "\\" not in path and ".." not in path:
        candidate = (ROOT / path).resolve()
        if candidate.parent == ROOT and candidate.is_file() and candidate.suffix.lower() in ALLOWED_SUFFIX:
            return FileResponse(str(candidate))
    idx = ROOT / "index.html"
    if idx.is_file():
        return FileResponse(str(idx))
    raise HTTPException(status_code=404, detail="Not found")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", "8000")), reload=True)
