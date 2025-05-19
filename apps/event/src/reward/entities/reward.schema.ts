import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RewardType } from '@shared/enums/reward-type.enum';

@Schema({ timestamps: true })
export class Reward extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Event' })
  eventId: Types.ObjectId;

  @Prop({ required: true, enum: RewardType })
  type: RewardType;

  @Prop({ required: true })
  name: string; // 보상명

  @Prop({ required: false })
  amount: number; // 보상 수량

  @Prop({ required: true })
  createdBy: string; // 운영자 user_id

  @Prop({ default: true })
  active: boolean;
}

export type RewardDocument = Reward &
  Document & {
    _id: Types.ObjectId;
  };
export const RewardSchema = SchemaFactory.createForClass(Reward);
