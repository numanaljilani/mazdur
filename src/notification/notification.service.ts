import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async myNotifications(myNotifications, userId) {
    try {
      return await this.prisma.notification.findMany({
        where: {
          id: userId,
        },
      });
    } catch (error) {}
  }

  async createNotification(notifications, userId) {
    const notification = await this.prisma.notification.create({
      data: {
        title : notifications.title,
        desc :notifications.desc,
        userId,
        broadcast: false,
        type : notifications.type ? notifications.type : "general",
      },
    });
  }
}
