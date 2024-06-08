import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class ContractorDto {


  @Field(() => String)
  @IsNotEmpty({ message: 'Category is required' })
  category : string;

  @Field(() => [String])
  @IsOptional()
  subCategory?: [string];

  @Field(() => Boolean)
  @IsOptional()
  availability?: boolean;

  @Field(() => String)
  @IsOptional()
  locality?: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Price is required' })
  price: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'unit is reqiure' })
  unit: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Please provide a short description' })
  desc: string;


}
