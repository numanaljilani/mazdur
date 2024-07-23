import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/notification/firebase.service';
import { PrismaService } from 'src/prisma.service';
import { PostDto, getPostDto } from './post.dto';
import { NotificationService } from 'src/notification/notification.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly firebaseService: FirebaseService,
    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
  ) {}

  async createPost(postInputDto: PostDto, userId) {
    var data = {
      contractorId: postInputDto.contractorId,
      userId,
      rating: Number(postInputDto.rating),
    };
    const postExist = await this.prisma.post.findMany({
      where: {
        userId,
      },
    });
    // if (postExist) return postExist;

    if (postInputDto.text) {
      data['text'] = postInputDto.text;
    }
const findcontractor = await this.prisma.user.findUnique({where : {id : postInputDto.contractorId}})
const avgRating = (Number(findcontractor.rating || 5) + Number(postInputDto.rating))/2
const review = Number(findcontractor.rewies || 1) + 1
console.log(avgRating , review , "????????")
    const [post, user, contractor , update] = await Promise.all([
      this.prisma.post.create({
        data,
      }),
      this.userService.getFcmToken(postInputDto.contractorId),
      this.userService.getFcmToken(userId),
      this.prisma.user.update({
        where: {
          id: postInputDto.contractorId,
        },
        data: {
          rating : avgRating,
          rewies : review

        },
      }),
    ]);

    await Promise.all([
      this.notificationService.createNotification(
        {
          title: 'Thank you!',
          desc: `thanks for posting your valuable review on  ${user.fullname}.`,
          broadcast: false,
          type: 'user',
        },
        userId,
        user?.fcmtoken,
      ),
      this.notificationService.createNotification(
        {
          title: 'Some one has post a review!',
          desc: ` ${contractor.fullname} post a review on your service.`,
          broadcast: false,
          type: 'user',
        },
        userId,
        contractor?.fcmtoken,
      ),
    ]);

    return post;
  }
  async getPost(postInputDto: getPostDto) {
    const posts = await this.prisma.post.findMany({
      where: {
        contractorId: postInputDto.contractorId,
      },
      take: postInputDto.take,
      skip: postInputDto.skip,
      include: {
        user: true,
      },
      orderBy:{
        createdAt : 'desc'
      }
      
    });
    return posts;
  }
}
