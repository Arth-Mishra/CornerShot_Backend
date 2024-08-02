import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateRopingFinancialsDto {
  @IsOptional()
  entry_fees?: number;

  @IsOptional()
  @IsInt()
  stock_charge_percent?: number;

  @IsOptional()
  @IsInt()
  association_fees?: number;

  @IsOptional()
  @IsInt()
  price_deduction?: number;

  @IsOptional()
  @IsInt()
  added_money?: number;
}
