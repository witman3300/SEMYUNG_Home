# data — 기존 운영 사이트(semyung.co.kr) 콘텐츠 수집본

현재 `semyung.co.kr` 도메인은 **워드프레스 기존 사이트**(VWThemes *Sales Landing Page*)를 서비스 중이며,
이 저장소의 신규 정적 사이트와는 별개입니다. 신규 사이트 본문을 실제 영업 정보로 채우기 위해
기존 사이트의 콘텐츠를 그대로 수집해 둔 디렉터리입니다.

| 파일 | 내용 |
|---|---|
| `semyung-live-content.json` | 정제·구조화된 콘텐츠(사이트 정보·연락처·가격표·서비스·오시는 길·이미지 매핑) |
| `raw/pages.json` | WP REST `/wp-json/wp/v2/pages` 원본 6건 (`main` `sm1` `sm2` `sm3` `location` `blog`) |
| `raw/posts.json` | WP REST `/wp-json/wp/v2/posts` 원본 6건 (5건은 테마 더미 영문 글) |
| `raw/media.json` | WP REST `/wp-json/wp/v2/media` 원본 58건 |
| `../images/legacy/` | 위 media 58개 이미지 실제 파일 (약 17MB) |

- 수집일: 2026-09-12
- 수집 방법: WordPress REST API + 홈페이지 HTML 파싱 (헤더·푸터 링크, 지도 embed, GTM ID)

## 기존 사이트 정보구조

```
/           main      홈 (sm1 + sm2 + sm3 + location 섹션을 한 페이지로 합친 랜딩)
/sm1/       sm1       세명장교비즈니스센터 (센터소개)
/sm3/       sm3       사무실안내 (객실 유형 + 가격표)
/sm2/       sm2       부가서비스
/location/  location  오시는 길
/blog/      blog      블로그 (실제 운영은 네이버 블로그 blog.naver.com/witman)
```

## 신규 사이트와 다른 점 (반영 시 확인 필요)

- **연락처**: 기존 사이트는 `witman@naver.com` / 대표전화 02-762-3009, 팩스 02-763-3032, 휴대폰 010-8955-3300.
  신규 사이트 푸터 정보와 대조 필요.
- **주소 표기**: 지번 `중구 장교동 1번지 장교빌딩 810호` / 도로명 `중구 삼일대로 363, 810호` 병기.
- **로고**: `images/legacy/logo_full.png`, `logo450.png` 가 기존 사이트 실제 로고.
  README의 "로고 원본 `images/semyung-logo.png` 미존재" 항목을 이 파일로 해결 가능.
- **가격**: 상주 1인실 40만 / 2인실 50만 / 3인실 60만 / 고정석 30만(월),
  비상주 개인 5만 / 법인 7.5만(월, 6개월 일시불 50% 할인 기준),
  단기 1일 1.5만 / 1주 9만 / 1달 40만(사업자등록 불가).
- 기존 사이트에는 신규 사이트의 AI 상담·AI교육·보험·컨설팅 관련 콘텐츠가 **없습니다**(신규 기획 영역).
