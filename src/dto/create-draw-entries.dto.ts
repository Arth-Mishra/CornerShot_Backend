import { IsInt, IsPositive, IsNotEmpty } from 'class-validator';

export class CreateDrawEntryDto {
  @IsInt()
  @IsPositive()
  roping_id: number;

  @IsInt()
  @IsPositive()
  contestant_id: number;

  @IsInt()
  @IsNotEmpty()
  header_rating: number;

  @IsInt()
  @IsNotEmpty()
  healer_rating: number;

  @IsInt()
  @IsNotEmpty()
  header_entries: number;

  @IsInt()
  @IsNotEmpty()
  healer_entries: number;
}
