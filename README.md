# Event platform

- 경로 alias를 지정해서 상대경로 import시, 축약해서 사용하도록합니다.
- enum이나 error_code의 경우는 대체적으로 모든 서버가 공유할 확률이 높기에 모노레포의 특성을 이용해 공통 디렉토리에서 관리합니다.
- 각 app의 tsconfig.json 파일에서 root의 tsconfig.json를 확장하여 사용합니다.


## 서버구성

Gateway Server
[README.md](apps/gateway/README.md)

Auth Server
[README.md](apps/auth/README.md)

Event Server
[README.md](apps/event/README.md)



