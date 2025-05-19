import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RewardClaimStatus } from '@shared/enums/reward-claim.enum';

@Schema({ timestamps: true })
export class RewardClaim extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Event' })
  eventId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Reward' })
  rewardId: Types.ObjectId;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, enum: RewardClaimStatus })
  status: RewardClaimStatus;

  @Prop()
  message?: string; // 기타 메세지

  @Prop()
  claimedAt?: Date; // 지급 완료 시각
}

export type RewardClaimDocument = RewardClaim &
  Document & {
    _id: Types.ObjectId;
  };

export const RewardClaimSchema = SchemaFactory.createForClass(RewardClaim);

// 중복요청 방지를 위한 인덱스 설정
RewardClaimSchema.index(
  { userId: 1, rewardId: 1, eventId: 1 },
  { unique: true },
);
