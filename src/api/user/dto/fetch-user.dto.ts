export class FetchUserDto {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly address?: string;
  readonly active: boolean;
}