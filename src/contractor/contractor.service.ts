import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SearchContractorsDto } from './contractor.dto';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class ContractorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}
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
    await this.notificationService.sendNotification();
    console.log(contractor, ' updated data');
    return {
      contractor,
      error: null,
    };
  }

  async getContractors(contractorsDto, userId) {
    let contractors;
    console.log("finding contractors" , contractorsDto)
    if (contractorsDto.subService) {
      contractors = await this.prisma.user.findMany({
        where: {
          service: contractorsDto.service,
          subService: {
            has: contractorsDto.subService, // Checks if the single string exists in the array
          },
        },
        take: contractorsDto.take,
        skip: contractorsDto.skip,
      });
    } else {
      contractors = await this.prisma.user.findMany({
        where: {
          service: contractorsDto.service,
        },
        take: contractorsDto.take,
        skip: contractorsDto.skip,
      });
    }
    // console.log(contractors, 'contractors');
    const myBookmarks = await this.prisma.bookmark.findMany({
      where: {
        userId: userId,
      },
    });

    const fliteredContractors = contractors.map((contractor) => {
      const isBookmark = myBookmarks.some(
        (bookmark) => bookmark.contractorId == contractor.id,
      );
      console.log(isBookmark, '>>>>>>>>>>>>> bookedmarks');
      return {
        ...contractor,
        isBookmark: isBookmark,
      };
    });
    // console.log(fliteredContractors, 'fliteredContractors');

    return fliteredContractors;
  }

  async searchContractors(contractorsDto: SearchContractorsDto) {
    const contractors = await this.prisma.user.findMany({
      where: {
        OR: [
          {
            service: {
              contains: contractorsDto.search,
              mode: 'insensitive',
            },
          },
          {
            fullname: {
              contains: contractorsDto.search,
              mode: 'insensitive',
            },
          },
        ],
      },
      take: contractorsDto.take,
      skip: contractorsDto.skip,
    });
    console.log(contractors, ' Search contractors');

    return contractors;
  }
  async contractorsDetails(contractorDetailsDto) {
    const contractor = await this.prisma.user.findUnique({
      where: {
        id: contractorDetailsDto.id,
      },
    });
    console.log(contractor, 'contractors');

    return {
      contractor,
      error: null,
    };
  }
}
