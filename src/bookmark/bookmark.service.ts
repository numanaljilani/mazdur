import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private readonly prisma: PrismaService) {}

  async addToBookmark(bookmarkDto, userId) {
    const addToMyBookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        contractorId: bookmarkDto.contractorId,
      },
    });
    console.log(addToMyBookmark)
    return {
        bookmark : {
            message  : "added successfully"
        }
    }
  }

  async myBookmarks(contractorsDto,userId){
    const contractors = await this.prisma.bookmark.findMany(
      {
        where : {
          userId,
          contractor :{
            service : contractorsDto.service
          }
        },
        take : contractorsDto.take,
        skip : contractorsDto.skip,
        include : {
        contractor : true
        }
      },
    );
    console.log(contractors , "my bookmarks")
    return contractors
  }
}
