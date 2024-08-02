import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateRopingClassificationDto {
  @IsOptional()
  round_to_handicap?: number;

  @IsOptional()
  amount_to_handicap?: number;

  @IsOptional()
  handicap_down_amount?: number;

  @IsOptional()
  handicap_up_amount?: number;
}
