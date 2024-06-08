import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ContractorService {
  constructor(private readonly prisma: PrismaService) {}
  async createContractor(registerContractorDto, userId) {
    const contractor = await this.prisma.user.update({
      where: { id: userId },
      data: {
        unit: registerContractorDto.unit,
        service: registerContractorDto.service,
        subService: registerContractorDto.subService,
        about: registerContractorDto.about,
        price: registerContractorDto.price,
      },
    });
    console.log(contractor ," updated data")
    return {
      contractor,
      error : null
    };
  }


  async getContractors(contractorsDto){
    const contractors = await this.prisma.user.findMany(
      {
        where : {
          service : contractorsDto.service
        },
        take : contractorsDto.take,
        skip : contractorsDto.skip
      }
    );
    console.log(contractors , "contractors")

    return contractors

  }
  async contractorsDetails(contractorDetailsDto){
    const contractor = await this.prisma.user.findUnique(
      {
        where : {
          id : contractorDetailsDto.id
        },
      }
    );
    console.log(contractor , "contractors")

    return {
      contractor,
      error : null
    };
  }


}
