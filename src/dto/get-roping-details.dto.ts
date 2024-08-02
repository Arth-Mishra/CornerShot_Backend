import { IsInt } from 'class-validator';

export class GetRopingDetailsDto {
  @IsInt()
  ropingId: number;
}
