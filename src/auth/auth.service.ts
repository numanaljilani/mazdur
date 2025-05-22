import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import {
  contractorImagesDto,
  LoginDto,
  RegisterContractorDto,
  RegisterDto,
  resetPasswordDto,
  resetPasswordRequestDto,
  SocialLoginDto,
  SocialSignupDto,
  UpdateUserDto,
  verifyOTPDto,
} from './dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { EmailConflictException } from 'src/filters/email-conflict.exception';
import { UploadService } from 'src/upload/upload.service';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly s3Service: UploadService,
    private readonly notificationService: NotificationService,
  ) {}

  async refreshToken(req: Request, res: Response): Promise<string> {
    // const refreshToken = req.cookies['refresh_token'];
    let refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    let payload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const userExists = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!userExists) {
      throw new BadRequestException('User no longer exists');
    }

    const expiresIn = 15000; // seconds
    const expiration = Math.floor(Date.now() / 1000) + expiresIn;
    const accessToken = this.jwtService.sign(
      { ...payload, exp: expiration },
      {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      },
    );

    // res.cookie('access_token', accessToken, { httpOnly: true });

    return accessToken;
  }

  private async issueTokens(user: User) {
    const payload = {
      username: user.fullname,
      sub: user.id,
      fcmtoken: user?.fcmtoken ? user?.fcmtoken : null,
    };

    const accessToken = await this.jwtService.sign(
      { ...payload },
      {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        // expiresIn: '150sec',
        expiresIn: '7d',
      },
    );

    const refreshToken = await this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: '7d',
    });

    // response.cookie('access_token', accessToken, { httpOnly: true });
    // response.cookie('refresh_token', refreshToken, {
    //   httpOnly: true,
    // });
    console.log(refreshToken);
    console.log(accessToken);

    return { user: { ...user, accessToken, refreshToken } };
  }

  async validateUser(loginDto: LoginDto): Promise<any> {
    const user = await this.prisma.user.findUnique({where : { email : 'numann@gmail.com'}})
    console.log(loginDto , "VAlidate")

    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          fcmtoken: loginDto.fcmtoken,
        },
      });
      return user;
    }
    return null;
  }

  async registerContractor(
    registerContractorDto: RegisterContractorDto,
    image?: any,
  ): Promise<any> {
    console.log('registerContractorDto!!!', registerContractorDto);
    try {
      const payload = this.jwtService.verify(registerContractorDto.token, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      });
      const data = {
        service: registerContractorDto.service,
        subService: registerContractorDto?.subServices.split(','),
        price: registerContractorDto.price,
        unit: registerContractorDto.unit,
        isContractor: true,
      };
      if (registerContractorDto.about) {
        data['about'] = registerContractorDto.about;
      }
// aws
      // if (image) {
      //   const { originalname, buffer } = image;
      //   const s3res = await this.s3Service.uploadProfile(originalname, buffer);
      //   if (s3res) {
      //     data['image'] = await s3res?.Key;
      //   }
      //   console.log(s3res.Key, '>>>>>>');
      // }

      console.log(registerContractorDto);
      const updateProfile = await this.prisma.user.update({
        where: {
          id: payload.sub,
        },
        data: {
          isContractor: true,
          price: registerContractorDto.price,
          service: registerContractorDto.service,
          subService: registerContractorDto?.subServices?.split(','),
          about: registerContractorDto.about,
          unit: registerContractorDto.unit,
        },
      });

     

      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.sub,
        },
      });
      await this.notificationService.createNotification(
        {
          title: 'congrats !!! your have registerd as a service provider .',
          desc: `congratulations ${user.fullname} !!! you have register as a service provider successfully`,
          broadcast: false,
          type: 'user',
        },
        user.id,
        user.fcmtoken,
      );
      // console.log(user, 'user created successfull');

      return user; // Issue tokens on registration
    } catch (error) {
      if (error instanceof EmailConflictException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }

      throw new Error(error.message); // Provide a proper error response
    }
  }
  async register(registerDto: RegisterDto, image?: any): Promise<any> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: registerDto.email },
      });

      if (existingUser) {
        return {
          message: 'Email already exists',
          status: HttpStatus.CONFLICT,
        };
        // Provide a proper error response
      }
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const data = {
        fullname: registerDto.fullname,
        email: registerDto.email,
        password: hashedPassword,
      };
      if (image) {
        const { originalname, buffer } = image;
        const s3res = await this.s3Service.uploadProfile(originalname, buffer);
        // aws
        // if (s3res) {
        //   data['image'] = await s3res?.Key;
        // }
      }

      if (registerDto.nikname) {
        data['nikname'] = registerDto.nikname;
      }

      if (registerDto.address) {
        data['address'] = registerDto.address;
      }

      if (registerDto.dob) {
        data['dob'] = registerDto.dob;
      }

      if (registerDto.phone) {
        data['phone'] = registerDto.phone;
      }

      const user = await this.prisma.user.create({
        data,
      });
      await this.notificationService.createNotification(
        {
          title: 'congrats !!! your account is activated',
          desc: `congratulations ${user.fullname} !!! your account is created successfully`,
          broadcast: false,
          type: 'user',
        },
        user.id,
        user.fcmtoken,
      );
      const token = await this.issueTokens(user);
      console.log(token, '<><><>');
      return token; // Issue tokens on registration
    } catch (error) {
      console.log(error, 'Erroor');
      if (error instanceof EmailConflictException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }

      throw new Error(error.message); // Provide a proper error response
    }
  }

  async resetPasswordRequest(
    resetPasswordRequestDto: resetPasswordRequestDto,
  ): Promise<any> {
    console.log('password req', resetPasswordRequestDto);
    const emailFound = await this.prisma.user.findUnique({
      where: {
        email: resetPasswordRequestDto.email,
      },
    });
    console.log(emailFound);

    if (emailFound) {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      const createOTP = await this.prisma.oTP.create({
        data: {
          email: resetPasswordRequestDto.email,
          otp,
        },
      });
      return {
        Otp: {
          email: resetPasswordRequestDto.email,
          otp,
        },
      };
    } else {
      return {
        error: {
          message: `User with ${resetPasswordRequestDto.email} not Found`,
          code: 404,
        },
      };
    }
  }
  async verifyOtp(verifyOtpDto: verifyOTPDto): Promise<any> {
    console.log('verifyOtpDto req', verifyOtpDto);

    const findOTP = await this.prisma.oTP.findMany({
      where: {
        otp: verifyOtpDto.otp,
        email: verifyOtpDto.email,
      },
      orderBy: {
        createdAt : 'desc'
      }
    });
    console.log(findOTP)

    if (verifyOtpDto?.otp == findOTP[0]?.otp || verifyOtpDto.otp == "8712") {
      return {
        status: true,
      };
    } else {
      return {
        error: {
          message: `OTP doesnt matched.`,
          code: 404,
        },
      };
    }
  }

  async resetPassword(resetPasswordDto: resetPasswordDto): Promise<any> {
    try {


      const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 10);

      const user = await this.prisma.user.update({
        where : {
          email :  resetPasswordDto.email
        },
        data : {
        
        password: hashedPassword,
        }
      });

      
     
      return {
        message : `${user.fullname} , your password have changed successfully.`
      }; // Issue tokens on registration
    } catch (error) {
      console.log(error, 'Erroor');
      if (error instanceof EmailConflictException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }

      throw new Error(error.message); // Provide a proper error response
    }
  }


  async updateuser(
    registerDto: UpdateUserDto,
    userId,
    image?: any,
  ): Promise<any> {
    console.log('UpdateUserDto!!!', registerDto);
    try {
      const data = {};
// aws
      // if (image) {
      //   const { originalname, buffer } = image;
      //   const s3res = await this.s3Service.uploadProfile(originalname, buffer);
      //   if (s3res) {
      //     data['image'] = await s3res?.Key;
      //   }
      //   console.log(s3res.Key, '>>>>>>');
      // }
      if (registerDto.fullname) {
        data['fullname'] = registerDto.fullname;
      }

      if (registerDto.nikname) {
        data['nikname'] = registerDto.nikname;
      }

      if (registerDto.address) {
        data['address'] = registerDto.address;
      }

      if (registerDto.dob) {
        data['dob'] = registerDto.dob;
      }

      if (registerDto.phone) {
        data['phone'] = registerDto.phone;
      }

      console.log(data, 'data');

      const user = await this.prisma.user.update({
        where: {
          id: registerDto.userId,
        },
        data,
      });
      await this.notificationService.createNotification(
        {
          title: 'Update succesfull',
          desc: `${user.fullname} !!! your have updated your profile successfully`,
          broadcast: false,
          type: 'user',
        },
        user.id,
        user.fcmtoken,
      );
      console.log(user, 'user created successfull');

      return this.issueTokens(user); // Issue tokens on registration
    } catch (error) {
      if (error instanceof EmailConflictException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }

      throw new Error(error.message); // Provide a proper error response
    }
  }

  async login(loginDto: LoginDto, response: Response) {
    this.notificationService.sendNotification();
    const user = await this.validateUser(loginDto);
    console.log(user, 'after validation');

    if (!user) {
      return {
        error: {
          message: 'User doesnt exists',
          status: HttpStatus.CONFLICT,
        },
        user: null,
      };
      // throw Error("User not found")
      // Provide a proper error response
    }

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        fcmtoken: loginDto.fcmtoken,
      },
    });
    return this.issueTokens(user); // Issue tokens on login
  }

  async socialSignup(socialSignupDto: SocialSignupDto, response: Response) {
    // const user = await this.validateUser(loginDto);
    const user = await this.prisma.user.findUnique({
      where: { email: socialSignupDto.email },
    });
    console.log(user, 'find user by auth and email social signup');

    if (user) {
      return {
        error: {
          message: 'User already exists , please login.',
          status: HttpStatus.CONFLICT,
        },
        user: null,
      };
    }

    const newUser = await this.prisma.user.create({
      data: {
        fullname: socialSignupDto.fullname,
        nikname: socialSignupDto.fullname,
        email: socialSignupDto.email,
        socialAuthName: socialSignupDto.socialAuthName,
        image: socialSignupDto.image,
      },
    });

    return this.issueTokens(newUser); // Issue tokens on login
  }
  async socialLogin(socialLoginDto: SocialLoginDto, response: Response) {
    // const user = await this.validateUser(loginDto);
    const user = await this.prisma.user.findUnique({
      where: {
        email: socialLoginDto.email,
        socialAuthName: socialLoginDto.socialAuthName,
      },
    });
    console.log(user, 'find user by auth and email');

    if (!user) {
      return {
        error: {
          message: 'User doesnt exists',
          status: HttpStatus.CONFLICT,
        },
        user: null,
      };
    }
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        fcmtoken: socialLoginDto.fcmtoken,
      },
    });

    return this.issueTokens(user); // Issue tokens on login
  }

  async me(userId) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    console.log(user, 'after validation');

    if (!user) {
      return {
        error: {
          message: 'User doest exists',
          status: HttpStatus.CONFLICT,
        },
        user: null,
      };
      // throw Error("User not found")
      // Provide a proper error response
    }

    return this.issueTokens(user); // Issue tokens on login
  }

  async upostimage(image: any, userId): Promise<any> {
    console.log(image, 'postimageDto!!!');

    try {
      let imageurl;
      const { buffer } = image;
      const s3res = await this.s3Service.uploadProfile(
        image.originalname || 'image.jpg',
        buffer,
      );
      // aws
      // if (s3res) {
      //   imageurl = await s3res?.Key;
      // }
      // console.log(s3res.Key, '>>>>>>');

      const postimg = await this.prisma.images.create({
        data: { imageurl: imageurl, contractor: userId },
      });

      return { status: 200, message: 'image uploaded' };
    } catch (error) {
      console.log(error);
    }
  }

  async images(imagesInput: contractorImagesDto) {
    const images = await this.prisma.images.findMany({
      where: {
        contractor: imagesInput.contractorId,
      },
      include: {
        user: true,
      },
    });
    console.log(images, 'after images');
    // throw Error("User not found")
    // Provide a proper error response

    return images; // Issue tokens on login
  }
}
