인증서버

우선 특수한 상황이기 때문에 로그인 없이 유저를 등록 할 수 있도록 처리했습니다. (테스트진행에 편의성을 위해)

API 사용시, user_id를 기반으로 합니다. 만약 user_id가 보안적으로 위험하다 판단되면 user_id를 한번 더 암호화하는 방식으로 구성이 필요합니다. (서버 상황에 따라 달라질듯)

1. jwt payload에는 보안상 email등의 개인정보가 아닌 user_id로 구성합니다.
   1. 만약 user_id도 보안적으로 위험할 것으로 판단되면 해당 user_id를 한번 더 암호화하는 방식으로 구성이 필요합니다. (서버 상황에 따라 달라질듯)
   2. 실질적으론 user_id의 경우, 기존 서버의 user_id를 활용하겠지만 해당 프로젝트에서는 mongodb에서 생성해주는 id를 활용하도록합니다.
2. repository layer를 구성하여 service layer 와의 관점을 분리합니다.
   1. 이후 DB 변경등을 할때 Service layer의 코드 수정을 최소화 하기 위해 (비즈니스 로직에는 영향이 없도록)

유저 삭제 기능이 있지만 soft delete 처리합니다.




✅ 권한 변경 API (PATCH /users/:id/role) 테스트 체크리스트
1. ✅ 정상 케이스
   ADMIN 권한 유저가 /users/:id/role 호출 시 역할 변경 성공 (200 OK)

응답 { success: true } 확인

2. 🔐 보안 케이스
   JWT 없이 요청 → 401 Unauthorized

USER / OPERATOR / AUDITOR가 요청 → 403 Forbidden

3. ❌ 예외 케이스
   존재하지 않는 유저 ID → 404 Not Found

