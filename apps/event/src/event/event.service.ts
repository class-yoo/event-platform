import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventRepository } from './repository/event.repository.interface';
import { CreateEventDto } from './dto/create-event.dto';
import { EventModel } from './models/event.model';

@Injectable()
export class EventService {
  constructor(
    @Inject('EventRepository') private readonly eventRepo: EventRepository,
  ) {}

  async createEvent(dto: CreateEventDto, userId: string): Promise<EventModel> {
    return this.eventRepo.create({ ...dto, createdBy: userId });
  }

  async getEvents(): Promise<EventModel[]> {
    return this.eventRepo.findAllActive();
  }

  async getEventById(eventId: string): Promise<EventModel> {
    const event = await this.eventRepo.findById(eventId);
    if (!event || !event.active) {
      throw new NotFoundException(`Event not found with id: ${eventId}`);
    }

    return event;
  }
}
