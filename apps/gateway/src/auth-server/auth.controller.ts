import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  UseGuards, UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '@shared/enums/user-role.enum';
import { HttpProxyErrorInterceptor } from '../interceptors/http-proxy-error.interceptor';

@Controller('auth')
export class AuthController {
  private readonly authUrl: string;

  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.authUrl = configService.get<string>('AUTH_SERVICE_URL')!;
  }

  @UseInterceptors(HttpProxyErrorInterceptor)
  @Post('signup')
  async signup(@Body() body: any): Promise<any> {
    const response = await firstValueFrom(
      this.http.post(`${this.authUrl}/auth/signup`, body),
    );
    return response.data;
  }

  @UseInterceptors(HttpProxyErrorInterceptor)
  @Post('login')
  async login(@Body() body: any): Promise<any> {
    const response = await firstValueFrom(
      this.http.post(`${this.authUrl}/auth/login`, body),
    );
    return response.data;
  }

  @UseInterceptors(HttpProxyErrorInterceptor)
  @Post('users')
  async create(@Body() body: any): Promise<any> {
    const response = await firstValueFrom(
      this.http.post(`${this.authUrl}/users`, body),
    );
    return response.data;
  }

  @UseInterceptors(HttpProxyErrorInterceptor)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('users/:id')
  @Roles(UserRole.ADMIN)
  async get(@Param('id') id: string): Promise<any> {
    const response = await firstValueFrom(
      this.http.get(`${this.authUrl}/users/${id}`),
    );
    return response.data;
  }

  @UseInterceptors(HttpProxyErrorInterceptor)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch('users/:id/role')
  @Roles(UserRole.ADMIN)
  async updateRole(@Param('id') id: string, @Body() body: any): Promise<any> {
    const response = await firstValueFrom(
      this.http.patch(`${this.authUrl}/users/${id}/role`, body),
    );
    return response.data;
  }
}
