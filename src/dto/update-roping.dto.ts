import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RopingType } from './create-roping.dto';

export class UpdateRopingDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(RopingType)
  type?: RopingType;

  @IsOptional()
  @IsInt()
  draw_count?: number | null;

  @IsOptional()
  @IsInt()
  max_entries_per_roper?: number | null;

  @IsOptional()
  @IsInt()
  num_rounds?: number;
}
