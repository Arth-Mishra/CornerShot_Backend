import { IsInt, IsNotEmpty } from 'class-validator';

export class CreatePickAndDrawTeamDto {
  @IsInt()
  @IsNotEmpty()
  roping_Id: number;

  @IsInt()
  @IsNotEmpty()
  classification: number;

  @IsInt()
  @IsNotEmpty()
  header_Id: number;

  @IsInt()
  @IsNotEmpty()
  healer_Id: number;

  @IsInt()
  @IsNotEmpty()
  header_headerRating: number;

  @IsInt()
  @IsNotEmpty()
  header_healerRating: number;

  @IsInt()
  @IsNotEmpty()
  healer_headerRating: number;

  @IsInt()
  @IsNotEmpty()
  healer_healerRating: number;
}
