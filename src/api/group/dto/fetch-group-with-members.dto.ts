export class FetchGroupWithMembersDto {
  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly users: Array<{
    id: number;
    name: string;
    email: string;
    phone: string;
  }>;
}