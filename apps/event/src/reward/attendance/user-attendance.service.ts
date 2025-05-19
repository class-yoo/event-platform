import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  UserAttendance,
  UserAttendanceDocument,
} from '../entities/user-attendance.schema';
import { CreateUserAttendanceDto } from '../dto/create-user-attendance.dto';

@Injectable()
export class UserAttendanceService {
  constructor(
    @InjectModel(UserAttendance.name)
    private readonly attendanceModel: Model<UserAttendanceDocument>,
  ) {}

  async create(dto: CreateUserAttendanceDto): Promise<UserAttendance> {
    const created = new this.attendanceModel({
      userId: dto.userId,
      date: new Date(dto.date),
    });
    return created.save();
  }

  async getAll(): Promise<UserAttendance[]> {
    return this.attendanceModel.find().sort({ date: -1 }).exec();
  }
}
