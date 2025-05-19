// import { Controller, Post, Get, Param, Body, Req } from '@nestjs/common';
// import { RewardClaimService } from './reward-claim.service';
// import { UserRole } from '@shared/enums/user-role.enum';
//
// @Controller('reward-claims')
// export class RewardClaimController {
//   constructor(private readonly rewardClaimService: RewardClaimService) {}
//
//   @Get()
//   async getClaims(
//     @Query() query: RewardClaimQueryDto,
//     @Req() req: { user: { userId: string; role: UserRole } },
//   ): Promise<RewardClaim[]> {
//     const isAdmin = [UserRole.ADMIN, UserRole.OPERATOR, UserRole.AUDITOR].includes(req.user.role);
//     if (!isAdmin) {
//       query.userId = req.user.userId;
//     }
//     return this.rewardClaimService.getClaims(query);
//   }
// }
//
