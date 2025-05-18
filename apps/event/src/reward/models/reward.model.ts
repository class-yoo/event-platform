import { RewardType } from '@shared/enums/reward-type.enum';

export class RewardModel {
  id: string;
  eventId: string;
  type: RewardType;
  name: string;
  amount: number;
  active: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
