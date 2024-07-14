import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { BookingService } from './booking.service';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from 'src/auth/auth.guard';
import { AppointmentDto, CancelAppointmentDto, MyAppointmentByDateDto, MyAppointmentDto } from './appointment.dto';
import {  AppointmentResponse, AppointmentsResponse, ContractorAppointmentsResponse } from './appointment.type';

@Resolver()
export class BookingResolver {
    constructor(
        private readonly bookingService: BookingService,
      ) {}

      @Mutation(() => AppointmentResponse) 
      @UseGuards(GraphqlAuthGuard)
      async bookAppointment(
        @Args('appointmentInput') appointmentDto: AppointmentDto,
        @Context() context: { req: Response | any },
      ) {
        console.log(appointmentDto)
        const userId = context.req?.user?.sub;
        return this.bookingService.bookAppointment(appointmentDto , userId);
      }

      @Mutation(() => [AppointmentsResponse]) 
      @UseGuards(GraphqlAuthGuard)
      async myAppointment(
        @Args('myAppointmentInput') appointmentDto: MyAppointmentDto,
        @Context() context: { req: Response | any },
      ) {
        console.log(appointmentDto)
        const userId = context.req?.user?.sub;
        return this.bookingService.myAppointment(appointmentDto , userId);
      }

      @Mutation(() => [AppointmentsResponse]) 
      @UseGuards(GraphqlAuthGuard)
      async myAppointmentByDate(
        @Args('myAppointmentByDateInput') appointmentByDateDto: MyAppointmentByDateDto,
        @Context() context: { req: Response | any },
      ) {
        console.log(appointmentByDateDto)
        const userId = context.req?.user?.sub;
        return this.bookingService.myAppointmentByDate(appointmentByDateDto , userId);
      }
      @Mutation(() => [ContractorAppointmentsResponse]) 
      @UseGuards(GraphqlAuthGuard)
      async contractorAppointment(
        @Args('contractorAppointmentInput') appointmentDto: MyAppointmentDto,
        @Context() context: { req: Response | any },
      ) {
        console.log(appointmentDto)
        const userId = context.req?.user?.sub;
        return this.bookingService.contractorAppointment(appointmentDto , userId);
      }

      @Mutation(() => AppointmentResponse) 
      @UseGuards(GraphqlAuthGuard)
      async cancelAppointment(
        @Args('cancelAppointmentInput') cancelappointmentDto: CancelAppointmentDto,
        @Context() context: { req: Response | any },
      ) {
        console.log(cancelappointmentDto)
        const userId = context.req?.user?.sub;
        return this.bookingService.cancelAppointment(cancelappointmentDto , userId);
      }
      @Mutation(() => AppointmentResponse) 
      @UseGuards(GraphqlAuthGuard)
      async rejectAppointment(
        @Args('rejectAppointmentInput') rejectappointmentDto: CancelAppointmentDto,
        @Context() context: { req: Response | any },
      ) {
        console.log(rejectappointmentDto)
        const userId = context.req?.user?.sub;
        return this.bookingService.rejectAppointment(rejectappointmentDto , userId);
      }
      @Mutation(() => AppointmentResponse) 
      @UseGuards(GraphqlAuthGuard)
      async approvedAppointment(
        @Args('approveAppointmentInput') cancelappointmentDto: CancelAppointmentDto,
        @Context() context: { req: Response | any },
      ) {
        console.log(cancelappointmentDto)
        const userId = context.req?.user?.sub;
        return this.bookingService.approveAppointment(cancelappointmentDto , userId);
      }
      @Mutation(() => AppointmentResponse) 
      @UseGuards(GraphqlAuthGuard)
      async completeAppointment(
        @Args('completeAppointmentInput') cancelappointmentDto: CancelAppointmentDto,
        @Context() context: { req: Response | any },
      ) {
        console.log(cancelappointmentDto)
        const userId = context.req?.user?.sub;
        return this.bookingService.completeAppointment(cancelappointmentDto , userId);
      }
}
