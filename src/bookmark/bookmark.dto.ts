import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class BookmarkDto {
  @Field()
  @IsNotEmpty({ message: 'Contractor Id is required' })
  contractorId: string;

}