/* ===========================================================
   세명장교 비즈니스센터 — layout.js
   공통 헤더/푸터/챗봇 주입 + 네비 + 한/영 토글 + 폼 + PWA (전 페이지)
   =========================================================== */
(function () {
  'use strict';

  const CFG = {
    brand: '세명장교', sub: '비즈니스센터',
    tel: '027623009', telDisp: '02-762-3009',
    mobile: '01089553300', mobileDisp: '010-8955-3300',
    faxDisp: '02-763-3032',
    hours: '24시간 연중무휴',
    kakao: 'https://pf.kakao.com/', sauphaja: 'https://sauphaja.ai.kr',
    addr: '서울특별시 중구 삼일대로 363, 장교빌딩 810호',
    addrJibun: '서울특별시 중구 장교동 1번지 장교빌딩 810호',
    ceo: '이상진', email: 'witman@naver.com', bizNo: '168-45-00331',
    motto: '고객만족 · 행복추구 · 초지일관',
    // 구 semyung.co.kr에서 운영하던 채널·제휴 사이트
    sns: {
      instagram: 'https://www.instagram.com/semyungcenter/',
      youtube: 'https://www.youtube.com/@WSPC_semyungdab',
      naverBlog: 'https://blog.naver.com/witman',
    },
    map: { naver: 'https://naver.me/xwm168bU', google: 'https://maps.app.goo.gl/PpJZwhHTUZXKf67t6' },
    partners: [
      { name: '세명동탄비즈니스센터', url: 'https://blog.naver.com/smdongtan' },
      { name: '판촉물전문 유앤미기프트', url: 'http://unmi.co.kr' },
      { name: '경비복전문 유앤미단체복', url: 'http://unmi.kr' },
      { name: '유앤미 블로그', url: 'https://blog.naver.com/unmi0406' },
    ],
  };
  window.SJ = window.SJ || {};
  window.SJ.CFG = CFG;

  /* ---------- i18n ---------- */
  const T = {
    'brand.sub': ['비즈니스센터', 'Business Center'],
    'nav.about': ['회사소개', 'About'],
    'nav.services': ['서비스', 'Services'],
    'nav.virtual': ['비상주사무실', 'Virtual Office'],
    'nav.consulting': ['창업컨설팅', 'Startup Consulting'],
    'nav.aiedu': ['AI교육', 'AI Training'],
    'nav.insurance': ['금융컨설팅', 'Finance'],
    'nav.office': ['사무실안내', 'Offices'],
    'nav.pricing': ['이용요금 안내', 'Pricing'],
    'nav.gallery': ['시설 갤러리', 'Facilities'],
    'nav.addon': ['부가서비스 (회의실·OA)', 'Add-on Services'],
    'nav.aichat': ['AI 상담·창업진단', 'AI Advisor'],
    'nav.location': ['오시는 길', 'Location'],
    'nav.blog': ['블로그', 'Blog'],
    'nav.contact': ['고객지원', 'Contact'],
    'cta.inquire': ['입주 문의하기', 'Get Started'],
    'footer.services': ['서비스', 'Services'],
    'footer.quick': ['바로가기', 'Quick Links'],
    'footer.partners': ['관련 사이트', 'Related Sites'],
    'footer.mobile': [`휴대폰: <a href="tel:${CFG.mobile}">${CFG.mobileDisp}</a>`, `Mobile: <a href="tel:${CFG.mobile}">${CFG.mobileDisp}</a>`],
    'footer.hours': [`영업시간: ${CFG.hours}`, 'Hours: Open 24/7, all year'],
    'footer.diag': ['사업하자 진단 ↗', 'Business Diagnosis ↗'],
    'footer.bizname': ['상호: 세명장교 비즈니스센터', 'Semyung Janggyo Business Center'],
    'footer.ceo': [`대표: ${CFG.ceo}`, `CEO: Lee Sang-jin`],
    'footer.email': [`이메일: <a href="mailto:${CFG.email}">${CFG.email}</a>`, `Email: <a href="mailto:${CFG.email}">${CFG.email}</a>`],
    'footer.bizno': [`사업자등록번호: ${CFG.bizNo}`, `Business Reg. No. ${CFG.bizNo}`],
    'footer.motto': ['고객만족 · 행복추구 · 초지일관', 'Satisfaction · Happiness · Commitment'],
    'chat.title': ['세명장교 AI 상담원', 'Semyung Janggyo AI'],
    'chat.greeting': ['안녕하세요! 세명장교 비즈니스센터입니다. 요금·입주·창업진단 등 무엇이든 물어보세요. 😊',
      'Hello! This is Semyung Janggyo Business Center. Ask me about pricing, move-in, or startup diagnosis. 😊'],
    'chat.ph': ['메시지를 입력하세요...', 'Type a message...'],
    'chat.fab': ['AI 상담', 'AI Chat'],
    'sc.label': ['SHOWCASE', 'SHOWCASE'],
    'sc.title': ['한눈에 보는 세명장교', 'Semyung at a glance'],
    'sc.desc': ['말보다 이미지로 — 공간과 혜택을 확인하세요', 'Less telling, more showing'],
    'sc.cap1': ['프리미엄 입지', 'Prime Location'],
    'sc.cap2': ['합리적 요금', 'Fair Pricing'],
    'sc.cap3': ['창업 지원', 'Startup Support'],
    // 요금제
    'pr.label': ['PRICING', 'PRICING'],
    'pr.title': ['합리적인 이용 요금', 'Simple Pricing'],
    'pr.hl': ['주변 시세 대비 <span>50% 파격 할인</span>', '<span>50% off</span> vs. nearby market'],
    'pr.g1t': ['비상주 사무실', 'Virtual Office'],
    'pr.g1s': ['주소지·사업자등록 중심 · 6개월 일시불 시 50% 할인 기준', 'Address & registration · 50% off on 6-month prepay'],
    'pr.g2t': ['상주 사무실', 'Resident Office'],
    'pr.g2s': ['고정석부터 1·2·3인 독립실까지', 'From a fixed desk to private rooms'],
    'pr.g3t': ['단기 상주 사무실', 'Short-term Office'],
    'pr.g3s': ['하루부터 한 달까지, 필요한 기간만 · 사업자등록은 불가', 'From a day to a month — business registration not available'],
    'pr.c7': ['하루', 'One day'], 'pr.c8': ['일주일', 'One week'], 'pr.c9': ['한 달', 'One month'],
    'pr.per.day': ['/ 1일', '/ day'], 'pr.per.week': ['/ 7일', '/ 7 days'], 'pr.per.month': ['/ 1개월', '/ month'],
    'pr.note': ['※ 모든 금액 부가세 별도 · 상주 사무실은 보증금 별도 · 월 단위 계약 · 단기 상주는 사업자등록 불가', '※ VAT excluded · deposit applies to resident office · monthly contract · no business registration for short-term'],
    'pr.remote': ['※ 지방에 계신 분도 온라인으로 계약 가능합니다.', '※ Contracts can also be signed online from anywhere in Korea.'],
    'pr.apply': ['신청하기', 'Apply'],
    'pr.badge': ['추천', 'Best'],
    'pr.c1': ['개인 비상주', 'Personal Virtual'],
    'pr.c2': ['법인 비상주', 'Corporate Virtual'],
    'pr.c3': ['1인석 (고정)', 'Fixed Desk'],
    'pr.c4': ['1인실', '1-Person Room'],
    'pr.c5': ['2인실', '2-Person Room'],
    'pr.c6': ['3인실', '3-Person Room'],
    'pr.dep': ['보증금', 'Deposit'],
    // 무료 서비스
    'fr.label': ['FREE SERVICES', 'FREE SERVICES'],
    'fr.title': ['입주사에 드리는 무료 서비스', 'Free services for tenants'],
    'fr.desc': ['업무에 필요한 편의를 무료로 제공합니다', 'Everyday conveniences, all included'],
    'fr.1t': ['회의실 서비스', 'Meeting Rooms'], 'fr.1d': ['상주·비상주 대표님 모두 이용 가능 · 최대 3시간 무료', 'For all tenants — up to 3 hours free'],
    'fr.2t': ['애니워크 (비상주)', 'Anywork (Virtual)'], 'fr.2d': ['우편물·택배 수/발신, 스캔·사진 전송까지', 'Mail & parcel in/out, scan & photo forwarding'],
    'fr.3t': ['OA 서비스', 'OA Services'], 'fr.3d': ['KT 기가 와이파이·원두커피 무료, 인쇄·스캔·팩스·제본 지원', 'Free KT Giga Wi-Fi & coffee; print, scan, fax, binding'],
    'fr.4t': ['효율적인 업무 인프라', 'Business Infrastructure'], 'fr.4d': ['빌딩 내 400여 개 업체 · 은행·세무회계·법무법인·고용노동청 인접', '400+ firms in the building — banks, tax, law, labor office'],
    // 시설 갤러리
    'gal.label': ['GALLERY', 'GALLERY'],
    'gal.title': ['시설 갤러리', 'Facility Gallery'],
    'gal.desc': ['사무공간·회의공간을 미리 만나보세요', 'Preview our workspaces'],
    'gal.c1': ['1인실 — 도어락 보안', '1-Person Room — door lock'],
    'gal.c2': ['다인실 — 2·3인실', 'Shared Room — 2 to 3 people'],
    'gal.c3': ['회의실 — 최대 3시간 무료', 'Meeting Room — up to 3 hrs free'],
    'gal.c4': ['고정석 — 오픈 데스크', 'Fixed Desk — open plan'],
    'gal.c5': ['OA 서비스 — 인쇄·스캔·제본', 'OA — print, scan, binding'],
    'gal.c6': ['을지로2가 장교빌딩 8층', 'Janggyo Bldg 8F, Euljiro'],
    // ----- 홈(index.html) -----
    'hero.tag': ['🤖 AI특화 비즈니스센터 · 세명장교', '🤖 AI-Powered Business Center · Semyung'],
    'hero.title': ['서울의 중심에 서다!<br><span class="hl">일의 중심</span>을 찾다!', 'Stand at the center of Seoul,<br>find the center of <span class="hl">work</span>!'],
    's1.l': ['서울의 중심에 서다!', 'At the center of Seoul'], 's1.b': ['서울시 최중심', 'Central Seoul'],
    's2.l': ['사업장 최고의 주소지', 'A prime business address'], 's2.b': ['서울시 중구 삼일대로 363, 810호', 'Samil-daero 363, #810'],
    's2.addr': ['서울특별시 중구 장교동 1번지<br>장교빌딩 810호', 'Janggyo Bldg #810,<br>Janggyo-dong, Jung-gu, Seoul'],
    's3.l': ['사무활동 지원 서비스', 'Office support services'], 's3.b': ['우편물 포워딩·인쇄·복사·음료', 'Mail·Print·Copy·Drinks'],
    's4.l': ['비즈니스 협업 지원', 'Business collaboration'], 's4.b': ['창업·세무·마케팅', 'Startup·Tax·Marketing'],
    's5.l': ['최적의 입지! 지하철 초역세권', 'Prime spot by the subway'], 's5.b': ['지하철 1·2·3·4·5호선', 'Subway lines 1-5'],
    'hero.desc': ['청계천이 흐르는 도심 속, AI 특화 비즈니스센터',
      'An AI-powered business center in the heart of the city, by Cheonggyecheon'],
    'hero.cta1': ['입주 문의하기', 'Get Started'],
    'hero.cta2': ['센터 둘러보기', 'Explore the Center'],
    'hero.b1': ['안정 운영 (2016~)', 'Operating (2016~)'],
    'hero.b2': ['전문가 경력', 'Experience'],
    'hero.b3': ['AI 상담·연중무휴', 'AI · Open 24/7'],
    'hero.chat.h': ['AI 실시간 상담', 'Live AI Chat'],
    'svc.label': ['OUR SERVICES', 'OUR SERVICES'],
    'svc.title': ['4가지 핵심 서비스', '4 Core Services'],
    'svc.desc': ['시작부터 성장까지, 사업에 필요한 모든 것을 한 곳에서', 'Everything your business needs — from start to growth'],
    'svc1.t': ['비상주사무실', 'Virtual Office'], 'svc1.tag': ['월 최저가 · 즉시 입주', 'Lowest price · Instant'],
    'svc1.d': ['을지로2가 주소로 즉시 사업 시작.', 'Start instantly with a Euljiro address.'],
    'svc2.t': ['창업컨설팅', 'Startup Consulting'], 'svc2.tag': ['25년 전문가 · 실패없는 창업', '25 yrs expert'],
    'svc2.d': ['25년 전문가의 밀착 창업 컨설팅.', '25-year expert startup consulting.'],
    'svc3.t': ['AI교육', 'AI Training'], 'svc3.tag': ['실무 바로 적용', 'Apply right away'],
    'svc3.d': ['Claude·생성형 AI 실무 활용 교육.', 'Practical Claude & generative AI training.'],
    'svc4.t': ['금융컨설팅', 'Finance Consulting'], 'svc4.tag': ['삼성생명 25년 경력', 'Samsung Life 25 yrs'],
    'svc4.d': ['삼성생명 25년, 재무·자금 설계.', 'Samsung Life 25y — finance planning.'],
    'svc.more': ['자세히', 'More'],
    'num.label': ['TRUSTED BY NUMBERS', 'TRUSTED BY NUMBERS'],
    'num.title': ['숫자로 증명하는 신뢰', 'Trusted by numbers'],
    'num1': ['운영 연차', 'Years Operating'], 'num1s': ['2016년 창업', 'Since 2016'],
    'num2': ['전문 경력', 'Years Experience'], 'num2s': ['창업·금융 25년', 'Startup·Finance 25y'],
    'num3': ['목표 입주 기업', 'Target Companies'], 'num3s': ['함께 성장', 'Growing together'],
    'num4': ['서울 최중심', 'Central Seoul'], 'num4s': ['초역세권 입지', 'Prime location'],
    'ai.label': ['AI POWERED', 'AI POWERED'],
    'ai.title': ['AI가 함께하는<br>스마트한 창업', 'Smarter startups,<br>powered by AI'],
    'ai.desc': ['AI 챗봇과 자동 창업진단으로 더 똑똑한 출발.', 'AI chat & auto diagnosis for a smarter start.'],
    'ai.cta': ['입주 상담 신청', 'Request Consultation'],
    'ai.c1t': ['24시간 AI 챗봇', '24/7 AI Chatbot'], 'ai.c1d': ['Claude 기반 AI가 요금·입주·절차를 24시간 실시간 안내합니다.', 'Claude-based AI answers pricing, move-in and process 24/7.'],
    'ai.c2t': ['자동 창업진단', 'Auto Diagnosis'], 'ai.c2d': ['아이템과 상황을 입력하면 AI가 강점·리스크를 즉시 진단합니다.', 'Enter your idea and AI instantly assesses strengths and risks.'],
    'ai.c3t': ['사업하자 (sauphaja.ai.kr) 연동', 'Sauphaja (sauphaja.ai.kr)'], 'ai.c3d': ["세명장교의 AI 창업 플랫폼 '사업하자'와 연동하여 더 깊이 있는 진단·컨설팅을 제공합니다.", 'Integrated with our AI startup platform for deeper diagnosis.'],
    'ai.go': ['바로가기 ↗', 'Open ↗'],
    'loc.label': ['LOCATION', 'LOCATION'],
    'loc.title': ['을지로2가, 서울의 중심', 'Euljiro — the heart of Seoul'],
    'loc.desc': ['고용노동부·서울지방고용노동청과 가까운 노동·노무 특화 입지', 'Near the Ministry of Employment & Labor — labor/HR specialized'],
    'loc.hl.t': ['🏛️ 고용노동부·서울고용노동청 인접', '🏛️ Next to the Seoul Labor Office'],
    'loc.hl.d': ['노동·노무·노사 관련 업무에 최적화된 입지. 관공서 방문과 행정 처리가 가까워 시간을 아낄 수 있습니다.', 'Optimized for labor/HR matters — government offices nearby save you time.'],
    'loc.addr.t': ['주소', 'Address'],
    'loc.addr.v': ['서울특별시 중구 삼일대로 363, 장교빌딩 810호<br>(지번) 중구 장교동 1번지 장교빌딩 810호',
      'Janggyo Bldg #810, Samil-daero 363, Jung-gu, Seoul<br>(Lot) 1 Janggyo-dong, Jung-gu, Seoul'],
    'loc.sub.t': ['지하철', 'Subway'],
    'loc.sub.v': ['을지로3가·을지로입구·종각·종로3가·명동역 (1·2·3·4·5호선)', 'Euljiro 3-ga · Euljiro 1-ga · Jonggak · Jongno 3-ga · Myeongdong (lines 1-5)'],
    'loc.tel.t': ['전화', 'Phone'],
    'loc.hour.t': ['영업시간', 'Hours'], 'loc.hour.v': ['24시간 연중무휴', 'Open 24/7, all year'],
    'loc.navi': ['네이버 지도로 보기', 'Open in Naver Map'],
    'loc.gmap': ['구글 지도로 보기', 'Open in Google Maps'],
    // 오시는 길 상세 (구 semyung.co.kr /location)
    'rt.subway': ['지하철로 오시는 길', 'By subway'],
    'rt.l2': ['을지로3가역 하차 후 을지로2가 1번 출구(그라츠 제과점)로 나오시면 장교빌딩 지하 상제리제 상가와 연결되어 있습니다. 엘리베이터를 타고 8층으로 오세요.',
      'Get off at Euljiro 3-ga, take Euljiro 2-ga Exit 1 (Gratz Bakery); the Janggyo Building basement arcade connects directly. Take the elevator to the 8th floor.'],
    'rt.l3': ['을지로3가역 하차 후 을지로2가 1번 출구(그라츠 제과점)로 나오시면 장교빌딩 지하와 직접 연결되어 있습니다. 8층으로 올라오시면 됩니다.',
      'Get off at Euljiro 3-ga, take Euljiro 2-ga Exit 1 (Gratz Bakery) — it connects straight into the Janggyo Building basement. Come up to the 8th floor.'],
    'rt.l1': ['종각역 12번 출구에서 을지로3가역 방향으로 도보 7분. 한화빌딩과 붙어 있는 “서울고용노동청”이라고 쓰인 흰색 큰 건물을 찾으시면 됩니다.',
      'From Jonggak Exit 12, walk 7 minutes toward Euljiro 3-ga. Look for the large white building marked “Seoul Labor Office”, next to the Hanwha Building.'],
    'rt.l4': ['명동역에서 도보로 오실 수 있으나, 1·2·3호선으로 환승해 오시는 편이 편리합니다.',
      'Walkable from Myeongdong, but transferring to line 1, 2 or 3 is easier.'],
    'rt.l5': ['종로3가역 4번 출구에서 도보로 오실 수 있으나, 1·2·3호선으로 환승해 오시는 것을 추천드립니다.',
      'Walkable from Jongno 3-ga Exit 4, but transferring to line 1, 2 or 3 is recommended.'],
    'rt.bus.b': ['버스', 'Bus'],
    'rt.bus': ['을지로2가, 삼일교, IBK기업은행 본점, 서울고용노동청 정류장에서 하차 후 “서울고용노동청”을 찾으세요.',
      'Get off at Euljiro 2-ga, Samilgyo, IBK Bank HQ, or Seoul Labor Office, then look for the “Seoul Labor Office”.'],
    'rt.car.b': ['자가용', 'Car'],
    'rt.car': ['내비게이션에 “장교빌딩 주차장”을 검색해 오세요. 반드시 <strong>지하 2층</strong>에 주차하시기 바랍니다. (지하 3층은 한화빌딩 주차장입니다.)',
      'Search “Janggyo Building Parking” in your navigation. Please park on <strong>B2</strong> — B3 belongs to the Hanwha Building.'],
    'ct.label': ['GET IN TOUCH', 'GET IN TOUCH'],
    'ct.title': ['지금 바로 상담하세요', 'Talk to us now'],
    'ct.desc': ['전화, 카카오톡, 문의폼 중 편한 방법으로 연락 주세요. 빠르게 답변드리겠습니다.', 'Reach us by phone, KakaoTalk, or the form — we reply fast.'],
    'ct.call': ['전화 상담', 'Call Us'], 'ct.kakao': ['카카오톡 상담', 'KakaoTalk'], 'ct.kakao.s': ['채널 문의하기', 'Ask on channel'],
    'ct.formTitle': ['입주 · 상담 문의', 'Inquiry'],
    'f.name': ['이름 <i>*</i>', 'Name <i>*</i>'], 'f.phone': ['연락처 <i>*</i>', 'Phone <i>*</i>'],
    'f.email': ['이메일', 'Email'], 'f.interest': ['관심 서비스', 'Interest'],
    'f.msg': ['문의 내용 <i>*</i>', 'Message <i>*</i>'], 'f.agree': ['개인정보 수집 및 이용에 동의합니다. <i>*</i>', 'I agree to the privacy policy. <i>*</i>'],
    'f.submit': ['문의 보내기', 'Send'],
    'ph.name': ['홍길동', 'Your name'], 'ph.phone': ['010-0000-0000', '010-0000-0000'], 'ph.email': ['name@example.com', 'name@example.com'], 'ph.msg': ['문의하실 내용을 입력해 주세요.', 'Enter your message.'],
  };
  let lang = localStorage.getItem('sj-lang') || 'ko';
  function tr(k) { const v = T[k]; return v ? (lang === 'en' ? v[1] : v[0]) : null; }
  function applyLang() {
    const i = lang === 'en' ? 1 : 0;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => { const v = T[el.getAttribute('data-i18n')]; if (v && v[i] != null) el.innerHTML = v[i]; });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => { const v = T[el.getAttribute('data-i18n-ph')]; if (v && v[i] != null) el.placeholder = v[i]; });
    document.querySelectorAll('.lang-ko').forEach(e => e.classList.toggle('on', lang === 'ko'));
    document.querySelectorAll('.lang-en').forEach(e => e.classList.toggle('on', lang === 'en'));
  }
  window.SJ.lang = () => lang;

  /* ---------- nav ---------- */
  /* 상단 메뉴 — semyung.co.kr의 정보구조(회사소개·사무실안내·부가서비스·오시는 길·블로그)를
     현재 페이지 구성에 맞춰 반영. 앵커는 index.html의 실제 섹션 id를 가리킨다. */
  const NAV = [
    { key: 'nav.about', href: 'about.html' },
    { key: 'nav.office', href: '#', children: [
      { key: 'nav.virtual', href: 'virtual.html' },
      { key: 'nav.pricing', href: 'index.html#pricing' },
      { key: 'nav.gallery', href: 'index.html#gallery' },
    ]},
    { key: 'nav.services', href: '#', children: [
      { key: 'nav.consulting', href: 'consulting.html' },
      { key: 'nav.aiedu', href: 'ai-edu.html' },
      { key: 'nav.insurance', href: 'insurance.html' },
      { key: 'nav.addon', href: 'virtual.html#addon' },
      { key: 'nav.aichat', href: 'index.html#ai' },
    ]},
    { key: 'nav.location', href: 'index.html#location' },
    { key: 'nav.blog', href: 'blog.html' },
    { key: 'nav.contact', href: 'contact.html' },
  ];
  const LOGO_SVG = `<svg class="logo-mark" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <circle cx="24" cy="24" r="20" stroke="#1B5CFF" stroke-width="2"/>
    <path d="M31 17c-1.6-2-4-3-7-3-4.4 0-7 2.2-7 5.4 0 6.5 13 3.5 13 9.6 0 3.2-2.8 5.4-7 5.4-3.3 0-5.8-1.2-7.4-3.4" stroke="#CC0000" stroke-width="3.4" stroke-linecap="round" fill="none"/></svg>`;
  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  function logoBlock() {
    return `<a href="index.html" class="logo">
      <img class="logo-img" src="images/semyung-logo.png" alt="세명장교 로고">
      <span class="logo-text"><b>${CFG.brand}</b><em data-i18n="brand.sub">${CFG.sub}</em></span></a>`;
  }
  function wireLogoFallback() {
    document.querySelectorAll('img.logo-img').forEach((img) => {
      const swap = () => { if (img.parentNode) img.outerHTML = LOGO_SVG; };
      img.addEventListener('error', swap);
      if (img.complete && img.naturalWidth === 0) swap();
    });
  }

  function buildHeader() {
    const items = NAV.map(n => {
      const active = (n.children ? n.children.some(c => c.href === page) : n.href === page) ? 'active' : '';
      if (n.children) {
        const subs = n.children.map(c => `<a href="${c.href}" data-i18n="${c.key}">${tr(c.key)}</a>`).join('');
        return `<li class="gnb-item ${active}"><a href="#" class="gnb-link" onclick="return false"><span data-i18n="${n.key}">${tr(n.key)}</span>
          <svg class="gnb-caret" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
          <div class="sub-menu">${subs}</div></li>`;
      }
      return `<li class="gnb-item ${active}"><a href="${n.href}" class="gnb-link" data-i18n="${n.key}">${tr(n.key)}</a></li>`;
    }).join('');
    return `<header id="header"><div class="container header-inner">
      ${logoBlock()}
      <nav class="gnb" aria-label="주 메뉴"><ul class="gnb-list">${items}</ul></nav>
      <div class="header-actions">
        <button class="lang-toggle" id="langToggle" aria-label="Language"><span class="lang-ko">KO</span><span class="lang-sep">·</span><span class="lang-en">EN</span></button>
        <a href="contact.html" class="btn-inquire" data-i18n="cta.inquire">${tr('cta.inquire')}</a>
        <button class="hamburger" id="hamburger" aria-label="메뉴" aria-expanded="false"><span></span><span></span><span></span></button>
      </div></div></header>
      <div class="gnb-overlay" id="gnbOverlay"></div>
      <nav class="mobile-nav" id="mobileNav" aria-label="모바일 메뉴">${mobileLinks()}
        <a href="contact.html" class="mobile-cta" data-i18n="cta.inquire">${tr('cta.inquire')}</a></nav>`;
  }
  function mobileLinks() {
    let h = '';
    NAV.forEach(n => {
      if (n.children) {
        h += `<a href="#" onclick="return false" style="color:var(--blue)" data-i18n="${n.key}">${tr(n.key)}</a>`;
        n.children.forEach(c => h += `<a href="${c.href}" class="sub" data-i18n="${c.key}">${tr(c.key)}</a>`);
      } else h += `<a href="${n.href}" data-i18n="${n.key}">${tr(n.key)}</a>`;
    });
    return h;
  }

  function buildFooter() {
    return `<footer id="footer"><div class="container footer-inner">
      <div class="footer-brand">
        <div class="footer-logo">${LOGO_SVG}<span class="logo-text"><b>${CFG.brand}</b><em data-i18n="brand.sub">${CFG.sub}</em></span></div>
        <p class="footer-motto" data-i18n="footer.motto">${CFG.motto}</p>
        <address><span data-i18n="footer.bizname">상호: 세명장교 비즈니스센터</span><br>
          <span data-i18n="footer.ceo">대표: ${CFG.ceo}</span><br>
          <span>${CFG.addr}</span><br>
          <span>전화: <a href="tel:${CFG.tel}">${CFG.telDisp}</a> · 팩스: ${CFG.faxDisp}</span><br>
          <span data-i18n="footer.mobile">휴대폰: <a href="tel:${CFG.mobile}">${CFG.mobileDisp}</a></span><br>
          <span data-i18n="footer.email">이메일: <a href="mailto:${CFG.email}">${CFG.email}</a></span><br>
          <span data-i18n="footer.bizno">사업자등록번호: ${CFG.bizNo}</span><br>
          <span data-i18n="footer.hours">영업시간: ${CFG.hours}</span></address>
        <div class="footer-sns">
          <a href="${CFG.sns.instagram}" target="_blank" rel="noopener" aria-label="Instagram" title="Instagram">
            <svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.22 1 .48 1.4.9.4.4.7.8.9 1.4.17.4.37 1 .42 2.2.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.05 1.2-.25 1.8-.42 2.2-.22.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.17-1 .37-2.2.42-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.05-1.8-.25-2.2-.42-.6-.22-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.17-.4-.37-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.05-1.2.25-1.8.42-2.2.22-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.17 1-.37 2.2-.42C8.4 2.2 8.8 2.2 12 2.2zm0 3.4a6.4 6.4 0 1 0 0 12.8 6.4 6.4 0 0 0 0-12.8zm0 10.6a4.2 4.2 0 1 1 0-8.4 4.2 4.2 0 0 1 0 8.4zm6.6-10.9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg></a>
          <a href="${CFG.sns.youtube}" target="_blank" rel="noopener" aria-label="YouTube" title="YouTube">
            <svg viewBox="0 0 24 24"><path d="M23 7.5a3 3 0 0 0-2.1-2.1C19 4.9 12 4.9 12 4.9s-7 0-8.9.5A3 3 0 0 0 1 7.5C.5 9.4.5 12 .5 12s0 2.6.5 4.5a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-4.5.5-4.5s0-2.6-.5-4.5zM9.8 15.4V8.6l5.9 3.4-5.9 3.4z"/></svg></a>
          <a href="${CFG.sns.naverBlog}" target="_blank" rel="noopener" aria-label="네이버 블로그" title="네이버 블로그">
            <svg viewBox="0 0 24 24"><path d="M3 3h18v18H3V3zm5.2 4.6v8.8h2.5v-4.3l3 4.3h2.4V7.6h-2.5v4.3l-3-4.3H8.2z"/></svg></a>
        </div>
      </div>
      <div class="footer-col"><h4 data-i18n="footer.services">서비스</h4><ul>
        <li><a href="virtual.html" data-i18n="nav.virtual">비상주사무실</a></li>
        <li><a href="consulting.html" data-i18n="nav.consulting">창업컨설팅</a></li>
        <li><a href="ai-edu.html" data-i18n="nav.aiedu">AI교육</a></li>
        <li><a href="insurance.html" data-i18n="nav.insurance">금융컨설팅</a></li></ul></div>
      <div class="footer-col"><h4 data-i18n="footer.quick">바로가기</h4><ul>
        <li><a href="about.html" data-i18n="nav.about">회사소개</a></li>
        <li><a href="blog.html" data-i18n="nav.blog">블로그</a></li>
        <li><a href="contact.html" data-i18n="nav.contact">고객지원</a></li>
        <li><a href="${CFG.sauphaja}" target="_blank" rel="noopener" data-i18n="footer.diag">사업하자 진단 ↗</a></li></ul></div>
      <div class="footer-col"><h4 data-i18n="footer.partners">관련 사이트</h4><ul>
        ${CFG.partners.map(p => `<li><a href="${p.url}" target="_blank" rel="noopener">${p.name} ↗</a></li>`).join('')}
      </ul></div>
      </div>
      <div class="footer-bottom"><div class="container">
        <p class="copyright">© <span id="year"></span> 세명장교 비즈니스센터. All Rights Reserved.</p>
        <a href="admin.html" class="admin-link">관리자</a>
      </div></div></footer>`;
  }

  function buildChat() {
    return `<button class="chat-fab" id="chatFab" aria-label="AI 상담 열기">
      <svg viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.38 8.38 0 0 1-8.9 8.4 8.5 8.5 0 0 1-3.6-.8L3 21l1.9-5.5a8.38 8.38 0 0 1-.8-3.6A8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
      <span class="chat-fab-label" data-i18n="chat.fab">AI 상담</span></button>
    <div class="chat-panel" id="chatPanel" aria-hidden="true">
      <div class="chat-head"><div class="chat-head-t"><span class="chat-status-dot"></span><b data-i18n="chat.title">세명장교 AI 상담원</b></div>
        <button class="chat-close" id="chatClose" aria-label="닫기">✕</button></div>
      <div class="chat-body" id="chatBody"><div class="chat-msg bot" data-i18n="chat.greeting">${tr('chat.greeting')}</div></div>
      <form class="chat-input" id="chatForm"><input type="text" id="chatText" autocomplete="off" data-i18n-ph="chat.ph" placeholder="메시지를 입력하세요..." aria-label="메시지 입력">
        <button type="submit" aria-label="보내기"><svg viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg></button></form></div>`;
  }

  /* ---------- inject ---------- */
  const h = document.getElementById('site-header'); if (h) h.outerHTML = buildHeader();
  const f = document.getElementById('site-footer'); if (f) f.outerHTML = buildFooter();
  if (!document.getElementById('no-chat')) { const c = document.createElement('div'); c.innerHTML = buildChat(); document.body.appendChild(c); }
  wireLogoFallback();
  applyLang();
  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

  document.getElementById('langToggle')?.addEventListener('click', () => {
    lang = lang === 'ko' ? 'en' : 'ko'; localStorage.setItem('sj-lang', lang); applyLang();
  });

  /* ---------- header scroll ---------- */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => header && header.classList.toggle('scrolled', window.scrollY > 30), { passive: true });

  /* ---------- mobile nav ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const overlay = document.getElementById('gnbOverlay');
  function toggleNav(open) {
    if (!hamburger) return;
    hamburger.classList.toggle('active', open); hamburger.setAttribute('aria-expanded', open);
    mobileNav.classList.toggle('open', open); overlay.classList.toggle('show', open);
  }
  hamburger && hamburger.addEventListener('click', () => toggleNav(!mobileNav.classList.contains('open')));
  overlay && overlay.addEventListener('click', () => toggleNav(false));
  mobileNav && mobileNav.querySelectorAll('a').forEach(a => a.getAttribute('href') !== '#' && a.addEventListener('click', () => toggleNav(false)));

  /* ---------- config (kakao 등) ---------- */
  fetch('/api/config').then(r => r.ok ? r.json() : null).then(cfg => {
    if (!cfg) return; window.SJ.config = cfg;
    if (cfg.kakaoUrl) document.querySelectorAll('a.cm-kakao, [data-kakao]').forEach(a => a.href = cfg.kakaoUrl);
  }).catch(() => {});

  /* ---------- shared chat send ---------- */
  window.SJ.sendChat = async function (message, history) {
    const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history: (history || []).slice(-10), lang }) });
    if (!res.ok) throw new Error('bad ' + res.status);
    return (await res.json()).reply || '죄송합니다. 다시 시도해 주세요.';
  };
  window.SJ.chatFallback = () => lang === 'en'
    ? 'AI chat is temporarily unavailable. Please call 02-762-3009.'
    : 'AI 상담 연결이 원활하지 않습니다. 02-762-3009로 전화 주시면 친절히 안내해 드리겠습니다.';

  /* ---------- floating chat widget ---------- */
  (function () {
    const fab = document.getElementById('chatFab'), panel = document.getElementById('chatPanel');
    if (!fab || !panel) return;
    const body = document.getElementById('chatBody'), form = document.getElementById('chatForm'), text = document.getElementById('chatText');
    const history = [];
    const open = () => { panel.classList.add('open'); panel.setAttribute('aria-hidden', 'false'); fab.classList.add('hidden'); setTimeout(() => text.focus(), 250); };
    const close = () => { panel.classList.remove('open'); panel.setAttribute('aria-hidden', 'true'); fab.classList.remove('hidden'); };
    fab.addEventListener('click', open); document.getElementById('chatClose').addEventListener('click', close);
    window.SJ.openChat = open;
    const add = (role, msg) => { const d = document.createElement('div'); d.className = 'chat-msg ' + (role === 'user' ? 'user' : 'bot'); d.textContent = msg; body.appendChild(d); body.scrollTop = body.scrollHeight; return d; };
    const typing = () => { const d = document.createElement('div'); d.className = 'chat-msg bot typing'; d.innerHTML = '<i></i><i></i><i></i>'; body.appendChild(d); body.scrollTop = body.scrollHeight; return d; };
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); const msg = text.value.trim(); if (!msg) return;
      add('user', msg); history.push({ role: 'user', content: msg }); text.value = '';
      const t = typing();
      try { const reply = await window.SJ.sendChat(msg, history.slice(0, -1)); t.remove(); add('bot', reply); history.push({ role: 'assistant', content: reply }); }
      catch { t.remove(); add('bot', window.SJ.chatFallback()); }
    });
  })();

  /* ---------- contact form ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const status = document.getElementById('formStatus');
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault(); status.className = 'form-status'; status.textContent = '';
      if (!contactForm.checkValidity()) { contactForm.reportValidity(); return; }
      const fd = new FormData(contactForm);
      const payload = { name: fd.get('name'), phone: fd.get('phone'), email: fd.get('email') || '', interest: fd.get('interest') || '', message: fd.get('message') };
      const btn = contactForm.querySelector('button[type="submit"]'); btn.disabled = true;
      status.textContent = lang === 'en' ? 'Sending...' : '전송 중...';
      try {
        const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error();
        status.className = 'form-status ok';
        status.textContent = lang === 'en' ? '✓ Your inquiry has been received. We will contact you soon!' : '✓ 문의가 정상 접수되었습니다. 빠르게 연락드리겠습니다!';
        contactForm.reset();
      } catch { status.className = 'form-status err'; status.textContent = lang === 'en' ? 'Failed. Please call 02-762-3009.' : '전송 실패. 02-762-3009로 전화 주세요.'; }
      finally { btn.disabled = false; }
    });
  }

  /* ---------- fade-in + count-up ---------- */
  const fades = document.querySelectorAll('.fade-in, .services-grid, .svc-slider, .showcase-grid, .numbers-grid, .ai-grid, .location-grid, .contact-grid, .feature-cards, .blog-grid, .prose, .ptable, .price-highlight, .price-group, .free-grid, .gallery-wrap');
  fades.forEach(el => el.classList.add('fade-in'));
  const io = new IntersectionObserver((es) => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); } }), { threshold: 0.1 });
  fades.forEach(el => io.observe(el));
  const nums = document.querySelectorAll('.num[data-target]');
  if (nums.length) {
    const cio = new IntersectionObserver((es) => es.forEach(en => {
      if (en.isIntersecting) { const el = en.target, tgt = parseInt(el.dataset.target, 10), s = performance.now();
        const step = (n) => { const p = Math.min((n - s) / 1600, 1); el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * tgt).toLocaleString(); if (p < 1) requestAnimationFrame(step); else el.textContent = tgt.toLocaleString(); };
        requestAnimationFrame(step); cio.unobserve(el); }
    }), { threshold: 0.5 });
    nums.forEach(n => cio.observe(n));
  }

  /* ---------- PWA ---------- */
  if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('service-worker.js').catch(() => {}));
})();
