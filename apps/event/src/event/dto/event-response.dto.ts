import { EventType } from '@shared/enums/event-type.enum';

export class EventResponseDto {
  id: string;
  title: string;
  description: string;
  type: EventType;
  target: number;
  startAt: Date;
  endAt: Date;
  active: boolean;
  createdBy: string;
}
