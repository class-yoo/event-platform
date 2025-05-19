import { RewardType } from '@shared/enums/reward-type.enum';

export class CreateRewardDto {
  type: RewardType;
  name: string; // 보상 이름
  amount: number; // 수량
}
