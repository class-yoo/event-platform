import { RewardClaimStatus } from '@shared/enums/reward-claim.enum';

export class RewardClaimModel {
  public id: string;
  public eventId: string;
  public rewardId: string;
  public userId: string;
  public status: RewardClaimStatus;
  public claimedAt: Date | undefined;
  public message?: string | undefined;
}
