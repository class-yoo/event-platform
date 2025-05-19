import { Body, Controller, Post } from '@nestjs/common';
import { SignupRequestDto, SignupResponseDto } from './dto/signup.dto';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupRequestDto): Promise<SignupResponseDto> {
    return this.authService.signup(dto);
  }

  @Post('login')
  login(@Body() dto: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.login(dto.email, dto.password);
  }
}
