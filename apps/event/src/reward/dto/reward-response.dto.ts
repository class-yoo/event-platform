export class RewardResponseDto {
  id: string;
  eventId: string;
  type: string;
  name: string;
  amount: number;
  active: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
