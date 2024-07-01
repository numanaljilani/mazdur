import { Module } from '@nestjs/common';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { PrismaService } from 'src/prisma.service';
import { NotificationService } from 'src/notification/notification.service';
import { FirebaseService } from 'src/notification/firebase.service';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [PostResolver, PostService,PrismaService,FirebaseService, NotificationService,UserService]
})
export class PostModule {}
