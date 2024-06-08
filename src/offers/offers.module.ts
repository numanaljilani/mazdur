import { Module } from '@nestjs/common';
import { OffersResolver } from './offers.resolver';
import { OffersService } from './offers.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [OffersResolver, OffersService,PrismaService]
})
export class OffersModule {}
