import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from 'src/auth/auth.guard';
import { MyNotificationResponse } from './notifications.type';
import { MyNotificationsDto } from './notifications.dto';

@Resolver()
export class NotificationResolver {
    constructor(private readonly notificationService: NotificationService) {}

    @Mutation(() => [MyNotificationResponse]) // Adjust this return type as needed
    @UseGuards(GraphqlAuthGuard)
    async myNotifications(
      @Args('notificationInput') myNotificationsDto: MyNotificationsDto,
      @Context() context: { req: Response | any },
    ) {
      console.log(myNotificationsDto);
      const userId = context.req?.user?.sub;
      return this.notificationService.myNotifications(myNotificationsDto, userId);
    }
}
