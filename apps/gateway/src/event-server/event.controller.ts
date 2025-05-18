import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Req,
  UseGuards,
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
  async create(
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
  async findAll(): Promise<any> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.eventUrl}/events`),
    );
    return response.data;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async findOne(@Param('id') id: string): Promise<any> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.eventUrl}/events/${id}`),
    );
    return response.data;
  }
}
