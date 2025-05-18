import { UserRole } from '@shared/enums/user-role.enum';

export class UserModel {
  constructor(
    readonly id: string,
    readonly role: UserRole,
  ) {}
}
