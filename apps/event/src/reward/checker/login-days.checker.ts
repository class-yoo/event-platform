import { Inject, Injectable } from '@nestjs/common';
import { UserAttendanceMongoRepository } from '../repository/user-attendance-mongo.repository';
import { EventModel } from '../../event/models/event.model';
import { EventConditionChecker } from './event-condition-checker.interface';
import { EventType } from '@shared/enums/event-type.enum';
import { differenceInDays } from 'date-fns';

@Injectable()
export class LoginDaysChecker implements EventConditionChecker {
  constructor(
    @Inject('UserAttendanceRepository')
    private readonly attendanceRepo: UserAttendanceMongoRepository,
  ) {}

  supports(type: EventType) {
    return type === EventType.LOGIN_DAYS;
  }

  async check(
    userId: string,
    event: EventModel,
    threshold: number,
  ): Promise<boolean> {

    const dates = await this.attendanceRepo.getUserAttendanceDates(
      userId,
      event.startAt,
      event.endAt,
    );

    if (dates.length < threshold) return false;

    // 날짜 배열을 string(YYYY-MM-DD)로 변환 후 정렬
    const normalized = dates
      .map((d) => new Date(d))
      .sort((a, b) => a.getTime() - b.getTime());

    let maxStreak = 1;
    let streak = 1;

    for (let i = 1; i < normalized.length; i++) {
      const prev = normalized[i - 1];
      const curr = normalized[i];
      if (differenceInDays(curr, prev) === 1) {
        streak++;
        maxStreak = Math.max(maxStreak, streak);
      } else if (differenceInDays(curr, prev) > 1) {
        streak = 1;
      }
    }
    return maxStreak >= threshold;
  }
}
