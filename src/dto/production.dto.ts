import { IsDate, IsNotEmpty } from 'class-validator';

export class ProductionDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsDate()
  date: Date;
}
