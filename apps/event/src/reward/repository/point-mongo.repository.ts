import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Point, PointDocument } from '../entities/point.schema';
import { PointRepository } from './point.repository.interface';
import { PointModel } from '../models/point.model';

@Injectable()
export class PointMongoRepository implements PointRepository {
  constructor(
    @InjectModel(Point.name)
    private readonly pointModel: Model<PointDocument>,
  ) {}

  private toModel(doc: PointDocument): PointModel {
    return {
      id: doc._id.toString(),
      userId: doc.userId,
      amount: doc.amount,
      type: doc.type,
      status: doc.status,
    };
  }

  async create(
    data: Omit<PointModel, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<PointModel> {
    const created = await this.pointModel.create(data);
    return this.toModel(created);
  }

  async findByUserId(userId: string): Promise<PointModel[]> {
    const docs = await this.pointModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
    return docs.map((doc) => this.toModel(doc));
  }
}
