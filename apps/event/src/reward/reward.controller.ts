import { Controller, Post, Get, Param, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { RewardService } from './reward.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { RewardResponseDto } from './dto/reward-response.dto';
import { RewardModel } from './models/reward.model';

@Controller('events/:eventId/rewards')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  // 보상 등록: POST /events/:eventId/rewards
  @Post()
  async create(
    @Param('eventId') eventId: string,
    @Body() dto: CreateRewardDto,
    @Req() req: Request,
  ): Promise<RewardResponseDto> {
    const userId = req.headers['x-user-id'] as string;
    const model = await this.rewardService.createReward(
      { ...dto, eventId }, // eventId를 DTO에 추가
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

  // 보상 단건 조회: GET /events/:eventId/rewards/:id
  @Get(':id')
  async findOne(
    @Param('eventId') eventId: string,
    @Param('id') id: string,
  ): Promise<RewardResponseDto> {
    const model = await this.rewardService.getRewardByIdInEvent(eventId, id);
    return this.toResponseDto(model);
  }

  private toResponseDto(model: RewardModel): RewardResponseDto {
    return { ...model };
  }
}
