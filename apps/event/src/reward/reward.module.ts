import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reward, RewardSchema } from './entities/reward.schema';
import { RewardMongoRepository } from './repository/reward-mongo.repository';
import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';
import { RewardClaimMongoRepository } from './repository/reward-claim-mongo.repository';
// import { RewardClaimService } from './reward-claim.service';
import { RewardClaim, RewardClaimSchema } from './entities/reward-claim.schema';
import { PointService } from './point.service';
import { PointMongoRepository } from './repository/point-mongo.repository';
import { UserAttendanceMongoRepository } from './repository/user-attendance-mongo.repository';
import { EventMongoRepository } from '../event/repository/event-mongo.repository';
import { LoginDaysChecker } from './checker/login-days.checker';
import { Point, PointSchema } from './entities/point.schema';
import {
  UserAttendance,
  UserAttendanceSchema,
} from './entities/user-attendance.schema';
import { EventSchema } from '../event/entities/event.schema';
import { UserAttendanceController } from './attendance/user-attendance.controller';
import { UserAttendanceService } from './attendance/user-attendance.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reward.name, schema: RewardSchema },
      { name: RewardClaim.name, schema: RewardClaimSchema },
      { name: Event.name, schema: EventSchema },
      { name: Point.name, schema: PointSchema },
      { name: UserAttendance.name, schema: UserAttendanceSchema },
    ]),
  ],
  providers: [
    RewardService,
    // RewardClaimService,
    PointService,
    { provide: 'RewardRepository', useClass: RewardMongoRepository },
    { provide: 'RewardClaimRepository', useClass: RewardClaimMongoRepository },
    { provide: 'PointRepository', useClass: PointMongoRepository },
    {
      provide: 'UserAttendanceRepository',
      useClass: UserAttendanceMongoRepository,
    },
    { provide: 'EventRepository', useClass: EventMongoRepository },
    {
      provide: 'EventConditionChecker',
      useClass: LoginDaysChecker,
    },
    UserAttendanceService, // temp
  ],
  controllers: [RewardController, UserAttendanceController],
})
export class RewardModule {}
