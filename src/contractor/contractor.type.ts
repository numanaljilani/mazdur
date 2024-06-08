import { ObjectType, Field } from '@nestjs/graphql';
import { ErrorType } from 'src/auth/types';
import { User } from 'src/user/user.model';

@ObjectType()
export class Contractor {
  @Field()
  id?: string;

  @Field()
  fullname: string;

  @Field()
  email?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  dob?: string;

  @Field({ nullable: true })
  nikname?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  image: string;


  @Field(() => String, { nullable: true })
  service : string;

  @Field(() => [String], { nullable: true })
  subService: string[];

  @Field(() => String, { nullable: true })
  price: string;
  
  @Field(() => String, { nullable: true })
  unit: string;

  @Field(() => String, { nullable: true })
  about: string;
  
}
@ObjectType()
export class ConntractorsResponse {
  @Field()
  id?: string;

  @Field({ nullable: true })
  fullname: string;


  @Field({ nullable: true })
  image: string;


  @Field(() => String, { nullable: true })
  service : string;

  @Field(() => [String], { nullable: true })
  subService: string[];

  @Field(() => String, { nullable: true })
  price: string;
  
  @Field(() => String, { nullable: true })
  unit: string;  
}

@ObjectType()
export class conntractorResponse {
  @Field(() => User, { nullable: true }) // Assuming User is another ObjectType you have
  user?: User;

  @Field(() => Contractor, { nullable: true }) // Assuming User is another ObjectType you have
  contractor?: Contractor;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}