import { IsInt } from "class-validator";

export class CreateRopingFinancialsDto {
    @IsInt()
  entry_fees: number;

  @IsInt()
  stock_charge_percent: number;

  @IsInt()
  association_fees: number;

  @IsInt()
  price_deduction: number;

  @IsInt()
  added_money: number;
}
