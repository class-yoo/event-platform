# Auth Server

유저 등록, 로그인, 역할(role)관리 기능을 담당합니다.

## JWT 토큰 발급
로그인시, JWT 토큰을 발급합니다. 해당 토큰은 Gateway서버에서 라우팅될 때 검증됩니다.

```shell
# 로그인
curl -X POST http://localhost:3001/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"admin@maple.com","password":"pass123"}'

```

1. jwt payload에는 보안상 email등의 개인정보가 아닌 user_id로 구성합니다.
   1. 만약 user_id도 보안적으로 위험할 것으로 판단되면 해당 user_id를 한번 더 암호화하는 방식으로 구성이 필요합니다. (서버 상황에 따라 달라질듯)
   2. 실제서비스의 user_id의 경우, 기존 서버의 user_id를 활용하겠지만 해당 프로젝트에서는 mongodb에서 생성해주는 id를 활용하도록합니다.
2. 유저 삭제 기능이 있지만, soft delete 처리합니다.


## API

- 회원가입 
  - `POST: /auth/signup`
  - 설명: 새로운 유저를 등록합니다. 이메일, 비밀번호, 권한(role)을 입력 받아 계정을 생성합니다. 
- 로그인 
  - `POST: /auth/login` 
  - 설명: 이메일과 비밀번호를 입력받아 JWT 토큰을 발급합니다.
- 유저 생성 
  - `POST: /users`
  - 설명: 유저 정보를 받아 새 유저를 생성합니다. 일반적으로 내부 API로 사용됩니다.
- 유저 조회 
  - `GET: /users/{id}`
  - 설명: 특정 유저 ID에 해당하는 유저 정보를 조회합니다. 주로 관리자 또는 인증 후 클라이언트에서 사용됩니다. 
- 유저 역할 수정 
  - `PATCH: /users/{id}/role`
  - 설명: 특정 유저의 역할(role)을 수정합니다. 관리자만 사용 가능한 API입니다.
- 유저 삭제 
  - `DELETE: /users/{id}`
  - 설명: 특정 유저를 삭제(soft delete 가능)합니다. 관리자 권한 필요.

