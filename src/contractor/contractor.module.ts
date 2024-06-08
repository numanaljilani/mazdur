import { Module } from '@nestjs/common';
import { ContractorResolver } from './contractor.resolver';
import { ContractorService } from './contractor.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [ContractorResolver, ContractorService,PrismaService]
})
export class ContractorModule {}
