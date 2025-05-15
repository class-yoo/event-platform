import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignupRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class SignupResponseDto {
  success: boolean;
}
