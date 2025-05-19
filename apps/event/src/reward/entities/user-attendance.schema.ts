import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class UserAttendance extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  date: Date;
}

export type UserAttendanceDocument = UserAttendance & Document;
export const UserAttendanceSchema =
  SchemaFactory.createForClass(UserAttendance);

UserAttendanceSchema.index({ userId: 1, date: 1 }, { unique: true });
