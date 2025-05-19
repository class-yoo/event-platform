import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  UserAttendance,
  UserAttendanceDocument,
} from '../entities/user-attendance.schema';
import { UserAttendanceRepository } from './user-attendance.repository.interface';

@Injectable()
export class UserAttendanceMongoRepository implements UserAttendanceRepository {
  constructor(
    @InjectModel(UserAttendance.name)
    private readonly attendanceModel: Model<UserAttendanceDocument>,
  ) {}

  async getUserAttendanceDates(
    userId: string,
    start: Date,
    end: Date,
  ): Promise<Date[]> {
    const docs = await this.attendanceModel
      .find({
        userId,
        date: { $gte: start, $lte: end },
      })
      .sort({ date: 1 })
      .exec();
    return docs.map((doc) => doc.date);
  }
}
