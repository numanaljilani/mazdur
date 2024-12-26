import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from './user.service';
import { PostImageDto, RegisterContractorDto, RegisterDto, UpdateUserDto } from 'src/auth/dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Args, Context } from '@nestjs/graphql';
import * as multer from 'multer';
import { GraphqlAuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post("/")
  async registerUser(
    @UploadedFile() file: multer.File,
    @Body() registerDto: RegisterDto,
  ) {

   const user = await this.authService.register(registerDto , file);
   console.log(user , "return")

   return  user 
  }
  @UseInterceptors(FileInterceptor('file'))
  @Post('register-contractor')
  async registerContractor(
    @UploadedFile() file: multer.File,
    @Body() registerContractorDto: RegisterContractorDto,
  ) {
    console.log("Inside registerContractorDto ")
   const result = await this.authService.registerContractor(registerContractorDto , file);
   console.log(result , "result ><><><><><><><")

   return { user : result}
  }
  @UseInterceptors(FileInterceptor('file'))
  @Post('update')
  async updateprofile(
    @UploadedFile() file: multer.File,
    @Body() updateuserDto: UpdateUserDto,
    @Context() context: { req: Response | any },
  ) {
    console.log("Inside updateuser ")
    const userId = context.req?.user?.sub;
   const result = await this.authService.updateuser(updateuserDto , file, userId!);

   return { user : result}
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('postimage')
  async postimage(
    @Body() postimageDto: PostImageDto,
    @Context() context: { req: Response | any },
    @UploadedFile() file: multer.File,
  ) {
    console.log("Inside postimageDto ")
    const userId = context.req?.user?.sub;
   const result = await this.authService.upostimage( file, postimageDto.userId!);

   return { user : result}
  }

}
