import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from './user.service';
import { LoginResponse, RegisterResponse } from 'src/auth/types';
import { LoginDto } from 'src/auth/dto';
import { User } from './user.model';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from 'src/auth/auth.guard';


@Resolver('User')
export class UserResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // @UseFilters(GraphQLErrorFilter)
  // @Mutation(() => RegisterResponse)
  // async register(
  //   @Args('registerInput') registerDto: RegisterDto,
  //   @Args('image' , { name: 'image', type: () => GraphQLUpload , nullable : true }) image: any ,
  //   @Context() context: { res: Response },
  // ): Promise<RegisterResponse> {
  //   console.log( image ,'userRefistration !!!' );
  //   if (!registerDto.password) {
  //     throw new BadRequestException({
  //       password: 'Password is required.',
  //     });
  //   }
  //   try {
  //     const { user } = await this.authService.register(
  //       registerDto,
  //       context.res,
  //     );
  //     console.log('user!', user);
  //     return  {user} ;
  //   } catch (error) {
  //     // Handle the error, for instance if it's a validation error or some other type
  //     return {
  //       error: {
  //         message: error.message,
  //         // code: 'SOME_ERROR_CODE' // If you have error codes
  //       },
  //     };
  //   }
  // }

  @Mutation(() => LoginResponse) // Adjust this return type as needed
  async login(
    @Args('loginInput') loginDto: LoginDto,
    @Context() context: { res: Response },
  ) {
    return this.authService.login(loginDto, context.res);
  }

  @Mutation(() => LoginResponse) // Adjust this return type as needed
  @UseGuards(GraphqlAuthGuard)
  async me(
    @Context() context: { req: Response | any },
    
  ) {
    const userId = context.req?.user?.sub;
    return this.authService.me(userId);
  }



  @Query((returns) => User)
  hello() {
    return;
  }
}