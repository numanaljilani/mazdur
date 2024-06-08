import { Injectable } from '@nestjs/common';
import { error } from 'console';
import { NotificationService } from 'src/notification/notification.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}
  // create booking
  async bookAppointment(appointmentDto, userId) {
    console.log(appointmentDto, 'inside service');

    const bookAnAppointment = await this.prisma.booking.create({
      data: {
        userId,
        contractorId: appointmentDto.contractorId,
        date: appointmentDto.date,
        time: appointmentDto.time,
        status: 'pending',
      },
      include: { contractor: true },
    });

    await this.notificationService.createNotification(
      {
        title: 'Thank You !!! your have booked service .',
        desc: `please wait our contractor or service provider will contact you .`,
        broadcast: false,
        type: 'user',
      },
      userId,
    );
    await this.notificationService.createNotification(
      {
        title: 'Hello , You got a new Order',
        desc: `You got a new order please check your orders tab and confirm or contact to the client .`,
        broadcast: false,
        type: 'user',
      },
      appointmentDto.contractorId,
    );
    console.log(bookAnAppointment);
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
          OR:[
            { status: "pending",},
            { status: "upcoming",},
            { status: "approved",},
          ]
 
        },
        take: appointmentDto.take,
        skip: appointmentDto.skip,
        include : {
          contractor : true
        }
      });
console.log(myBooking)
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
    // const cancelAppointment = await this.prisma.booking.findUnique({
    //   where:{
    //      id : appointmentDto.id,

    //   }
    // })
    // console.log(cancelAppointment , ">>>>>")
    const cancelAppointment = await this.prisma.booking.update({
      where: {
        id: appointmentDto.id,
        userId,
      },
      data: {
        status: 'cancel',
      },
    });

    return { appointment: cancelAppointment, error: null };
  }
  // mark rejected by contractor
  async rejectAppointment(appointmentDto, userId) {
    console.log(appointmentDto, 'inside service');
    const rejectedAppointment = await this.prisma.booking.update({
      where: {
        id: appointmentDto.id,
        contractorId: userId,
      },
      data: {
        status: 'reject',
      },
    });

    return { appointment: rejectedAppointment, error: null };
  }
  // mark approved by contractor
  async approveAppointment(appointmentDto, userId) {
    console.log(appointmentDto, 'inside service');
    const approvedAppointment = await this.prisma.booking.update({
      where: {
        id: appointmentDto.id,
        contractorId: userId,
      },
      data: {
        status: 'upcoming',
      },
    });

    return { appointment: approvedAppointment, error: null };
  }
  // mark cmpleted by contractor
  async completeAppointment(appointmentDto, userId) {
    console.log(appointmentDto, 'inside service');
    const comptedAppointment = await this.prisma.booking.update({
      where: {
        id: appointmentDto.id,
        contractorId: userId,
      },
      data: {
        status: 'completed',
      },
    });

    return { appointment: comptedAppointment, error: null };
  }
}

// Date
// time
// userId
// contractorid
// status
