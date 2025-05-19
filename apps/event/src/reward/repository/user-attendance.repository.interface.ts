export interface UserAttendanceRepository {
  getUserAttendanceDates(
    userId: string,
    start: Date,
    end: Date,
  ): Promise<Date[]>;
}
