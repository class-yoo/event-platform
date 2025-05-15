import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document & { _id: Types.ObjectId };

@Schema()
export class User {
  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: 'USER' })
  role: 'USER' | 'OPERATOR' | 'AUDITOR' | 'ADMIN';
}

export const UserSchema = SchemaFactory.createForClass(User);
