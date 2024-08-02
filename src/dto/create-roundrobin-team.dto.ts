import { IsInt, IsPositive } from 'class-validator';

export class CreateroundrobinTeamDto {
  @IsInt()
  @IsPositive()
  ropingId: number;

  @IsInt()
  @IsPositive()
  classification: number;
}
