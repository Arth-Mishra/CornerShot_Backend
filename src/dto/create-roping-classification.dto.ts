import { IsInt } from "class-validator";

export class CreateRopingClassificationDto {
   @IsInt()
  round_to_handicap: number;

  @IsInt()
  amount_to_handicap: number;

  @IsInt()
  handicap_down_amount: number;

  @IsInt()
  handicap_up_amount: number;
}
