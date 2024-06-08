import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './jwt.strategy/constants';
import { UploadService } from 'src/upload/upload.service';
import { PassportModule } from '@nestjs/passport';
import { NotificationService } from 'src/notification/notification.service';
@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      global: true,
    }),
    PassportModule,
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     secret: configService.get<string>('JWT_SECRET'),
    //     signOptions: { expiresIn: '60m' },
    //   }),
    //   inject: [ConfigService],
    // }),
  ],
  providers: [AuthService,PrismaService,ConfigService,JwtService,UploadService,NotificationService],
  exports: [JwtService, AuthService],
})
export class AuthModule {}
