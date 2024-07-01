import { Module } from '@nestjs/common';
import { NotificationResolver } from './notification.resolver';
import { NotificationService } from './notification.service';
import { PrismaService } from 'src/prisma.service';
import { FirebaseService } from './firebase.service';

@Module({
  providers: [NotificationResolver, NotificationService,PrismaService, FirebaseService],
  exports :[NotificationService,FirebaseService]
})
export class NotificationModule {}
