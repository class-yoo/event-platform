import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RewardRepository } from './reward.repository.interface';
import { Reward, RewardDocument } from '../entities/reward.schema';
import { RewardModel } from '../models/reward.model';
import { CreateRewardDto } from '../dto/create-reward.dto';

@Injectable()
export class RewardMongoRepository implements RewardRepository {
  constructor(
    @InjectModel(Reward.name)
    private readonly rewardModel: Model<RewardDocument>,
  ) {}

  private toModel(doc: RewardDocument): RewardModel {
    return {
      id: doc._id.toString(),
      eventId: doc.eventId.toString(),
      type: doc.type,
      name: doc.name,
      amount: doc.amount,
      active: doc.active,
      createdBy: doc.createdBy,
    };
  }

  async create(
    data: CreateRewardDto & { eventId: string; createdBy: string },
  ): Promise<RewardModel> {
    const created = await this.rewardModel.create({
      ...data,
      eventId: new Types.ObjectId(data.eventId),
    });
    return this.toModel(created);
  }

  async findByEventId(eventId: string): Promise<RewardModel[]> {
    const docs = await this.rewardModel
      .find({
        eventId: new Types.ObjectId(eventId),
        active: true, // active 보상만 조회(원하는 정책에 따라)
      })
      .exec();
    return docs.map((doc) => this.toModel(doc));
  }

  async findById(id: string): Promise<RewardModel | null> {
    const doc = await this.rewardModel.findById(id).exec();
    return doc ? this.toModel(doc) : null;
  }

  async findByEventIdAndRewardId(
    eventId: string,
    rewardId: string,
  ): Promise<RewardModel | null> {
    const doc = await this.rewardModel
      .findOne({
        _id: rewardId,
        eventId: new Types.ObjectId(eventId),
        active: true,
      })
      .exec();
    return doc ? this.toModel(doc) : null;
  }
}
