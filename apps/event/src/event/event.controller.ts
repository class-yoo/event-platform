import {
  Controller,
  Post,
  Get,
  Param,
  Body,
} from '@nestjs/common';
import { EventResponseDto } from './dto/event-response.dto';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { EventModel } from './models/event.model';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async create(@Body() dto: CreateEventDto): Promise<EventResponseDto> {
    const model = await this.eventService.createEvent(
      dto,
      'userId-From-Gateway',
    ); // user_id 전달 방식만 맞추면 됨
    return this.toResponseDto(model);
  }

  @Get()
  async findAll(): Promise<EventResponseDto[]> {
    const models = await this.eventService.getEvents();
    return models.map(this.toResponseDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<EventResponseDto> {
    const model = await this.eventService.getEventById(id);
    return this.toResponseDto(model);
  }

  // Model → ResponseDto 매핑 함수 (private/static도 OK)
  private toResponseDto(model: EventModel): EventResponseDto {
    return { ...model };
  }
}
