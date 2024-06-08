import { Injectable } from '@nestjs/common';
import { createConntractorResponse } from './types/contractor.types';
import { ContractorDto } from './dto/contractor.model';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // async createContractor(
  //   contractorDto: ContractorDto,
  //   response,
  // ): Promise<createConntractorResponse> {
  //   const contractor = await this.prisma.user.update({
  //     where: { id: '2343434' },
  //     data: contractorDto,
  //   });
  //   return {
  //     contractor: {
  //       id: contractor.id,
  //       availability : contractor.availability,
  //       category : contractor.category,
  //       price : contractor.price,
  //       subCategory : contractor.subCategory,
  //       locality : contractor.locality,
    
  //     } ,
  //     error: {
  //       message: 'Contractor not created',
  //     },
  //   };
  // }
}
