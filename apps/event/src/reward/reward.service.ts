import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RewardRepository } from './repository/reward.repository.interface';
import { CreateRewardDto } from './dto/create-reward.dto';
import { RewardModel } from './models/reward.model';

@Injectable()
export class RewardService {
  constructor(
    @Inject('RewardRepository') private readonly rewardRepo: RewardRepository,
  ) {}

  async createReward(
    dto: CreateRewardDto & { eventId: string },
    userId: string,
  ): Promise<RewardModel> {
    return this.rewardRepo.create({ ...dto, createdBy: userId });
  }

  async getRewardsByEventId(eventId: string): Promise<RewardModel[]> {
    return this.rewardRepo.findByEventId(eventId);
  }

  async getRewardByIdInEvent(
    eventId: string,
    rewardId: string,
  ): Promise<RewardModel> {
    const reward = await this.rewardRepo.findByEventIdAndRewardId(
      eventId,
      rewardId,
    );
    if (!reward) {
      throw new NotFoundException(
        `Reward not found in the specified event. eventId: ${eventId}, rewardId ${rewardId}`,
      );
    }
    return reward;
  }
}
