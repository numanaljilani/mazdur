import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OffersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOffer(createOfferDto, userId) {
    const createOffers = await this.prisma.offers.create({
      data: createOfferDto,
    });

    return {
      offer: createOffers,
      error: null,
    };
  }

  async allOffers() {
    const offers = await this.prisma.offers.findMany({
      take: 20,
      skip: 0,
    });
    return offers;
  }
}

// Percent
// title
// description
// Promo
// expiry
