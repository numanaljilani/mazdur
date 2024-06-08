import { ObjectType, Field } from '@nestjs/graphql';
import { ErrorType } from 'src/auth/types';

@ObjectType()
export class Contractor {
  @Field(() => String)
  id: string;

  @Field(() => String)
  category : string;

  @Field(() => [String])
  subCategory: string[];

  @Field(() => Boolean)
  availability: boolean;

  @Field(() => String)
  locality: string;

  @Field(() => String)
  price: string;
  
  @Field(() => [String])
  images?: [];

}

@ObjectType()
export class createConntractorResponse {
  @Field(() => Contractor, { nullable: true }) // Assuming User is another ObjectType you have
  contractor?: Contractor;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}
