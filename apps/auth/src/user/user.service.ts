import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserModel } from './models/user.model';
import * as bcrypt from 'bcrypt';
import { UserDocument } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(email: string, password: string): Promise<void> {
    await this.userRepository.create({
      email,
      password,
    });
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    const user: UserDocument | null =
      await this.userRepository.findByEmail(email);
    return user ? new UserModel(user._id.toString(), user.role) : null;
  }

  async findById(id: string): Promise<UserModel> {
    const user: UserDocument | null = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User not found with id: ${id}`);
    }
    return new UserModel(user._id.toString(), user.role);
  }

  async login(email: string, password: string): Promise<UserModel> {
    const userDoc: UserDocument | null =
      await this.userRepository.findByEmail(email);
    if (!userDoc || !(await bcrypt.compare(password, userDoc.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return new UserModel(userDoc._id.toString(), userDoc.role);
  }
}
