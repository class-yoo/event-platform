// event.schema.ts (Mongoose 기준)
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EventType } from '@shared/enums/event-type.enum';

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: Number, enum: EventType })
  type: EventType;

  @Prop({ required: true })
  target: number;

  @Prop({ required: true })
  startAt: Date;

  @Prop({ required: true })
  endAt: Date;

  @Prop({ default: true })
  active: boolean;

  @Prop({ required: true })
  createdBy: string; // user_id, 반드시 JWT에서 추출하여 세팅
}

export type EventDocument = Event &
  Document & {
    _id: Types.ObjectId;
  };

export const EventSchema = SchemaFactory.createForClass(Event);
