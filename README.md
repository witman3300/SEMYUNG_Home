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
- ✅ **회원 기능**(헤더 계정 버튼): 회원가입·로그인·회원정보 수정·로그아웃,
  네이버·카카오·구글 소셜 로그인, 마지막 사용 수단 '최근 사용' 배지
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
| `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET` | 네이버 로그인(선택) |
| `NAVER_REDIRECT_URI` | 네이버 콜백 `https://semyung.co.kr/api/auth/naver/callback` |
| `PUBLIC_BASE_URL` | 네이버 콜백 기본값 계산(기본 `https://semyung.co.kr`) |

## Railway 배포
GitHub 연결(NIXPACKS + `requirements.txt` 자동) → Variables에 위 키 등록 →
시작 `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`(railway.json/Procfile) → 헬스체크 `/api/health` →
커스텀 도메인 `semyung.co.kr` 연결.

## 회원 기능 설정 체크리스트
코드는 배포돼 있지만 **아래를 설정하기 전에는 동작하지 않습니다.**
설정 전에 회원가입을 누르면 "회원 기능이 아직 설정되지 않았습니다" 안내만 표시됩니다.

> 프론트는 시작할 때 `/api/config`에서 Supabase 주소·anon 키를 받아옵니다(`js/layout.js`).
> 이 주소는 **Railway 백엔드에만** 있으므로, 정적 호스팅(Vercel)만으로는 회원 기능이 동작하지 않습니다.

**DB 스키마 변경은 필요 없습니다.** 회원은 Supabase가 관리하는 `auth.users`에 쌓이고,
이름·연락처는 `user_metadata`에 저장됩니다. `schema.sql`의 4개 테이블은 그대로 두면 됩니다.

### 1단계 — Supabase (필수)
- [ ] **Authentication → Providers → Email** 활성화 확인
      `Confirm email` 켬 = 가입 후 확인 메일 발송 / 끔 = 즉시 로그인. **코드는 양쪽 다 처리**
- [ ] **Authentication → URL Configuration**
  - [ ] `Site URL` = `https://semyung.co.kr`
  - [ ] `Redirect URLs` 에 `https://semyung.co.kr/**` 추가
        ⚠️ **빠뜨리면 소셜 로그인 후 엉뚱한 페이지로 돌아옵니다. 가장 흔한 실수**
  - [ ] 도메인 연결(3단계) 전에 테스트한다면 Railway 임시 주소도 함께 등록
        (예: `https://xxxx.up.railway.app/**`)
- [ ] **Settings → API** 에서 `URL`·`anon`·`service_role` 키 확보 (2단계에서 사용)

### 2단계 — Railway 환경변수 (필수)
- [ ] `SUPABASE_URL` · `SUPABASE_ANON_KEY` · `SUPABASE_SERVICE_KEY`
      (관리자 기능에 이미 쓰고 있다면 그대로 두면 됩니다)
- [ ] 저장 후 재배포 → `/api/config` 가 `supabaseUrl`·`supabaseAnonKey` 를 반환하는지 확인
```bash
curl -s https://<배포주소>/api/config
```

### 3단계 — 도메인 연결 (필수)
- [ ] `semyung.co.kr` 을 Railway 커스텀 도메인으로 연결
      현재 이 도메인은 구 워드프레스를 가리키고 있어, 옮기기 전까지는
      **Railway 임시 주소에서만** 회원 기능이 동작합니다.

### 4단계 — 구글 로그인 (선택)
- [ ] Google Cloud Console → OAuth 클라이언트 ID 생성
- [ ] 승인된 리디렉션 URI: `https://<프로젝트>.supabase.co/auth/v1/callback`
- [ ] Supabase → Authentication → Providers → **Google** 활성화 후 Client ID·Secret 입력

### 5단계 — 카카오 로그인 (선택)
- [ ] Kakao Developers → 애플리케이션 등록 → **카카오 로그인** 활성화
- [ ] Redirect URI: `https://<프로젝트>.supabase.co/auth/v1/callback`
- [ ] 동의항목에서 **이메일**을 필수/선택으로 설정 (이메일이 없으면 계정 생성 불가)
- [ ] Supabase → Providers → **Kakao** 활성화 후 REST API 키·Client Secret 입력

### 6단계 — 네이버 로그인 (선택, 코드가 직접 처리)
> 네이버는 Supabase 지원 목록에 없어 백엔드(`/api/auth/naver/*`)가 OAuth를 직접 처리한 뒤
> Supabase 사용자 생성 → 매직링크로 세션을 발급합니다. 그래서 `SUPABASE_SERVICE_KEY`가 필요합니다.

