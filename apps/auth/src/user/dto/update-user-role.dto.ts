import { IsEnum } from 'class-validator';
import { UserRole } from '../models/user.model';

export class UpdateUserRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}
