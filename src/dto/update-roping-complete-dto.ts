import { IsObject, IsOptional } from "class-validator";
import { UpdateRopingDto } from "./update-roping.dto";
import { UpdateRopingRulesDto } from "./update-roping-rules.dto";
import { UpdateRopingFinancialsDto } from "./update-roping-financials.dto";
import { UpdateRopingClassificationDto } from "./update-roping-classification.dto";




export class UpdateRopingCompleteDto {
  @IsOptional()
  @IsObject()
  roping?: UpdateRopingDto;

  @IsOptional()
  @IsObject()
  ropingRules?: UpdateRopingRulesDto;

  @IsOptional()
  @IsObject()
  ropingFinancials?: UpdateRopingFinancialsDto;

  @IsOptional()
  @IsObject()
  ropingClassification?: UpdateRopingClassificationDto;
}
