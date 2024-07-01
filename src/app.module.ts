import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { UserResolver } from './user/user.resolver';
import { UserModule } from './user/user.module';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { PrismaService } from './prisma.service';
import { UploadModule } from './upload/upload.module';
import { ContractorModule } from './contractor/contractor.module';
import * as cors from 'cors';
import { UploadService } from './upload/upload.service';
import { BookmarkModule } from './bookmark/bookmark.module';
import { BookingModule } from './booking/booking.module';
import { OffersModule } from './offers/offers.module';
import { NotificationModule } from './notification/notification.module';
import { NotificationService } from './notification/notification.service';
import { FirebaseService } from './notification/firebase.service';
import { PostModule } from './post/post.module';

@Module({
  imports: [AuthModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    ConfigModule.forRoot({
      isGlobal : true
    }),
    UserModule,  
    UploadModule,
    ContractorModule,
    BookmarkModule,
    BookingModule,
    OffersModule,
    NotificationModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserResolver,AuthService,UserService,PrismaService,UploadService,NotificationService,FirebaseService],
})
export class AppModule implements NestModule
{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors()).forRoutes('*');
  }

}
