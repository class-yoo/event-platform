import { EventType } from '@shared/enums/event-type.enum';

export interface EventModel {
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
