import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from '@shared/enums/user-role.enum';

export class SignupRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}

export class SignupResponseDto {
  success: boolean;
}
