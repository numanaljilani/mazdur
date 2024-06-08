import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { OffersService } from './offers.service';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from 'src/auth/auth.guard';
import { CreateOfferDto } from './offer.dto';
import { Offers, createOfferResponse } from './offer.type';

@Resolver()
export class OffersResolver {
  constructor(private readonly offerService: OffersService) {}

  @Mutation(() => createOfferResponse) // Adjust this return type as needed
  @UseGuards(GraphqlAuthGuard)
  async createOffer(
    @Args('offerInput') createOfferDto: CreateOfferDto,
    @Context() context: { req: Response | any },
  ) {
    console.log(createOfferDto);
    const userId = context.req?.user?.sub;
    return this.offerService.createOffer(createOfferDto, userId);
  }
  @Mutation(() => [Offers]) // Adjust this return type as needed
  @UseGuards(GraphqlAuthGuard)
  async AllOffers() {
    return this.offerService.allOffers();
  }
}
