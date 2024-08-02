import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";



export enum RopingType {
  Draw_Pot = 'Draw Pot',
  Pick_And_Draw = 'Pick & Draw',
  Pick_Only = 'Pick Only',
  Pick_or_Draw = 'Pick or Draw',
  Round_Robin = 'Round Robin',
}

export class CreateRopingDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(RopingType)
  type: RopingType;

  @IsOptional()
  @IsInt()
  draw_count?: number | null;

  @IsInt()
  max_entries_per_roper: number | null;

  @IsInt()
  num_rounds: number;
}
