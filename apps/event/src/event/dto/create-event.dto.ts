import { EventType } from '@shared/enums/event-type.enum';

export class CreateEventDto {
  title: string;
  description: string;
  type: EventType; // 조건 유형 (숫자 enum)
  threshold: number; // 달성 기준값 (ex. 3일, 5명 등)
  startAt: Date;
  endAt: Date;
}
