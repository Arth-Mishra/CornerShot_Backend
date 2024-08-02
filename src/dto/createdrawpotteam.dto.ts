import { IsInt, IsPositive } from 'class-validator';

export class CreateTeamDto {
  @IsInt()
  @IsPositive()
  ropingId: number;

  @IsInt()
  @IsPositive()
  classification: number;
}
