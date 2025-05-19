import { PointModel } from '../models/point.model';
import { ClientSession } from 'mongoose';

export interface PointRepository {
  create(data: PointModel, session?: ClientSession): Promise<PointModel>;
  findByUserId(userId: string): Promise<PointModel[]>;
}
