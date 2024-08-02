import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class ContestantDto {
  @IsNotEmpty()
  name: string;

  @IsPhoneNumber(null)
  phone_number: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  header_rating: number;

  @IsNotEmpty()
  healer_rating: number;
}
