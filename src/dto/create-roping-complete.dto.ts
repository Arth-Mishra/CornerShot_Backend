import { IsInt, IsOptional, ValidateNested } from "class-validator";
import { CreateRopingClassificationDto } from "./create-roping-classification.dto";
import { CreateRopingFinancialsDto } from "./create-roping-financials.dto";
import { CreateRopingRulesDto } from "./create-roping-rules.dto";
import { CreateRopingDto } from "./create-roping.dto";
import { Type } from 'class-transformer';





export class CreateRopingCompleteDto {
  @IsInt()
  productionId: number;

  @ValidateNested()
  @Type(() => CreateRopingDto)
  roping: CreateRopingDto;

  @ValidateNested()
  @Type(() => CreateRopingRulesDto)
  ropingRules: CreateRopingRulesDto;

  @ValidateNested()
  @Type(() => CreateRopingFinancialsDto)
  ropingFinancials: CreateRopingFinancialsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateRopingClassificationDto)
  ropingClassification?: CreateRopingClassificationDto;
}