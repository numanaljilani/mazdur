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
import { LoginDto, RegisterContractorDto, RegisterDto } from './dto';
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
    const payload = { username: user.fullname, sub: user.id };

    const accessToken = this.jwtService.sign(
      { ...payload },
      {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        // expiresIn: '150sec',
        expiresIn: '7d',
      },
    );

    const refreshToken = this.jwtService.sign(payload, {
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
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });
    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
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
    const payload =   this.jwtService.verify(registerContractorDto.token,{
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      })
      const data = {
        service: registerContractorDto.service,
        subService: registerContractorDto.subServices,
        price: registerContractorDto.price,
        unit: registerContractorDto.unit,
        isContractor : true
      };
      if (registerContractorDto.about) {
        data['about'] = registerContractorDto.about;
      }

            if (image) {
        const { originalname, buffer } = image;
        const s3res = await this.s3Service.uploadProfile(originalname, buffer);
        if (s3res) {
          data['image'] = await s3res?.Key;
        }
        console.log(s3res.Key, '>>>>>>');
      }

      console.log(registerContractorDto.price)
      const updateProfile = await this.prisma.user.update({
        where : { 
          id : payload.sub
        },
        data : {
          isContractor :true,
          price : registerContractorDto.price,
          service : registerContractorDto.service,
          subService : [`${registerContractorDto.subServices}`],
          about : registerContractorDto.about,
          unit : registerContractorDto.unit,

        }
      })

      console.log(data);
      // if (image) {
      //   const { originalname, buffer } = image;
      //   const s3res = await this.s3Service.uploadProfile(originalname, buffer);
      //   if (s3res) {
      //     data['image'] = await s3res?.Key;
      //   }
      //   console.log(s3res.Key, '>>>>>>');
      // }

      // if (registerContractorDto.nikname) {
      //   data['nikname'] = registerContractorDto.nikname;
      // }

      // if (registerContractorDto.address) {
      //   data['address'] = registerContractorDto.address;
      // }

      // if (registerContractorDto.dob) {
      //   data['dob'] = registerContractorDto.dob;
      // }

      // if (registerContractorDto.phone) {
      //   data['phone'] = registerContractorDto.phone;
      // }

      console.log(data, 'data');

      const user = await this.prisma.user.findUnique({
      where : { 
        id : payload.sub
      }
      });
      await this.notificationService.createNotification(
        {
          title: 'congrats !!! your have registerd as a service provider .',
          desc: `congratulations ${user.fullname} !!! you have register as a service provider successfully`,
          broadcast: false,
          type: 'user',
        },
        user.id,
      );
      // console.log(user, 'user created successfull');

      return user// Issue tokens on registration
    } catch (error) {
      if (error instanceof EmailConflictException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }

      throw new Error(error.message); // Provide a proper error response
    }
  }
  async register(registerDto: RegisterDto, image?: any): Promise<any> {
    console.log('registerDto!!!', registerDto);
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: registerDto.email },
      });
      console.log(image);

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
        if (s3res) {
          data['image'] = await s3res?.Key;
        }
        console.log(s3res.Key, '>>>>>>');
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
    const user = await this.validateUser(loginDto);
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
}
