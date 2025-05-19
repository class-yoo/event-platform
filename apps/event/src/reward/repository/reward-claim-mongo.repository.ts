import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RewardClaimRepository } from './reward-claim.repository.interface';
import {
  RewardClaim,
  RewardClaimDocument,
} from '../entities/reward-claim.schema';
import { RewardClaimStatus } from '@shared/enums/reward-claim.enum';
import { RewardClaimModel } from '../models/reward-claim.model';

@Injectable()
export class RewardClaimMongoRepository implements RewardClaimRepository {
  constructor(
    @InjectModel(RewardClaim.name)
    private readonly rewardClaimModel: Model<RewardClaimDocument>,
  ) {}

  private toModel(doc: RewardClaimDocument): RewardClaimModel {
    return {
      id: doc._id.toString(),
      eventId: doc.eventId.toString(),
      rewardId: doc.rewardId.toString(),
      userId: doc.userId,
      status: doc.status,
      claimedAt: doc.claimedAt,
      message: doc.message,
    };
  }

  async create(data: {
    eventId: string;
    rewardId: string;
    userId: string;
    status: RewardClaimStatus;
    claimedAt: Date;
    message?: string;
  }): Promise<RewardClaimModel> {
    const created = await this.rewardClaimModel.create({
      ...data,
      eventId: new Types.ObjectId(data.eventId),
      rewardId: new Types.ObjectId(data.rewardId),
    });
    return this.toModel(created);
  }

  async findOneByEventRewardUser(
    eventId: string,
    rewardId: string,
    userId: string,
  ): Promise<RewardClaimModel | null> {
    const doc = await this.rewardClaimModel
      .findOne({
        eventId: new Types.ObjectId(eventId),
        rewardId: new Types.ObjectId(rewardId),
        userId,
      })
      .exec();
    return doc ? this.toModel(doc) : null;
  }

  async findAllByUserId(userId: string): Promise<RewardClaimModel[]> {
    const docs = await this.rewardClaimModel
      .find({ userId })
      .sort({ claimedAt: -1 })
      .exec();
    return docs.map((doc) => this.toModel(doc));
  }
}
