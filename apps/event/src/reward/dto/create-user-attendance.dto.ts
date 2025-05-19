import { IsDateString, IsString } from 'class-validator';

export class CreateUserAttendanceDto {
  @IsString()
  userId: string;

  @IsDateString()
  date: string; // ISO date string (e.g., '2024-05-19')
}
