export class CreateUserDto {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly address?: string;
}