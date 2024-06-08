import { ObjectType, Field } from '@nestjs/graphql';
import { ErrorType } from 'src/auth/types';

@ObjectType()
export class Offers {
  @Field(() => String)
  id: string;

  @Field(() => String)
  percent : string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  desc: string;

  @Field(() => String)
  promo: string;


}
// Percent 
// title 
// desc
// Promo
// expiry

@ObjectType()
export class createOfferResponse {
  @Field(() => Offers, { nullable: true }) // Assuming User is another ObjectType you have
  offer?: Offers;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}