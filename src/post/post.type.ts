import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/user/user.model';


@ObjectType()
export class PostType {

  @Field(() => String, { nullable: true })
  rating?: string;

  @Field(() => String, { nullable: true })
  text : string;


  @Field(() => String, { nullable: true })
  createdAt: string;

  @Field(() =>User , { nullable: true })
  user: User;

}