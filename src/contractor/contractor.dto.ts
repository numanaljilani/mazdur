import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class RegisterContractorDto {
  @Field()
  @IsNotEmpty({ message: 'Service name is required' })
  service: string;

  @Field(() => [String] ,{ nullable: true })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @Type(() => String)
  subServices: string[]; 

  @Field({ nullable: true })
  @IsOptional()
  price?: string;

  @Field({ nullable: true })
  @IsOptional()
  unit?: string;

  @Field({ nullable: true })
  @IsOptional()
  about?: string;
}
@InputType()
export class ContractorsDto {
  @Field()
  @IsNotEmpty({ message: 'Service name is required' })
  service: string;

  @Field({nullable : true , defaultValue : 0})
  @IsOptional()
  skip : number;

  @Field({nullable : true , defaultValue : 20})
  @IsOptional()
  take : number;

}

@InputType()
export class ContractorDetailsDto {
  @Field()
  @IsNotEmpty({ message: 'Service name is required' })
  id: string;

}
