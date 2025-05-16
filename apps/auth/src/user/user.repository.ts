import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(user: Partial<User>): Promise<UserDocument> {
    return this.userModel.create(user);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ _id: id, isDeleted: false });
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find({ isDeleted: false }, { password: 0, __v: 0 });
  }

  async softDelete(id: string): Promise<void> {
    await this.userModel.updateOne({ _id: id }, { isDeleted: true });
  }
}
