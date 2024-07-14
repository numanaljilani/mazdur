import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../user/user.model';
import { ErrorType } from 'src/auth/types';
import { ConntractorsResponse } from 'src/contractor/contractor.type';



@ObjectType()
export class AppointmentsResponse {
    @Field(() => String)
    id: string;
  
    @Field(() => String,{nullable : true})
    date : string;
  
    @Field(() => String,{nullable : true})
    time: string;
  
    @Field(() => String,{nullable : true})
    status: String;

  
    @Field(() => String,{nullable : true})
    userId: string;

    @Field(() => String,{nullable : true})
    contractorId: String;

    @Field(() => ConntractorsResponse,{nullable : true})
    contractor: ConntractorsResponse;

}
@ObjectType()
export class ContractorAppointmentsResponse {
    @Field(() => String)
    id: string;
  
    @Field(() => String,{nullable : true})
    date : string;
  
    @Field(() => String,{nullable : true})
    time: string;
  
    @Field(() => String,{nullable : true})
    status: String;

  
    @Field(() => String,{nullable : true})
    userId: string;
    @Field(() => User,{nullable : true})
    user: User;

    @Field(() => ConntractorsResponse,{nullable : true})
    contractor: ConntractorsResponse;

}

@ObjectType()
export class AppointmentResponse {
  @Field(() => AppointmentsResponse, { nullable: true }) // Assuming User is another ObjectType you have
  appointment?: AppointmentsResponse;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}


