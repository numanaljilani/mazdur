import { ObjectType, Field } from '@nestjs/graphql';
import { ErrorType } from 'src/auth/types';
import { User } from 'src/user/user.model';

@ObjectType()
export class AddToBookmark {
  @Field(() => String, { nullable: true }) // Assuming User is another ObjectType you have
  message?: string;
}
@ObjectType()
export class BookmarkConntractorsResponse {
  @Field()
  id?: string;

  @Field()
  contractorId: string;

  @Field()
  contractor: User;

  @Field()
  userId: string;
}

@ObjectType()
export class AddToBookmarkResponse {
  @Field(() => AddToBookmark, { nullable: true }) // Assuming User is another ObjectType you have
  bookmark?: AddToBookmark;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}
