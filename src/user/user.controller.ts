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
import { RegisterContractorDto, RegisterDto } from 'src/auth/dto';
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
  @Post()
  async registerUser(
    @UploadedFile() file: multer.File,
    @Body() registerDto: RegisterDto,
  ) {
   const result = await this.authService.register(registerDto , file);

   return { user : result}
  }
  @UseInterceptors(FileInterceptor('file'))
  @Post('register-contractor')
  async registerContractor(
    @UploadedFile() file: multer.File,
    @Body() registerContractorDto: RegisterContractorDto,
  ) {
    console.log("Inside registerContractorDto ")
   const result = await this.authService.registerContractor(registerContractorDto , file);

   return { user : result}
  }
}
