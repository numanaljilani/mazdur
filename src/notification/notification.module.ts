import { Module } from '@nestjs/common';
import { NotificationResolver } from './notification.resolver';
import { NotificationService } from './notification.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [NotificationResolver, NotificationService,PrismaService],
  exports :[NotificationService]
})
export class NotificationModule {}
