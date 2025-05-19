import { RewardClaimModel } from '../models/reward-claim.model';
import { RewardClaimStatus } from '@shared/enums/reward-claim.enum';
import { ClientSession } from 'mongoose';

export interface RewardClaimRepository {
  create(
    data: {
      eventId: string;
      rewardId: string;
      userId: string;
      status: RewardClaimStatus;
      claimedAt: Date;
      message?: string;
    },
    session?: ClientSession,
  ): Promise<RewardClaimModel>;

  findOneByEventRewardUser(
    eventId: string,
    rewardId: string,
    userId: string,
  ): Promise<RewardClaimModel | null>;

  findAllByUserId(userId: string): Promise<RewardClaimModel[]>;

  findAll(): Promise<RewardClaimModel[]>;

  findAllByEventId(eventId: string): Promise<RewardClaimModel[]>;
}
