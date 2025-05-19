import {
  Controller,
  Get,
  Req,
  UseGuards,
  Query, UseInterceptors,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Roles } from '../decorators/roles.decorator';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';
import { UserRole } from '@shared/enums/user-role.enum';
import { HttpProxyErrorInterceptor } from '../interceptors/http-proxy-error.interceptor';

@Controller('reward-claims')
export class RewardClaimsController {
  private readonly eventUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.eventUrl = configService.get<string>('EVENT_SERVICE_URL')!;
  }

  @UseInterceptors(HttpProxyErrorInterceptor)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('me')
  @Roles(UserRole.USER)
  async getMyClaims(@Req() req: { user: { userId: string } }): Promise<any> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.eventUrl}/reward-claims/me`, {
        headers: {
          'x-user-id': req.user.userId,
        },
      }),
    );
    return response.data;
  }

  @UseInterceptors(HttpProxyErrorInterceptor)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR, UserRole.AUDITOR)
  async getAllClaims(@Query('eventId') eventId?: string): Promise<any> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.eventUrl}/reward-claims`, {
        params: eventId ? { eventId } : {},
      }),
    );
    return response.data;
  }
}
