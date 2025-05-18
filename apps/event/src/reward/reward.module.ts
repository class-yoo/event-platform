import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reward, RewardSchema } from './entities/reward.schema';
import { RewardMongoRepository } from './repository/reward-mongo.repository';
import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reward.name, schema: RewardSchema }]),
  ],
  providers: [
    RewardService,
    { provide: 'RewardRepository', useClass: RewardMongoRepository },
  ],
  controllers: [RewardController],
})
export class RewardModule {}
