import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginResponseDto } from './dto/login.dto';
import { UserModel } from '../user/models/user.model';
import { SignupRequestDto, SignupResponseDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupRequestDto): Promise<SignupResponseDto> {
    const existing: UserModel | null = await this.userService.findByEmail(
      dto.email,
    );
    if (existing) {
      throw new ConflictException('이미 가입된 이메일입니다.');
    }

    const pwHash: string = await bcrypt.hash(dto.password, 10);
    await this.userService.create(dto.email, pwHash, dto.role);

    return { success: true };
  }

  async login(email: string, password: string): Promise<LoginResponseDto> {
    const user: UserModel = await this.userService.login(email, password);

    const payload: { sub: string; role: typeof user.role } = {
      sub: user.id,
      role: user.role,
    };

    const token: string = this.jwtService.sign(payload);

    return {
      token,
    };
  }
}
