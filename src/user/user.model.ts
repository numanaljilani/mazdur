import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
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

  @Field({ nullable: true })
  isContractor: boolean;

  @Field()
  password: string;

  @Field({nullable : true})
  accessToken?: string;

  @Field({ nullable : true})
  refreshToken?: string;

  @Field(() => [String],{ nullable: true })
  bookmark?: [];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
