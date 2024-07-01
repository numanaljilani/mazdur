import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

@InputType()
export class PostDto {
  @Field()
  @IsNotEmpty({ message: 'string is required.' })
  @IsString({ message: 'string must be a string.' })
  rating: string;

  @Field()
  @IsNotEmpty({ message: 'contractorId is required.' })
  @IsString({ message: 'contractorId string must be a string.' })
  contractorId: string;

  @Field()
  @IsNotEmpty({ message: 'serviceId is required.' })
  @IsString({ message: 'serviceId string must be a string.' })
  serviceId: string;

  @Field({ nullable: true })
  @IsOptional()
  text?: string;
}
@InputType()
export class getPostDto {


  @Field()
  @IsNotEmpty({ message: 'contractorId is required.' })
  @IsString({ message: 'contractorId string must be a string.' })
  contractorId: string;


  @Field({ nullable: true })
  @IsOptional()
  take?: number;

  @Field({ nullable: true })
  @IsOptional()
  skip?: number;
}
