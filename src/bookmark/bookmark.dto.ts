import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional,} from 'class-validator';

@InputType()
export class BookmarkDto {
  @Field()
  @IsNotEmpty({ message: 'Contractor Id is required' })
  contractorId: string;
  @Field({ defaultValue : false})
  @IsOptional()
  isBookmark: boolean;

}