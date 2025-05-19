import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Roles } from '../decorators/roles.decorator';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';
import { UserRole } from '@shared/enums/user-role.enum';

@Controller('events')
export class EventController {
  private readonly eventUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.eventUrl = configService.get<string>('EVENT_SERVICE_URL')!;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async createEvent(
    @Body() dto: any,
    @Req() req: { user: { userId: string } },
  ): Promise<any> {
    // user_id를 Event 서버에 넘겨주는 방식(예: header)
    const userId = req.user.userId;

    const response = await firstValueFrom(
      this.httpService.post(`${this.eventUrl}/events`, dto, {
        headers: { 'x-user-id': userId },
      }),
    );
    return response.data;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async findAllEvent(): Promise<any> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.eventUrl}/events`),
    );
    return response.data;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async findOneEvent(@Param('id') id: string): Promise<any> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.eventUrl}/events/${id}`),
    );
    return response.data;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post(':eventId/rewards')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async createReward(
    @Param('eventId') eventId: string,
    @Body() dto: any,
    @Req() req: { user: { userId: string } },
  ): Promise<any> {
    const userId = req.user?.userId;
    const response = await firstValueFrom(
      this.httpService.post(`${this.eventUrl}/events/${eventId}/rewards`, dto, {
        headers: { 'x-user-id': userId },
      }),
    );

    return response.data;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get(':eventId/rewards')
  @Roles(UserRole.ADMIN)
  async findAllReward(@Param('eventId') eventId: string): Promise<any> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.eventUrl}/events/${eventId}/rewards`),
    );
    return response.data;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get(':eventId/rewards/:rewardId')
  @Roles(UserRole.ADMIN)
  async findOneReward(
    @Param('eventId') eventId: string,
    @Param('rewardId') rewardId: string,
  ): Promise<any> {
    const response = await firstValueFrom(
      this.httpService.get(
        `${this.eventUrl}/events/${eventId}/rewards/${rewardId}`,
      ),
    );
    return response.data;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post(':eventId/rewards/:rewardId/claim')
  @Roles(UserRole.USER, UserRole.ADMIN, UserRole.OPERATOR)
  async claimReward(
    @Param('eventId') eventId: string,
    @Param('rewardId') rewardId: string,
    @Req() req: { user: { userId: string } },
    @Body() dto: any,
  ): Promise<any> {
    const userId = req.user.userId;
    // Event 서버로 x-user-id 헤더와 함께 POST
    const response = await firstValueFrom(
      this.httpService.post(
        `${this.eventUrl}/events/${eventId}/rewards/${rewardId}/claim`,
        dto,
        { headers: { 'x-user-id': userId } },
      ),
    );
    return response.data;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('claims')
  @Roles(UserRole.USER)
  async getUserRewardClaims(
    @Req() req: { user: { userId: string } },
  ): Promise<any> {
    const url = `${this.eventUrl}/reward-claims`;
    const response = await firstValueFrom(
      this.httpService.get(url, {
        headers: { user_id: req.user.userId },
      }),
    );
    return response.data;
  }
}
