import { IsInt, IsNotEmpty } from 'class-validator';

export class CreatePickOnlyTeamDto {
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
  headerRating: number;

  @IsInt()
  @IsNotEmpty()
  healerRating: number;
}
