import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../user/user.model';

@ObjectType()
export class ErrorType {
  @Field()
  message: string;

  @Field({ nullable: true })
  code?: string;
}

@ObjectType()
export class RegisterResponse {
  @Field(() => User, { nullable: true }) // Assuming User is another ObjectType you have
  user?: User;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class LoginResponse {
  @Field(() => User, { nullable: true })
  user: User;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class Otp {
  @Field()
  email?: string;

  @Field()
  otp?: string;


  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
@ObjectType()
export class resetPasswordRequestResponse {
  @Field(() => Otp, { nullable: true })
  Otp: Otp;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}
@ObjectType()
export class ImagesResponse {
  @Field(() => String, { nullable: true })
  imageurl: String;
  @Field(() => User, { nullable: true })
  user: User;
}


@ObjectType()
export class VerifyOTPResponse {
  @Field(() => Boolean, { nullable: true })
  status: boolean;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}
@ObjectType()
export class resetPasswordResponse {
  @Field(() => String, { nullable: true })
  message : string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}
