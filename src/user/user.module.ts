import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { UserController } from './user.controller';
import { UploadService } from 'src/upload/upload.service';
import { NotificationService } from 'src/notification/notification.service';
import { FirebaseService } from 'src/notification/firebase.service';

@Module({
  imports : [],
  providers: [UserService, UserResolver,AuthService,PrismaService , ConfigService,UploadService,NotificationService,FirebaseService],
  controllers: [UserController]
})
export class UserModule {}
