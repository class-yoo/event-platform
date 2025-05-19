# Event Server

## 스키마
실제 운영환경에서는 유저 action에 대한 히스토리도 관리하는게 맞지만 프로젝트 특성상, 핵심 entity만 구성하였습니다.


### 1. 이벤트
type(어떤 이벤트)인지 설정이 가능하도록 했고 해당 이벤트에 따른 threshold(목표치)를 설정하여 여러 이벤트를 유동적으로 관리할 수 있도록 구성했습니다.

- `type=LOGIN_DAYS`: 출석일 / `threshold=5`: 5일 연속 출석
- `type='INVITE_FRIENDS',`: 친구초대  / `threshold=7`: 7명 초대

```ts
@Schema({ timestamps: true })
export class Event extends Document {
   @Prop({ required: true })
   title: string;

   @Prop({ required: true })
   description: string;

   @Prop({ required: true, enum: EventType })
   type: EventType;

   @Prop({ required: true })
   threshold: number; // 조건 임계치 e.g.) 5일, 5명

   @Prop({ required: true })
   startAt: Date;

   @Prop({ required: true })
   endAt: Date;

   @Prop({ default: true })
   active: boolean;

   @Prop({ required: true })
   createdBy: string;
}
```


### 2. 보상
type으로 어떤 보상인지 설정이 가능하도록하였습니다.
`POINT`는 amount 필드 활용이 가능하지만, `COUPON`과 타입의 경우 coupon_id등을 매칭하여 관리하도록 해야합니다. (해당 스키마에선 적용하진 않았습니다.)
 현재는 `POINT`만 보상으로 지급하고 있습니다.

- `type=POINT`
- `type=COUPON`
- `type=ITEM`

```ts
@Schema({ timestamps: true })
export class Reward extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Event' })
  eventId: Types.ObjectId;

  @Prop({ required: true, enum: RewardType })
  type: RewardType;

  @Prop({ required: true })
  name: string; // 보상명

  @Prop({ required: false })
  amount: number; // 보상 수량 - 필요한 경우만 사용

  @Prop({ required: true })
  createdBy: string; // 등록자 user_id

  @Prop({ default: true })
  active: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}
```

### 3. 보상 요청
중복요청 방지를 위해 userId, rewardId, eventId를 복합키로 묶어서 유니크 인덱스를 생성합니다. status를 활용하여 해당 요청에 대한 지금 상태를 관리합니다.
- `status=PENDING`: 지급대기중을 나타내며 운영자를 통해 수동으로 지급되는 케이스에 활용됩니다.
- `status=COMPLETED`: 지급완료를 나타내며 자동으로 지급된 보상이나, 운영자를 통해 수동지급 완료된 케이스입니다.
- `status=REJECTED`: 어떠한 사유로 인해 요청이 거절된 케이스입니다.
```ts
@Schema({ timestamps: true })
export class RewardClaim extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Event' })
  eventId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Reward' })
  rewardId: Types.ObjectId;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, enum: RewardClaimStatus })
  status: RewardClaimStatus;

  @Prop()
  message?: string; // 기타 메세지

  @Prop()
  claimedAt?: Date; // 지급 완료 시각
}
```

### 4. 포인트(보상)
이 프로젝트에서 보상으로 `포인트`를 채택했습니다. 물론 Schema 설계는 포인트 뿐만 아니라 다른 보상도 지급될 수 있도록 구성했습니다.

- point는 이벤트로도 지급될 수 있지만, 다른 경로로도 쌓일 수 있기에 `type`을 관리합니다.
- 이벤트로 지급된 포인트의 경우는 소멸 및 사용불가가 될 수도 있기에 `status`를 관리합니다.
- 1,000 포인트 5번이 쌓이면 document는 5개가 생성됩니다.

```ts
@Schema({ timestamps: true })
export class Point extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: PointType })
  type: PointType; // 지급 출처/종류(일반/이벤트)

  @Prop({ required: true, enum: PointStatus, default: PointStatus.NORMAL })
  status: PointStatus; // 상태(정상/소멸)

  @Prop()
  note?: string; // 기타 사유
}
```

---
## API

- `이벤트에 연결된 보상정보를 추가할 수 있어야합니다.`가 요구 조건이기에 API 설계는 아래와 같습니다.
- `이벤트` 하위에 `보상`이 있고 `보상` 하위에 `보상요청`이 있는 구조입니다.
- `보상` 관련 엔드포인트에 eventId까지 포함 되어있는 이유는, 해당 이벤트에 속한 보상을 요청하는게 맞는지 안전한 검증을 위해 설계했습니다.
  - eventId까지 포함하게 되면, URI만 보고도 의미 파악이 용이해집니다. (이벤트 하위의 보상)
  - rewardId만 전달되면, 이 보상이 어떤 이벤트(eventId)에 속한 보상인지 명시적으로 전달되지 않습니다.

- 이벤트 (`event.controller.ts`)
  - 등록
     - `POST: /events`
     - 설명: 클라이언트가 전달한 이벤트 정보를 바탕으로 새로운 이벤트를 생성합니다.
       요청자의 userId는 Gateway 서버로 부터 헤더의 'x-user-id' 값으로 전달됩니다.
  - 전체 조회
     - `GET: /events`
     - 설명: 등록된 모든 이벤트 목록을 조회합니다.
  - 단건 조회
     - GET: /events/{id}
     - 설명: 특정 ID에 해당하는 이벤트의 상세 정보를 조회합니다.

- 보상 (`reward.controller.ts`)
  - 등록
     - `POST: /events/{eventId}/rewards`
     - 설명: 특정 이벤트에 대한 보상 정보를 등록합니다.
  - 전체 조회
     - `GET: /events/{eventId}/rewards`
     - 설명: 특정 이벤트에 등록된 모든 보상 정보를 조회합니다.
  - 단건 조회
     - `GET: /events/{eventId}/rewards/{rewardId}`
     - 설명: 이벤트 내 특정 보상에 대한 상세 정보를 조회합니다.

- 보상 요청
  - 등록 (`reward.controller.ts`)
    - `POST: /events/{eventId}/rewards/{rewardId}/claim`
    - 설명: 특정 이벤트의 특정 보상에 대해 유저가 보상을 요청(수령)합니다.

---

## 로직설명
- 이벤트 보상요청 및 지급
  - 이벤트 리워드는 출석일 수에 따른 `포인트` 지급을 선정했고 아래와 같은 조건으로 지급합니다.
    1. 유저가 `보상요청`을 합니다.
    2. 중복된 `보상 요청`인지 체크합니다.
    3. 이벤트에 등록된연속 출석일 수 조건을 충족하는지 체크합니다.
       - 예를 들어, 이벤트(2025-05-01 ~ 2025-06-01) 기간 사이에 5일이상 연속 출석한 유저에게 포인트를 지급합니다.
       - 오늘 날짜 기준으로 지급(오늘이 5월 7일이고 5일째 출석이 됨)이 아닌, `start_at ~ end_at` 사이에서 5일 이상 출석한 날짜가 있으면 보상요청이 가능하도록 설계했습니다.
       - (이런식의 구성이 좀 더 유연성 있게 활용 될 것으로 판단했습니다.)
    4. 보상 요청 데이터와 포인트 지급 데이터를 생성합니다.