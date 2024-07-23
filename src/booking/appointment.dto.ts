import { Optional } from '@nestjs/common';
import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, isNotEmpty } from 'class-validator';


@InputType()
export class AppointmentDto {
  @Field()
  @IsNotEmpty({ message: 'Date is required' })
  date: string;

  @Field()
  @IsNotEmpty({ message: 'Time is required' })
  time: string;


  @Field()
  @IsNotEmpty({ message: 'Please select the contractor or try again.' })
  contractorId: string;

}
@InputType()
export class CancelAppointmentDto {
  @Field()
  @IsNotEmpty({ message: 'appointment id is required' })
  id: string;

}
@InputType()
export class MyAppointmentDto {

  @Field({defaultValue : 'pending'})
  @IsNotEmpty({ message: 'Service name is required' })
  status: string;
  
  @Field()
  @IsNotEmpty({ message: 'How many number of user reuired' })
  take: number;

  @Field()
  @IsNotEmpty({ message: 'skip the user required' })
  skip: number;

}
@InputType()
export class MyAppointmentByDateDto {

  @Field({defaultValue : Date.now()})
  @IsNotEmpty({ message: 'Date  is required' })
  date: Date;
  
  @Field()
  @IsNotEmpty({ message: 'How many number of user reuired' })
  take: number;

  @Field()
  @IsNotEmpty({ message: 'skip the user required' })
  skip: number;

}

