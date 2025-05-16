import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserModel } from './models/user.model';
import * as bcrypt from 'bcrypt';
import { UserDocument } from './entities/user.entity';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(dto: CreateUserDto): Promise<void> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Already exists email');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    await this.userRepository.create({
      email: dto.email,
      password: hashed,
      role: dto.role,
    });
  }

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

  async updateRole(id: string, dto: UpdateUserRoleDto): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User not found with id: ${id}`);
    }

    user.role = dto.role;
    await user.save();
  }

  async delete(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException(`User not found with id: ${id}`);
    await this.userRepository.softDelete(id);
  }
}
