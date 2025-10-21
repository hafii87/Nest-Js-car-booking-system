export class FetchUserWithGroupsDto {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly groups: Array<{
    id: number;
    name: string;
    description: string;
  }>;
}