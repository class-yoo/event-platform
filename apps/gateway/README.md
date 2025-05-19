# Gateway server


우선은 controller/ service 등으로 layer를 구분하는게 좋긴하지만 우선은 작업 특성상 개발 속도를 위해 gateway의 코드는 layer 구분없이 conroller에서 바로 auth/event 서버를 호출하도록 설정했습니다.

gateway에서 request, response의 DTO를 구성하지 않고 any로 설정한 이유는 아래와 같습니다.
1. gateway 서버는 단순 라우팅 기능 및 인증 권한 검사를 해주는 기능
2. DTO를 선언한 경우 예를들어, auth 서버의 DTO를 수정하면 gateway쪽 도 함께 수정해서 동기화를 해줘야하는 번거로움이 있음
   1. 공통 디렉토리에 구성하여 사용할 수 있겠지만, 적은확률로 미래에 서버 별 repository가 분리되는 상황 고려 
3. 개발속도 향상
4. 위 이유를 불문하고 gateway에서 validation 하는 등의 로직이 필요한 경우가 생긴다면, 공통 디렉토리에서 DTO를 관리하는 것이 좋아보입니다.

관리의 용이성을 위해 auth / event 디렉토리로 구분



유저등록


로그인
```shell
# 어드민 유저 로그인

curl -X POST http://localhost:3001/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"admin@maple.com","password":"pass123"}'


# 일반 유저 로그인
curl -X POST http://localhost:3001/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"user1@maple.com","password":"pass123"}'
```

유저정보 얻기

```shell
curl -X GET http://localhost:3001/auth/users/6826f3ae397f15fc0c6c63b2 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODI2ZGQ3NmM0OThhMjQxZWNjZjM2OTIiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDc1NTc4NTcsImV4cCI6MTc0NzU2MTQ1N30.C95YMu7M8_egCaROn4pR_HJivN0lzuoAfXMy0bHn7fw"
```


유저 롤 수정
```shell
curl -X PATCH http://localhost:3001/auth/users/6826f3ae397f15fc0c6c63b2/role \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODI2ZGQ3NmM0OThhMjQxZWNjZjM2OTIiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDc1NTc4NTcsImV4cCI6MTc0NzU2MTQ1N30.C95YMu7M8_egCaROn4pR_HJivN0lzuoAfXMy0bHn7fw" \
  -H "Content-Type: application/json" \
  -d '{"role": "OPERATOR"}'
```



이벤트 등록


```shell
curl -X POST http://localhost:3001/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "title": "출석 3일 이벤트",
    "description": "3일 연속 로그인 시 1,000포인트 지급",
    "type": 1,
    "target": 3,
    "startAt": "2024-06-01T00:00:00.000Z",
    "endAt": "2024-06-07T23:59:59.000Z"
  }'
```

이벤트 목록 조회
```shell
curl -X GET http://localhost:3001/events \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODI2ZjNhZTM5N2YxNWZjMGM2YzYzYjIiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc0NzU3MjgyOSwiZXhwIjoxNzQ3NTc2NDI5fQ.UNt28APbLcghTOtzUplEYe9UdoTnzgx0cPRkvdzplhI"
```

이벤트 단건조회
```shell
curl -X GET http://localhost:3001/events/<eventId> \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODI2ZjNhZTM5N2YxNWZjMGM2YzYzYjIiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc0NzU3MjgyOSwiZXhwIjoxNzQ3NTc2NDI5fQ.UNt28APbLcghTOtzUplEYe9UdoTnzgx0cPRkvdzplhI"

```