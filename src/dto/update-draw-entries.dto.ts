import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateDrawEntriesDto {
  @IsNotEmpty()
  @IsNumber()
  roping_id: number;

  @IsNotEmpty()
  @IsNumber()
  header_rating: number;

  @IsNotEmpty()
  @IsNumber()
  healer_rating: number;

  @IsNumber()
  header_entries: number;

  @IsNumber()
  healer_entries: number;
}
