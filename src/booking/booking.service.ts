import { Injectable } from '@nestjs/common';
import { error } from 'console';
import { NotificationService } from 'src/notification/notification.service';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class BookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}
  // create booking
  async bookAppointment(appointmentDto, userId) {
    console.log(appointmentDto, 'inside service');
    const [bookAnAppointment, contractor, user] = await Promise.all([
      this.prisma.booking.create({
        data: {
          userId,
          contractorId: appointmentDto.contractorId,
          date: appointmentDto.date,
          time: appointmentDto.time,
          status: 'pending',
        },
        include: { contractor: true },
      }),
      this.prisma.user.findUnique({
        where: { id: appointmentDto.contractorId },
      }),
      this.prisma.user.findUnique({
        where: { id: userId },
      }),
    ]);
    const [notification1, notification2] = await Promise.all([
      this.notificationService.createNotification(
        {
          title: 'Thank You !!! your have booked service.',
          desc: 'Please wait, our contractor or service provider will contact you.',
          broadcast: false,
          type: 'user',
        },
        userId,
        user.fcmtoken,
      ),
      this.notificationService.createNotification(
        {
          title: 'Hello, You got a new Order',
          desc: 'You got a new order. Please check your orders tab and confirm or contact the client.',
          broadcast: false,
          type: 'user',
        },
        appointmentDto.contractorId,
        contractor.fcmtoken,
      ),
    ]);
    return { appointment: bookAnAppointment, error: null };
  }

  //   get all the appointments from the bookeed by user
  async myAppointment(appointmentDto, userId) {
    console.log(appointmentDto.status, 'inside service');
    if (appointmentDto.status) {
      const myBooking = await this.prisma.booking.findMany({
        where: {
          userId,
          OR: [{ status: appointmentDto.status }, { status: 'approved' }],
        },
        take: appointmentDto.take,
        skip: appointmentDto.skip,
        include: {
          contractor: true,
        },
      });

      console.log(myBooking);

      return myBooking;
    } else {
      const myBooking = await this.prisma.booking.findMany({
        where: {
          userId,
        },
        take: appointmentDto.take,
        skip: appointmentDto.skip,
        include: {
          contractor: true,
        },
      });

      console.log(myBooking);

      return myBooking;
    }
  }
  async myAppointmentByDate(appointmentByDateDto, userId) {
    console.log(appointmentByDateDto.date, 'inside service');

    const startDate = new Date(appointmentByDateDto.date);
    startDate.setHours(0, 0, 0, 0);

    // Set the end of the day
    const endDate = new Date(appointmentByDateDto.date);
    endDate.setHours(23, 59, 59, 999);

    const myBooking = await this.prisma.booking.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      take: appointmentByDateDto.take,
      skip: appointmentByDateDto.skip,
      include: {
        contractor: true,
      },
    });

    console.log(myBooking);

    return myBooking;
  }

  async contractorAppointment(appointmentDto, userId) {
    console.log(appointmentDto, 'inside service');
    if (appointmentDto.status) {
      const myBooking = await this.prisma.booking.findMany({
        where: {
          contractorId: userId,
          OR: [
            { status: 'pending' },
            { status: 'upcoming' },
            { status: 'approved' },
          ],
        },
        take: appointmentDto.take,
        skip: appointmentDto.skip,
        include: {
          contractor: true,
        },
      });
      console.log(myBooking);
      return myBooking;
    } else {
      const myBooking = await this.prisma.booking.findMany({
        where: {
          contractorId: userId,
        },
        take: appointmentDto.take,
        skip: appointmentDto.skip,
      });

      console.log(myBooking);

      return myBooking;
    }
  }

  // mark cancel by contractor
  async cancelAppointment(appointmentDto, userId) {
    console.log(appointmentDto, 'inside service', userId);
    const [cancelAppointment, user] = await Promise.all([
      this.prisma.booking.update({
        where: {
          id: appointmentDto.id,
          userId,
        },
        data: {
          status: 'cancel',
        },
      }),
      this.userService.getFcmToken(userId),
    ]);
    await this.notificationService.createNotification(
      {
        title: 'Sorry, Your Order is cancelled!',
        desc: `Your order is cancelled by the ${user.fullname}.`,
        broadcast: false,
        type: 'user',
      },
      userId,
      user?.fcmtoken,
    );
    return { appointment: cancelAppointment, error: null };
  }
  // mark rejected by contractor
  async rejectAppointment(appointmentDto, userId) {
    console.log(appointmentDto, 'inside service');
    const booking = await this.prisma.booking.findUnique({where : {id: appointmentDto.id }})
    const [rejectedAppointment, contractor ,user] = await Promise.all([
     this.prisma.booking.update({
        where: {
          id: appointmentDto.id,
          contractorId: userId,
        },
        data: {
          status: 'reject',
        },
      }),
      this.userService.getFcmToken(booking.contractorId),
      this.userService.getFcmToken(booking.userId),
    ]);
   await Promise.all([
      this.notificationService.createNotification(
        {
          title: 'Sorry, Your Order is cancelled!',
          desc: `Your order is cancelled by the ${contractor.fullname}.`,
          broadcast: false,
          type: 'user',
        },
        userId,
        user?.fcmtoken,
      ),
      this.notificationService.createNotification(
        {
          title: ' Your Order is cancelled the booking!',
          desc: `Your have cancelled service booking of ${user.fullname}.`,
          broadcast: false,
          type: 'user',
        },
        userId,
        user?.fcmtoken,
      ),

    ]);

    return { appointment: rejectedAppointment, error: null };
  }
  // mark approved by contractor
  async approveAppointment(appointmentDto, userId) {
    console.log(appointmentDto, 'inside service');
    const booking = await this.prisma.booking.findUnique({where : {id: appointmentDto.id }})
   

    const [approvedAppointment, contractor ,user] = await Promise.all([
      this.prisma.booking.update({
        where: {
          id: appointmentDto.id,
          contractorId: userId,
        },
        data: {
          status: 'upcoming',
        },
      }),
       this.userService.getFcmToken(booking.contractorId),
       this.userService.getFcmToken(booking.userId),
     ]);

    await Promise.all([
      this.notificationService.createNotification(
        {
          title: 'Congratulations, Your service booking is Approved!',
          desc: `Your service booking is Approved by the ${contractor.fullname}.`,
          broadcast: false,
          type: 'user',
        },
        userId,
        user?.fcmtoken,
      ),
      this.notificationService.createNotification(
        {
          title: ' Your have approved the booking!',
          desc: `Your have approved service booking of ${user.fullname}.`,
          broadcast: false,
          type: 'user',
        },
        userId,
        user?.fcmtoken,
      ),
    ]);


    return { appointment: approvedAppointment, error: null };
  }
  // mark cmpleted by contractor
  async completeAppointment(appointmentDto, userId) {
    console.log(appointmentDto, 'inside service');

    const booking = await this.prisma.booking.findUnique({where : {id: appointmentDto.id }})
   

    const [comptedAppointment, contractor ,user] = await Promise.all([
      this.prisma.booking.update({
        where: {
          id: appointmentDto.id,
          contractorId: userId,
        },
        data: {
          status: 'completed',
        },
      }),
       this.userService.getFcmToken(booking.contractorId),
       this.userService.getFcmToken(booking.userId),
     ]);

    await Promise.all([
      this.notificationService.createNotification(
        {
          title: 'Congratulations, Your work is completed!',
          desc: `thanks for working with mazdur and ${contractor.fullname}.`,
          broadcast: false,
          type: 'user',
        },
        userId,
        user?.fcmtoken,
      ),
      this.notificationService.createNotification(
        {
          title: ' Your have completed the task!',
          desc: `Thank you for working with Mazdur ,Your have completed the task of ${user.fullname}.`,
          broadcast: false,
          type: 'user',
        },
        userId,
        user?.fcmtoken,
      ),
    ]);

    return { appointment: comptedAppointment, error: null };
  }
}

// Date
// time
// userId
// contractorid
// status
