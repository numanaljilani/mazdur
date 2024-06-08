import { ObjectType, Field } from '@nestjs/graphql';
import { ErrorType } from 'src/auth/types';
import { User } from 'src/user/user.model';

// @ObjectType()
// export class MyNotificationResponse {
//   @Field(() => String, { nullable: true }) // Assuming User is another ObjectType you have
//   message?: string;
// }
@ObjectType()
export class MyNotificationResponse {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => String, { nullable: true })
  title: string;

  @Field(() => String, { nullable: true })
  desc: string;

  @Field(() => String, { nullable: true })
  userId: string;

  @Field(() => String, { nullable: true })
  type: string;

  @Field(() => Boolean, { nullable: true })
  broadcast: boolean;

  @Field(() => String, { nullable: true })
  createdAt: string;
}