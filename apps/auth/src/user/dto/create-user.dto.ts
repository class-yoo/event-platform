import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { UserRole } from '../models/user.model';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
