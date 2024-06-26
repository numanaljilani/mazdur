import { Module } from '@nestjs/common';
import { BookingResolver } from './booking.resolver';
import { BookingService } from './booking.service';
import { PrismaService } from 'src/prisma.service';
import { NotificationService } from 'src/notification/notification.service';
import { FirebaseService } from 'src/notification/firebase.service';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [BookingResolver, BookingService,PrismaService,NotificationService,FirebaseService,UserService]
})
export class BookingModule {}
