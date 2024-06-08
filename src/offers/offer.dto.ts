import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateOfferDto {
  @Field()
  @IsNotEmpty({ message: 'Percentage in required' })
  @IsOptional()
  percent: number;

  @Field({ nullable: true })
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  desc?: string;

  @Field({ nullable: true })
  @IsOptional()
  promo?: string;
}

