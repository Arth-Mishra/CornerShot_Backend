import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateRopingRulesDto {
  @IsOptional() 
  @IsInt()
  progressive_after_round?: number;

  @IsOptional()
  @IsInt()
  barrier_penalty?: number;

  @IsOptional()
  @IsInt()
  leg_penalty?: number;

  @IsOptional()
  @IsInt()
  classification?: number;
}
