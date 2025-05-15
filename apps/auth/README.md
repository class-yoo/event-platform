인증서버


1. jwt payload에는 개인정보가 노출되지 않도록 email등의 개인정보가 아닌 user_id로 구성합니다.
   1. 만약 user_id도 보안적으로 위험하다 판단되면 해당 user_id를 한번더 암호화하는 방식으로 구성이 필요합니다.
2. repository layer를 구성하여 service layer 와의 관점을 분리합니다.
   1. 이후 DB 변경등을 할때 Service layer의 코드 수정을 최소화 하기 위해 (비즈니스 로직에는 영향이 없도록)
2. 