import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { BookmarkService } from './bookmark.service';
import { UseGuards } from '@nestjs/common';
import { BookmarkDto } from './bookmark.dto';
import { GraphqlAuthGuard } from 'src/auth/auth.guard';
import { AddToBookmarkResponse, BookmarkConntractorsResponse } from './type/addToBookmark.type';
import { ConntractorsResponse } from 'src/contractor/contractor.type';
import { ContractorsDto } from 'src/contractor/contractor.dto';

@Resolver()
export class BookmarkResolver {
    constructor(
        private readonly bookmarkService: BookmarkService,
      ) {}

      @Mutation(() => AddToBookmarkResponse) // Adjust this return type as needed
      @UseGuards(GraphqlAuthGuard)
      async addToBookmark(
        @Args('bookmarkInput') bookmarkDto: BookmarkDto,
        @Context() context: { req: Response | any },
      ) {
        console.log(bookmarkDto)
        const userId = context.req?.user?.sub;
        return this.bookmarkService.addToBookmark(bookmarkDto , userId);
      }

      @Mutation(() => [BookmarkConntractorsResponse]) // Adjust this return type as needed
      @UseGuards(GraphqlAuthGuard)
      async myBookmark(
        @Args('contractors') contractorsDto: ContractorsDto,
        @Context() context: { req: Response | any },
      ) {
        const userId = context.req?.user?.sub;
        console.log(contractorsDto)
        return this.bookmarkService.myBookmarks(contractorsDto,userId);
      }
}
