import { Controller, Get, Query, Req } from '@nestjs/common';
import { RewardClaimService } from './reward-claim.service';
import { RewardClaimResponseDto } from './dto/reward-claim-response.dto';

@Controller('reward-claims')
export class RewardClaimController {
  constructor(private readonly rewardClaimService: RewardClaimService) {}

  @Get('me')
  async getMyClaims(
    @Req() req: { user: { userId: string } },
  ): Promise<RewardClaimResponseDto[]> {
    const userId = req.user.userId;
    return this.rewardClaimService.getUserClaims(userId);
  }

  @Get()
  async getAllClaims(
    @Query('eventId') eventId?: string,
  ): Promise<RewardClaimResponseDto[]> {
    return this.rewardClaimService.getAllClaims(eventId);
  }
}
