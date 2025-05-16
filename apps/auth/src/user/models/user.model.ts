export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  OPERATOR = 'OPERATOR',
  AUDITOR = 'AUDITOR',
}

export class UserModel {
  constructor(
    readonly id: string,
    readonly role: UserRole,
  ) {}
}
