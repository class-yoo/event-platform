# Event platform



## 프로젝트 구성 및 로직 설명
- 프로젝트 구성은 개발속도 향상을 위해 Monorepo로 되어있습니다.
- 모든 엔드포인트는 jwt token 기반으로 동작합니다. jwt 토큰에는 `user.id`, `role` 정보가 들어있습니다.
  - 로그인은 email로 진행하지만, 보안을 위해 통신간 user_id를 활용합니다.
  - JWT를 통해 `인증`이 되고 Role을 기반으로 엔드포인트별 `인가`가 됩니다.
  - 만약 user_id도 보안상 위험하다 판단되면 user_id를 한번 더 암호화하는 방식으로 구성이 필요합니다.
  - 더 자세한 정보는 Auth Server의 `README.md` 파일을 참고해주세요.
- 각 리스트 조회 API의 경우, 페이징 기능은 우선 제외했습니다. (당연히 서비스하면서 추가해야함)
- Exception의 경우 상세하게 클래스로 구분하진 못하였고 기본 제공 Exception을 활용했습니다.
  - 운영시에는, 사용자 정의 Exception을 활용하는게 여러모로 장점이 있습니다.
- 각 Auth/Event 서버에서 발생하는 에러를 Gateway 서비스에서 통합하여 처리하는 로직을 구현하지못했습니다.
  - 실제 서비스에서는 500 Error를 절대로 클라이언트로 throw 하지 않습니다.
- 경로 alias를 지정해서 상대경로 import시, 축약해서 사용하도록합니다. (`tsconfig.json` 참고)
- enum이나 error_code의 경우는 서버들끼리 공유하는 경우가 많기에 모노레포의 특성을 이용해 공통 디렉토리로 관리합니다. (`libs/shared/` 참고)
- 각 app의 tsconfig.json 파일에서 root의 tsconfig.json를 확장하여 사용합니다.
- 각 서비스의 repository layer는 Inferface를 구현하여 사용합니다.
  - SOLID DIP 원칙


## 서버구성
서버의 설명은 각 서버의 README.md 파일을 참고하세요.

- Gateway Server: [README.md](apps/gateway/README.md)
- Event Server: [README.md](apps/event/README.md)
- Auth Server: [README.md](apps/auth/README.md)

## 테스트
MSA 환경으로 구성하려면 실제 DB도 따로 구성해야하지만, 구현 시간 절약을 위해 하나의 DB로 구성하였습니다.

- test를 진행하기 위해선 jq 툴이 필요합니다.
    - Mac: `brew install jq`
    - Linux:
      - Ubuntu: `sudo apt install jq`
      - CentOS, Amazon Linux: `yum install jq`

### docker compose up
```
# docker compose up --build

# docker ps
9cf4f4152393   event-platform_gateway   "docker-entrypoint.s…"   About a minute ago   Up About a minute   0.0.0.0:3001->3000/tcp     gateway
ce03d97ec130   event-platform_event     "docker-entrypoint.s…"   About a minute ago   Up About a minute   0.0.0.0:3002->3000/tcp     event
4bae134c01ab   event-platform_auth      "docker-entrypoint.s…"   About a minute ago   Up About a minute   0.0.0.0:3000->3000/tcp     auth
e392aa966dd8   mongo:6                  "docker-entrypoint.s…"   3 days ago           Up About a minute   0.0.0.0:27017->27017/tcp   mongo
```
---

### seed data settings
해당 프로젝트의 이벤트는 연속 출석일 수 이벤트를 채택하여 사용하고 있습니다.
로그인마다 출석일 수를 채우는게 기본이지만, 상황상 출석일 수 데이터를 스크립트를 통해 채우고 있습니다.
그렇기에 `jq` 툴이 반드시 필요합니다.
 
