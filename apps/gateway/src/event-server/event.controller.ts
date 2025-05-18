import { Controller, Post, Param, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Roles } from '../decorators/roles.decorator';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';

@Controller('events')
export class EventController {
  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @Post(':id/claim')
  @Roles('USER')
  async claim(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<{ success: boolean }> {
    const eventUrl = this.configService.get<string>('EVENT_SERVICE_URL');
    const { data } = await firstValueFrom(
      this.http.post(`${eventUrl}/events/${id}/claim`, {
        userId: (req.user as any).userId,
      }),
    );
    return data;
  }
}