- [ ] [네이버 개발자센터](https://developers.naver.com) → 애플리케이션 등록
- [ ] 사용 API: **네이버 로그인**
- [ ] 제공 정보에 **이메일 주소를 '필수'로 체크**
      ⚠️ **이메일이 없으면 가입이 막힙니다**(`auth_error=naver_email_required`)
- [ ] 서비스 URL `https://semyung.co.kr`
- [ ] Callback URL `https://semyung.co.kr/api/auth/naver/callback`
- [ ] Railway 변수 추가: `NAVER_CLIENT_ID` `NAVER_CLIENT_SECRET` `NAVER_REDIRECT_URI` `PUBLIC_BASE_URL`

### 7단계 — 동작 확인
- [ ] 헤더 **로그인 · 회원가입** → 이메일로 가입 → Supabase **Authentication → Users** 에 계정 생성 확인
- [ ] 로그인 후 헤더에 이름 표시 → 드롭다운 **회원정보 수정** → 이름·연락처 저장 확인
- [ ] 소셜 버튼 각각 로그인 → 되돌아왔을 때 로그인 상태 + **'최근 사용' 배지** 표시 확인
- [ ] 로그아웃 → 다시 열었을 때 직전 수단에 배지가 남아 있는지 확인

**문제가 생기면** 주소창의 `?auth_error=` 값을 확인하세요 (네이버 흐름에서만 발생).

| 값 | 뜻 |
|---|---|
| `naver_not_configured` | `NAVER_CLIENT_ID/SECRET` 또는 Supabase 변수 누락 |
| `naver_email_required` | 네이버 앱에서 이메일 제공을 필수로 설정하지 않음 |
| `invalid_state` | 요청이 10분을 넘겼거나 서버가 재시작됨 (state는 메모리 보관) |
| `no_code` | 이용자가 네이버 동의 화면에서 취소 |
| `token_exchange_failed` | 네이버 토큰 발급 실패 — Client Secret·Callback URL 확인 |
| `session_issue_failed` | Supabase 사용자 생성/세션 발급 실패 — `SUPABASE_SERVICE_KEY` 확인 |

## API
| 메서드 | 경로 | 인증 | 설명 |
|---|---|---|---|
| GET | `/api/health` `/api/config` | - | 상태 / 공개설정 |
| POST | `/api/chat` | - | Claude 챗봇(+창업진단) |
| POST | `/api/contact` | - | 문의 저장 + 이메일 |
| GET | `/api/auth/naver/start` | - | 네이버 동의 화면으로 이동 |
| GET | `/api/auth/naver/callback` | - | 네이버 코드 → Supabase 세션 발급 |
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

## 반응형 · 기기 대응
`css/style.css` 하단 "기기 대응" 블록. 브레이크포인트는 380 / 480 / 560 / 700–1024 / 1024 / 1025–1180 / 1240px.

- **iOS**: 폼 입력 16px 고정(포커스 시 자동 확대 방지), `env(safe-area-inset-*)`로 노치·홈 인디케이터 회피,
  `100dvh`로 주소창 높이 변화 대응, `-webkit-text-size-adjust:100%`
- **Android·터치 공통**: `@media (pointer: coarse)`에서 탭 영역 최소 44px, hover 전용 효과 해제
- **태블릿**: 세로(700–1024) 2열 그리드·풀폭 컨테이너, 가로(1025–1180) 4열 압축 레이아웃
- **기타**: 폰 가로 모드(높이 ≤520px) 히어로 축소, 인쇄 스타일
- 좌우 여백은 `--gutter` 변수로 관리 — 안전영역 규칙과 충돌 없이 브레이크포인트마다 값만 바꾼다.

검증: 10개 뷰포트(360~1440) × 4개 페이지 = 40조합에서 가로 오버플로 0건.

## SEO · AEO · GEO
| 항목 | 위치 |
|---|---|
| 페이지별 title·description·canonical·OG·Twitter·geo 메타 | 공개 8개 페이지 `<head>` |
| 구조화 데이터 JSON-LD | 각 페이지 `@graph` — Organization+LocalBusiness+ProfessionalService, WebSite, WebPage, BreadcrumbList, Service, OfferCatalog(요금 9종) |
| **AEO** FAQ | `index.html#faq` 질문 10개 + `FAQPage` 스키마(본문과 동일 문안) + `speakable` |
| **GEO** AI 인용용 요약 | `llms.txt` — 요금·주소·교통·인용 시 유의사항 |
| 크롤러 정책 | `robots.txt` — 검색엔진(Yeti·Daumoa 포함) + GPTBot·ClaudeBot·PerplexityBot 등 명시 허용, `/admin.html`·`/api/` 차단 |
| 사이트맵 | `sitemap.xml` (8 URL) |
| 정규 주소 | `/about` 같은 확장자 없는 주소도 `about.html`로 응답, 없는 주소는 **실제 404**(`404.html`) — 소프트 404 제거 |
| 성능 | 정적 자산 `Cache-Control` 미들웨어(7일), HTML은 must-revalidate |
| OG 이미지 | `images/og-cover.jpg` (1200×630), 로고 `images/logo-512.png` |

## 확인 필요 / 남은 항목
- 🔐 **회원 기능 설정 미완료** — 위 체크리스트 1~3단계를 마쳐야 회원가입이 동작합니다.
  소셜 로그인은 자격증명이 없어 실제 OAuth 왕복이 미검증 상태입니다(미설정 시 안내 표시까지만 확인).
- 🔗 카카오 채널 실제 URL(`KAKAO_CHANNEL_URL`), 사업하자 연동 심도(현재 링크)
- 🚀 Vercel 배포(`semyung-home-qwpa.vercel.app`)가 `7c234d5`(2026-06)에 고정되어 서브페이지 전부 404 — 최신 main 재연결 필요
- 🌐 하위 6개 서비스 페이지 본문 영문화(현재 홈+공통만 EN, 확장 가능)
- 📧 SMTP 계정(자동이메일용)
- ⚠️ **git remote의 GitHub 토큰(`ghp_...`) 폐기** — 저장소 URL에 노출됨(보안)
```
git remote set-url origin https://github.com/witman3300/SEMYUNG_Home.git
```
