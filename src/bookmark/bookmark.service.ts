import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BookmarkDto } from './bookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(private readonly prisma: PrismaService) {}

  async addToBookmark(bookmarkDto: BookmarkDto, userId) {
    if (bookmarkDto.isBookmark) {
      await this.prisma.bookmark.deleteMany({
        where: {
          contractorId: bookmarkDto.contractorId,
          userId,
        },
      });
      return {
        bookmark: {
          message: 'Removed successfully',
        },
      };
    } else {
      await this.prisma.bookmark.create({
        data: {
          userId,
          contractorId: bookmarkDto.contractorId,
        },
      });
      return {
        bookmark: {
          message: 'added successfully',
        },
      };
    }
  }

  async myBookmarks(contractorsDto, userId) {
    const contractors = await this.prisma.bookmark.findMany({
      where: {
        userId,
        contractor: {
          service: contractorsDto.service,
        },
      },
      take: contractorsDto.take,
      skip: contractorsDto.skip,
      include: {
        contractor: true,
      },
    });
    console.log(contractors, 'my bookmarks');
    return contractors;
  }
}
