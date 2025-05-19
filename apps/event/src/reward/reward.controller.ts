import { Controller, Post, Get, Param, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { RewardService } from './reward.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { RewardResponseDto } from './dto/reward-response.dto';
import { RewardModel } from './models/reward.model';
// import { RewardClaimResponseDto } from './dto/reward-claim-response.dto';
// import { RewardClaimService } from './reward-claim.service';

@Controller('events/:eventId/rewards')
export class RewardController {
  constructor(
    private readonly rewardService: RewardService,
    // private readonly rewardClaimService: RewardClaimService,
  ) {}

  // 보상 등록: POST /events/:eventId/rewards
  @Post()
  async create(
    @Param('eventId') eventId: string,
    @Body() dto: CreateRewardDto,
    @Req() req: Request,
  ): Promise<RewardResponseDto> {
    const userId = req.headers['x-user-id'] as string;
    const model = await this.rewardService.createReward(
      { ...dto, eventId },
      userId,
    );
    return this.toResponseDto(model);
  }

  @Get()
  async findAll(
    @Param('eventId') eventId: string,
  ): Promise<RewardResponseDto[]> {
    const models = await this.rewardService.getRewardsByEventId(eventId);
    return models.map(this.toResponseDto);
  }

  @Get(':rewardId')
  async findOne(
    @Param('eventId') eventId: string,
    @Param('rewardId') id: string,
  ): Promise<RewardResponseDto> {
    const model = await this.rewardService.getRewardByIdInEvent(eventId, id);
    return this.toResponseDto(model);
  }

  private toResponseDto(model: RewardModel): RewardResponseDto {
    return { ...model };
  }
}
