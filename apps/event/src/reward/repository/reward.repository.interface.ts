import { RewardModel } from '../models/reward.model';
import { CreateRewardDto } from '../dto/create-reward.dto';

export interface RewardRepository {
  create(
    data: CreateRewardDto & { eventId: string; createdBy: string },
  ): Promise<RewardModel>;
  findById(id: string): Promise<RewardModel | null>;
  findByEventId(eventId: string): Promise<RewardModel[]>;
  findByEventIdAndRewardId(
    eventId: string,
    rewardId: string,
  ): Promise<RewardModel | null>;
}
