import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { GraphqlAuthGuard } from 'src/auth/auth.guard';
import { PostService } from './post.service';
import { PostDto, getPostDto } from './post.dto';
import { PostType } from './post.type';

@Resolver()
export class PostResolver {
    constructor(
        private readonly postService: PostService,
      ) {}

    @Mutation(() => PostType) // Adjust this return type as needed
    @UseGuards(GraphqlAuthGuard)
    async createPost(
      @Args('postInput') postInputDto: PostDto,
      @Context() context: { req: Response | any },
    ) {
      console.log(postInputDto)
      const userId = context.req?.user?.sub;
      return this.postService.createPost(postInputDto , userId);
    }

    @Mutation(() => [PostType]) // Adjust this return type as needed
    @UseGuards(GraphqlAuthGuard)
    async getPosts(
      @Args('getPostsInput') getPostInputDto: getPostDto,
      @Context() context: { req: Response | any },
    ) {
      console.log(getPostInputDto)
      const userId = context.req?.user?.sub;
      return this.postService.getPost(getPostInputDto);
    }
}
