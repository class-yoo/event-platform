import { RewardClaimStatus } from '@shared/enums/reward-claim.enum';

export class ClaimRewardResponseDto {
  id: string;
  success: boolean; // 성공 여부
  status: RewardClaimStatus; // 지급 상태
  message: string; // 안내 메시지
  claimedAt?: Date; // 지급 시각 (성공 시)
}
