export enum RewardClaimStatus {
  PENDING = 'PENDING', // 대기(심사 등)
  COMPLETED = 'COMPLETED', // 지급 완료
  REJECTED = 'REJECTED', // 지급 실패/중복/조건 미달
}
