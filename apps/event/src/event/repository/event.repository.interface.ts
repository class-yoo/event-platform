import { CreateEventDto } from '../dto/create-event.dto';
import { EventModel } from '../models/event.model';

export interface EventRepository {
  create(data: CreateEventDto & { createdBy: string }): Promise<EventModel>;
  findAllActive(): Promise<EventModel[]>;
  findById(id: string): Promise<EventModel | null>;
}
