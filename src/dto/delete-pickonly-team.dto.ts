import { IsInt, IsNotEmpty } from 'class-validator';

export class PickOnlyTeamDeleteDto {
  @IsInt()
  @IsNotEmpty()
  header_Id: number;

  @IsInt()
  @IsNotEmpty()
  healer_Id: number;

  @IsInt()
  @IsNotEmpty()
  roping_Id: number;
}
