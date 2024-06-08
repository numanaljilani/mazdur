import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { ContractorDetailsDto, ContractorsDto, RegisterContractorDto } from './contractor.dto';
import { ConntractorsResponse, conntractorResponse } from './contractor.type';
import { ContractorService } from './contractor.service';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from 'src/auth/auth.guard';

@Resolver()
export class ContractorResolver {
    constructor(
        private readonly contractorService: ContractorService,
      ) {}


    @Mutation(() => conntractorResponse) // Adjust this return type as needed
    @UseGuards(GraphqlAuthGuard)
    async createContractor(
      @Args('contractorInput') registerContractorDto: RegisterContractorDto,
      @Context() context: { req: Response | any },
    ) {
      console.log(registerContractorDto)
      const userId = context.req?.user?.sub;
      return this.contractorService.createContractor(registerContractorDto , userId);
    }


    @Mutation(() => [ConntractorsResponse]) // Adjust this return type as needed
    @UseGuards(GraphqlAuthGuard)
    async getContractor(
      @Args('getContractorInput') contractorsDto: ContractorsDto,
    ) {
      return this.contractorService.getContractors(contractorsDto);
    }
    @Mutation(() => conntractorResponse) // Adjust this return type as needed
    @UseGuards(GraphqlAuthGuard)
    async contractorDetails(
      @Args('contractorDetailsInput') contractorDetailsDto: ContractorDetailsDto,
    ) {
      return this.contractorService.contractorsDetails(contractorDetailsDto);
    }

}