- nestjs 환경의 seed 데이터 세팅 기능을 구현하려 했지만, 시간이 부족하여 우선은 데이터 세팅을 위한 특수 API를 만들어서 데이터를 세팅하도록 합니다.
- 해당 스크립트가 실행되면, 아래의 계정들이 생성됩니다.
  - `admin@maple.com` - `ADMIN`
  - `operator@maple.com` - `OPERATOR`
  - `user@maple.com` - `USER`
  - `auditor@maple.com` - `AUDITOR`
```
# ./libs/scripts/seed.sh
```
---

### 회원가입(유저등록)
seed data settings 단계에서 기본으로 등록되는 유저가 있기 때문에 넘어가셔도 됩니다.
```shell
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user1@maple.com",
    "password": "pass123",
    "role": "USER"
  }'
```
---

### 로그인
로그인을 해서 얻은 token에 대해서는 
```shell
# 어드민 유저 로그인
curl -X POST http://localhost:3001/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"admin@maple.com","password":"pass123"}'
```
---

### 유저정보 얻기

```shell
curl -X GET http://localhost:3001/auth/users/6826f3ae397f15fc0c6c63b2 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODI2ZGQ3NmM0OThhMjQxZWNjZjM2OTIiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDc1NTc4NTcsImV4cCI6MTc0NzU2MTQ1N30.C95YMu7M8_egCaROn4pR_HJivN0lzuoAfXMy0bHn7fw"
```
---

### 유저 역할(Role) 수정
```shell
curl -X PATCH http://localhost:3001/auth/users/6826f3ae397f15fc0c6c63b2/role \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODI2ZGQ3NmM0OThhMjQxZWNjZjM2OTIiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDc1NTc4NTcsImV4cCI6MTc0NzU2MTQ1N30.C95YMu7M8_egCaROn4pR_HJivN0lzuoAfXMy0bHn7fw" \
  -H "Content-Type: application/json" \
  -d '{"role": "OPERATOR"}'
```
---


### 이벤트 등록
```shell
curl -X POST http://localhost:3001/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "title": "연속 5일 출석, 500포인트 지급",
    "description": "연속 5일 출석 500포인트 지급",
    "type": "LOGIN_DAYS",
    "threshold": 5,
    "startAt": "2025-05-01T00:00:00.000Z",
    "endAt": "2025-05-31T23:59:59.999Z"
  }'
```
---

### 이벤트 목록 조회
```shell
curl -X GET http://localhost:3001/events \
  -H "Authorization: Bearer <JWT_TOKEN>"
```
---

### 이벤트 단건조회
```shell
curl -X GET http://localhost:3001/events/<eventId> \
  -H "Authorization: Bearer <JWT_TOKEN>"
```
---

### 보상등록
```shell
curl -X POST http://localhost:3001/events/<eventId>/rewards \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "POINT",
    "name": "이벤트 참여 포인트",
    "amount": 500
  }'
```
---

### 보상 목록조회
```shell
curl -X GET http://localhost:3001/events/<eventId>/rewards \
  -H "Authorization: Bearer <JWT_TOKEN>"
```
---

### 보상 단건조회
```shell
curl -X GET http://localhost:3001/events/<eventId>/rewards/<rewardId> \
  -H "Authorization: Bearer <JWT_TOKEN>
```
---

### 보상 요청
- 보상요청에 대한 포인트 지급은 실제 `seed data settings`에서 세팅한 경우에만 지급이 되도록 하고 있습니다.
  - email: `user@maple.com`로 로그인하여 얻은 JWT 토큰을 세팅하셔야합니다.
```shell
curl -X POST http://localhost:3001/events/<eventId>/rewards/<rewardId>/claim \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{}'
```
---

### 보상 요청 내역 확인
```shell
# 전체 조회
curl -X GET http://localhost:3001/reward-claims \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json"
  
# 특정 이벤트의 보상 요청 이력 조회
curl -X GET "http://localhost:3001/reward-claims?eventId=<eventId>" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json"
```