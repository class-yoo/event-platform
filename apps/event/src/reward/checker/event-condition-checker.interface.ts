import { EventType } from '@shared/enums/event-type.enum';
import { EventModel } from '../../event/models/event.model';

export interface EventConditionChecker {
  supports(type: EventType): boolean;
  check(userId: string, event: EventModel, threshold: number): Promise<boolean>;
}
