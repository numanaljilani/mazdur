import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength, IsString, IsOptional, IsArray, ArrayNotEmpty, ArrayMinSize } from 'class-validator';


@InputType()
export class RegisterDto {
  @Field()
  @IsNotEmpty({ message: 'Fullname is required.' })
  @IsString({ message: 'Fullname must be a string.' })
  fullname: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, { message: 'Password must be at least 8 characters.' })
  password: string;


  @Field()
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email must be valid.' })
  email: string;

  @Field( { nullable: true })
  @IsOptional()
  dob?: string;

  @Field( { nullable: true })
  @IsOptional()
  nikname?: string;

  @Field( { nullable: true })
  @IsOptional()
  phone?: string;

  @Field( { nullable: true })
  @IsOptional()
  address?: string;

  @IsOptional()
  file?: any;
}
export class RegisterContractorDto {
  @Field()
  @IsNotEmpty({ message: 'service is required.' })
  @IsString({ message: 'service must be a string.' })
  service: string;

  @Field()
  @IsNotEmpty({ message: 'token is required.' })
  @IsString({ message: 'token must be a string.' })
  token: string;

  @Field()
  @IsNotEmpty({ message: 'price is required.' })
  @MinLength(2, { message: 'price must be at least 2 digits.' })
  price: string;


  @Field()
  @IsNotEmpty({ message: 'unit is required.' })
  @IsString({ message: 'unit must be valid.' })
  unit: string;

  @Field( () => [String] ,{ nullable: true })
  @IsOptional()
  subServices?: string[];

  @Field( { nullable: true })
  @IsOptional()
  about?: string;
}

@InputType()
export class LoginDto {
  @Field()
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email must be valid.' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required.' })
  password: string;
}
