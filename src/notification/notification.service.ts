import { Body, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FirebaseService } from './firebase.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async myNotifications(myNotifications, userId) {
    try {
      return await this.prisma.notification.findMany({
        where: {
          OR: [
            {
              // userId
              userId: userId,
            },
            {
              broadcast: true,
            },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {}
  }

  async createNotification(notifications, userId , fcmtoken) {
    const notification = await this.prisma.notification.create({
      data: {
        title: notifications.title,
        desc: notifications.desc,
        userId,
        broadcast: false,
        type: notifications.type ? notifications.type : 'general',
      },
    });

    await this.firebaseService.sendNotification(
      'djq2_U79Qj-9ahXVK_lAot:APA91bFag-XhMFkz3IMWvmyUz4eKR6OLI-kItJqMRc2rwZpEg8tmQcUON-qoKHqus4PvNEtcIuIUxWRjYd9H8UehkQAqwY6VE75b_bHvsEG2XlxjEIBeLH-YqL_dZablr7vIBIA3849k',
      {
        title: notifications.title,
        body: notifications.desc,
      },
    );
  }
  async sendNotification() {
    console.log('inside send notification');
    await this.firebaseService.sendNotification(
      'djq2_U79Qj-9ahXVK_lAot:APA91bFag-XhMFkz3IMWvmyUz4eKR6OLI-kItJqMRc2rwZpEg8tmQcUON-qoKHqus4PvNEtcIuIUxWRjYd9H8UehkQAqwY6VE75b_bHvsEG2XlxjEIBeLH-YqL_dZablr7vIBIA3849k',
      {
        title: 'Your account is created .',
        body: 'Congratulation your account is created successfull.',
      },
    );
  }
}
