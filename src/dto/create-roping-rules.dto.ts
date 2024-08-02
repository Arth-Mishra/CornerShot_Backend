import { IsInt } from "class-validator";

export class CreateRopingRulesDto {
  @IsInt()
  progressive_after_round: number;

  @IsInt()
  barrier_penalty: number;

  @IsInt()
  leg_penalty: number;

  @IsInt()
  classification: number;
}
