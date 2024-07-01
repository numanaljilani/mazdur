import { Module } from '@nestjs/common';
import { ContractorResolver } from './contractor.resolver';
import { ContractorService } from './contractor.service';
import { PrismaService } from 'src/prisma.service';
import { NotificationService } from 'src/notification/notification.service';
import { FirebaseService } from 'src/notification/firebase.service';

@Module({
  providers: [ContractorResolver, ContractorService,PrismaService,NotificationService,FirebaseService]
})
export class ContractorModule {}
