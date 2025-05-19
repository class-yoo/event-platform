// import {
//   BadRequestException,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';
// import { Inject } from '@nestjs/common';
// import { RewardClaimRepository } from './repository/reward-claim.repository.interface';
// import { RewardClaimResponseDto } from './dto/reward-claim-response.dto';
// import { RewardClaimStatus } from '@shared/enums/reward-claim.enum';
// import { EventConditionChecker } from './checker/event-condition-checker.interface';
// import { RewardRepository } from './repository/reward.repository.interface';
// import { EventRepository } from '../event/repository/event.repository.interface';
// import { EventModel } from '../event/models/event.model';
// import { PointService } from './point.service';
// import { PointType } from '@shared/enums/point-type.enum';
// import { PointStatus } from '@shared/enums/point-status.enum';
// import { InjectConnection } from '@nestjs/mongoose';
// import { Connection } from 'mongoose';
// import { RewardClaimModel } from './models/reward-claim.model';
//
// @Injectable()
// export class RewardClaimService {
//   constructor(
//     @InjectConnection() private readonly connection: Connection,
//     @Inject('RewardClaimRepository')
//     private readonly rewardClaimRepo: RewardClaimRepository,
//     @Inject('RewardRepository')
//     private readonly rewardRepo: RewardRepository,
//     @Inject('EventRepository')
//     private readonly eventRepo: EventRepository,
//     @Inject('EventConditionChecker')
//     private readonly checker: EventConditionChecker,
//     private readonly pointService: PointService,
//   ) {}
//
//   async claimReward(
//     eventId: string,
//     rewardId: string,
//     userId: string,
//   ): Promise<RewardClaimResponseDto> {
//     // 1. 중복 요청 방지: 이미 지급된 내역이 있는지 확인
//     const exist = await this.rewardClaimRepo.findOneByEventRewardUser(
//       eventId,
//       rewardId,
//       userId,
//     );
//     if (exist) {
//       throw new BadRequestException(
//         `이미 보상을 받은 이벤트입니다. eventId: ${eventId}, rewardId: ${rewardId}, userId: ${userId}`,
//       );
//     }
//
//     // 2. Reward/Event 존재 유무 체크
//     const event: EventModel | null = await this.eventRepo.findById(eventId);
//     if (!event) {
//       throw new NotFoundException('이벤트가 존재하지 않습니다.');
//     }
//     if (!event.active) {
//       throw new BadRequestException('종료된 이벤트입니다.');
//     }
//
//     const reward = await this.rewardRepo.findByEventIdAndRewardId(
//       event.id,
//       rewardId,
//     );
//     if (!reward) {
//       throw new NotFoundException('보상이 존재하지 않습니다.');
//     }
//     if (!reward.active) {
//       throw new BadRequestException('비활성화된 보상입니다.');
//     }
//
//     // 3. 조건 검증 로직
//     const checker = this.checker.supports(event.type);
//     if (!checker) {
//       throw new BadRequestException('지원하지 않는 이벤트 타입입니다.');
//     }
//     const qualified = await this.checker.check(userId, event, event.threshold);
//     if (!qualified) {
//       throw new BadRequestException('보상 조건을 충족하지 않았습니다.');
//     }
//
//     // 4. 보상 요청 기록 생성 및 리워드 지급 (자동)
//     // 만약 운영자 검토 후 지급이라면 로직 수정 필요 - RewardClaimStatus.PENDING으로 설정 후 다른 로직에서 처리
//     const session = await this.connection.startSession();
//     let claim: RewardClaimModel | undefined;
//
//     try {
//       await session.withTransaction(async () => {
//         claim = await this.rewardClaimRepo.create(
//           {
//             eventId,
//             rewardId,
//             userId,
//             status: RewardClaimStatus.COMPLETED,
//             claimedAt: new Date(),
//             message: '보상 요청이 정상적으로 등록 되었습니다.',
//           },
//           session,
//         );
//
//         await this.pointService.addPoint(
//           {
//             userId,
//             amount: reward.amount,
//             type: PointType.EVENT,
//             status: PointStatus.NORMAL,
//           },
//           session,
//         );
//       });
//     } finally {
//       session.endSession();
//     }
//
//     if (!claim) {
//       throw new Error('보상 지급 처리 중 오류가 발생했습니다.');
//     }
//
//     return {
//       id: claim.id,
//       success: true,
//       status: claim.status,
//       message: claim?.message || '',
//       claimedAt: claim.claimedAt,
//     };
//   }
//
//   async getUserClaims(userId: string): Promise<RewardClaimResponseDto[]> {
//     const claims = await this.rewardClaimRepo.findAllByUserId(userId);
//     return claims.map((claim) => ({
//       id: claim.id,
//       success: claim.status === RewardClaimStatus.COMPLETED,
//       status: claim.status,
//       message: claim.message ?? '',
//       claimedAt: claim.claimedAt,
//     }));
//   }
// }
