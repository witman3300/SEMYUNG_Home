# 세명장교 비즈니스센터 (semyung.co.kr)

서울 을지로2가 **AI특화 비즈니스센터** 종합 홈페이지 — 웹+앱(PWA)+반응형+대화형(AI)+정보제공+DB관리형.

- **프론트**: HTML/CSS/Vanilla JS (**정적 멀티페이지**, 빌드 도구 없음)
- **백엔드**: Python FastAPI · **DB**: Supabase · **LLM**: Anthropic Claude(`claude-opus-4-8`)
- **배포**: Railway · **도메인**: semyung.co.kr · **저장소**: `witman3300/SEMYUNG_Home`

## 브랜드
레드 `#CC0000` · 블루 `#1A237E` · 골드 `#B8960C` · 네이비 `#0D1B3E`
로고 `images/semyung-logo.png` (없으면 레드+블루 S 심볼 자동 폴백) · 경영이념 **고객만족·행복추구·초지일관**
상호 세명장교 비즈니스센터 · 서울 중구 삼일대로 363, 장교빌딩 810호 · ☎ 02-762-3009

## 페이지
`/`(홈) `/about` `/virtual` `/consulting` `/ai-edu` `/insurance` `/contact` `/blog` `/admin`
(각각 `*.html`. 공통 헤더·푸터·챗봇·한영토글은 `js/layout.js`로 주입, 본문은 정적 → SEO 유지)

## 구현 기능
- ✅ 반응형(모바일 우선) · PWA(`manifest.json`+`service-worker.js`, 설치·오프라인)
- ✅ **한국어/영어 토글**(헤더 KO·EN, 설정 저장) — 공통 chrome + 홈 전 섹션
- ✅ 히어로 실시간 AI 상담창 + 전 페이지 플로팅 AI 챗봇(Claude) · 자동 창업진단 프롬프트
- ✅ 사업하자(sauphaja.ai.kr) 연동 · 구글맵 · 고용노동부 인접(노동·노무 특화)
- ✅ 문의폼 → Supabase 저장 **+ 자동 이메일 알림**(SMTP) · 카카오채널 링크
- ✅ 블로그 Supabase CRUD · 스크롤 애니메이션
- ✅ **관리자 대시보드**(Supabase Auth 로그인): 매출·이번달매출·고객수·**1,000개 진척률**,
  고객 현황, 계약·결제, 문의 처리(상태), 블로그 관리

## 로컬 실행
```bash
python -m venv .venv && .venv\Scripts\activate        # mac/linux: source .venv/bin/activate
pip install -r requirements.txt
copy backend\.env.example backend\.env                # 값 입력(셸 export 또는 python-dotenv)
uvicorn backend.main:app --reload --port 8000         # http://localhost:8000
```
키 없이도 사이트는 동작(챗봇=안내문구, 문의=서버로그, 블로그=빈목록, 관리자=설정필요 안내).

## Supabase
1. **SQL Editor** 에서 `backend/schema.sql` 실행 → `contacts·posts·customers·payments` 생성
2. **Authentication → Users** 에서 관리자 계정(이메일/비번) 생성 → `/admin` 로그인용
3. **Settings → API** 에서 `URL`·`service_role`·`anon` 키 확인 → 환경변수 등록

## 환경변수 (`backend/.env.example` 참고)
| 키 | 용도 |
|---|---|
| `ANTHROPIC_API_KEY`, `CLAUDE_MODEL` | Claude 챗봇 |
| `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` | 서버 DB 접근(RLS 우회) |
| `SUPABASE_ANON_KEY` | 관리자 로그인(Supabase Auth)·프론트 |
| `ADMIN_EMAIL` | (선택) 이 이메일만 관리자 허용 |
| `KAKAO_CHANNEL_URL` | 카카오채널 링크 |
| `SMTP_HOST/PORT/USER/PASS/MAIL_FROM/MAIL_TO` | 문의 자동이메일(선택) |
| `TARGET_CUSTOMERS` | 진척률 목표(기본 1000) |

## Railway 배포
GitHub 연결(NIXPACKS + `requirements.txt` 자동) → Variables에 위 키 등록 →
시작 `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`(railway.json/Procfile) → 헬스체크 `/api/health` →
커스텀 도메인 `semyung.co.kr` 연결.

## API
| 메서드 | 경로 | 인증 | 설명 |
|---|---|---|---|
| GET | `/api/health` `/api/config` | - | 상태 / 공개설정 |
| POST | `/api/chat` | - | Claude 챗봇(+창업진단) |
| POST | `/api/contact` | - | 문의 저장 + 이메일 |
| GET | `/api/blog[/{id}]` | - | 공개 블로그 |
| GET | `/api/admin/summary` | Bearer | 매출·고객·진척률 |
| GET/PATCH | `/api/admin/contacts[/{id}]` | Bearer | 문의 조회·상태 |
| GET/POST/PUT/DELETE | `/api/admin/customers[/{id}]` | Bearer | 고객 CRUD |
| GET/POST/DELETE | `/api/admin/payments[/{id}]` | Bearer | 결제/매출 |
| GET/POST/PUT/DELETE | `/api/admin/posts[/{id}]` | Bearer | 블로그 CRUD |

관리자 API는 Supabase Auth 액세스 토큰(`Authorization: Bearer`)을 백엔드가 `/auth/v1/user`로 검증합니다.

## 구 사이트(semyung.co.kr) 콘텐츠 이관
기존 워드프레스 사이트의 실제 영업 정보를 신규 사이트 본문에 반영 완료.
수집 원본은 `data/`(구조화 JSON + WP REST 원본), 이미지는 `images/legacy/` 참조.

| 구 사이트 | 반영 위치 |
|---|---|
| `sm1` 센터소개 (최고의 위치·가격·지원) | `about.html` — 센터 소개 / 세 가지 약속 |
| `sm2` 부가서비스 (회의실·애니워크·OA·인프라) | `virtual.html#addon` 상세 + `index.html#free` 요약 |
| `sm3` 사무실안내 (1인실·다인실·회의실·고정석) | `virtual.html` 사무실 유형 + `index.html#gallery` |
| `sm3` 가격표 (상주·비상주·**단기**) | `index.html#pricing`, `virtual.html` |
| `location` 오시는 길 (1~5호선·버스·주차) | `index.html#location`, `contact.html#directions` |
| 연락처·SNS·관련 사이트 | `js/layout.js` `CFG` → 공통 푸터 |

## 확인 필요 / 남은 항목
- 🔗 카카오 채널 실제 URL(`KAKAO_CHANNEL_URL`), 사업하자 연동 심도(현재 링크)
- 🚀 Vercel 배포(`semyung-home-qwpa.vercel.app`)가 `7c234d5`(2026-06)에 고정되어 서브페이지 전부 404 — 최신 main 재연결 필요
- 🌐 하위 6개 서비스 페이지 본문 영문화(현재 홈+공통만 EN, 확장 가능)
- 📧 SMTP 계정(자동이메일용)
- ⚠️ **git remote의 GitHub 토큰(`ghp_...`) 폐기** — 저장소 URL에 노출됨(보안)
```
git remote set-url origin https://github.com/witman3300/SEMYUNG_Home.git
```
