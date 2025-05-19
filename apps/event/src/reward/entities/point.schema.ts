import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PointType } from '@shared/enums/point-type.enum';
import { PointStatus } from '@shared/enums/point-status.enum';

@Schema({ timestamps: true })
export class Point extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: PointType })
  type: PointType; // 지급 출처/종류(일반/이벤트)

  @Prop({ required: true, enum: PointStatus, default: PointStatus.NORMAL })
  status: PointStatus; // 상태(정상/소멸)

  @Prop()
  note?: string; // 기타 사유
}

export type PointDocument = Point & Document & { _id: Types.ObjectId };
export const PointSchema = SchemaFactory.createForClass(Point);
