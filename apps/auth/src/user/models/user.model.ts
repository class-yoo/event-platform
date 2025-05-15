export class UserModel {
  constructor(
    readonly id: string,
    readonly role: 'USER' | 'OPERATOR' | 'AUDITOR' | 'ADMIN',
  ) {}
}
