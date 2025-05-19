import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserAttendanceService } from './user-attendance.service';
import { CreateUserAttendanceDto } from '../dto/create-user-attendance.dto';
import { UserAttendance } from '../entities/user-attendance.schema';

@Controller('attendances')
export class UserAttendanceController {
  constructor(private readonly attendanceService: UserAttendanceService) {}

  @Post()
  async create(@Body() dto: CreateUserAttendanceDto): Promise<UserAttendance> {
    return this.attendanceService.create(dto);
  }

  @Get()
  async getAll(): Promise<UserAttendance[]> {
    return this.attendanceService.getAll();
  }
}
