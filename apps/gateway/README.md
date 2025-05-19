# Gateway server

모든 요청을 받아 라우팅을 수행하고 JWT 토큰 검증을 통해 역할(Role) 별로 엔드포인트 사용을 인가합니다.  

- controller/ service 등으로 layer를 구분하는게 좋긴하지만 우선은 작업 특성상 개발 속도를 위해 gateway의 코드는 layer 구분없이 conroller에서 바로 auth/event 서버를 호출하도록 설정했습니다.
- gateway에서 request, response의 DTO를 구성하지 않고 any로 설정한 이유는 아래와 같습니다.
  1. gateway 서버는 단순 라우팅 기능 및 인증 권한 검사를 해주는 기능
  2. DTO를 선언한 경우 예를들어, auth 서버의 DTO를 수정하면 gateway쪽 도 함께 수정해서 동기화를 해줘야하는 번거로움이 있음
     1. 공통 디렉토리에 구성하여 사용할 수 있겠지만, 적은확률로 미래에 서버 별 저장소가 분리되는 상황을 고려 
  3. 개발속도 향상
  4. 위 이유들을 불문하고 gateway에서 validation 하는 등의 로직이 필요한 경우가 생긴다면, 공통 디렉토리에서 DTO를 관리하는 것이 좋아보입니다.
- 관리의 용이성을 위해 auth / event 디렉토리로 구분하여 관리합니다.