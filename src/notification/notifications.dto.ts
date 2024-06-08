import { Optional } from '@nestjs/common';
import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';


@InputType()
export class MyNotificationsDto {

  @Field({defaultValue : 20})
  @IsOptional()
  take: number;


  @Field({ defaultValue : 0})
  @IsOptional()
  skip: number;

}