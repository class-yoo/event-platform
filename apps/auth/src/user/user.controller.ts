import {
  Controller,
  Patch,
  Param,
  Body,
  Post,
  Delete,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { UserModel } from './models/user.model';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<{ success: true }> {
    await this.userService.createUser(dto);
    return { success: true };
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserDto> {
    const user: UserModel = await this.userService.findById(id);
    return {
      id: user.id,
      role: user.role,
    };
  }

  @Patch(':id/role')
  updateUserRole(
    @Param('id') id: string,
    @Body() dto: UpdateUserRoleDto,
  ): Promise<{ success: true }> {
    return this.userService.updateRole(id, dto).then(() => ({ success: true }));
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<{ success: true }> {
    await this.userService.delete(id);
    return { success: true };
  }
}
