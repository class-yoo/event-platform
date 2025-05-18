import { UserRole } from '@shared/enums/user-role.enum';

export class UserDto {
  id: string;
  role: UserRole;
}
