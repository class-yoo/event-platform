import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '@shared/enums/user-role.enum';

@Controller('auth')
export class AuthController {
  private readonly authUrl: string;

  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.authUrl = configService.get<string>('AUTH_SERVICE_URL')!;
  }

  @Post('login')
  async login(@Body() body: any): Promise<any> {
    const { data } = await firstValueFrom(
      this.http.post(`${this.authUrl}/auth/login`, body),
    );
    return data;
  }

  @Post('users')
  async createUser(@Body() body: any): Promise<any> {
    const { data } = await firstValueFrom(
      this.http.post(`${this.authUrl}/users`, body),
    );
    return data;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('users/:id')
  @Roles(UserRole.ADMIN)
  async getUser(@Param('id') id: string): Promise<any> {
    const { data } = await firstValueFrom(
      this.http.get(`${this.authUrl}/users/${id}`),
    );
    return data;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch('users/:id/role')
  @Roles(UserRole.ADMIN)
  async updateUserRole(
    @Param('id') id: string,
    @Body() body: any,
  ): Promise<any> {
    const { data } = await firstValueFrom(
      this.http.patch(`${this.authUrl}/users/${id}/role`, body),
    );
    return data;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete('users/:id')
  @Roles(UserRole.ADMIN)
  async deleteUser(@Param('id') id: string): Promise<any> {
    const { data } = await firstValueFrom(
      this.http.delete(`${this.authUrl}/users/${id}`),
    );
    return data;
  }
}
