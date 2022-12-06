import { ApolloError } from 'apollo-server-core';
import sanitizeHtml from 'sanitize-html';
import { Arg, Authorized, Ctx, Mutation, Query } from 'type-graphql';

import { sanitizeHtmlOptions } from '../../constants';
import { Context } from '../../utils/create-server';
import {
  CreatePostInput,
  GetPostsInput,
  OrderTypeType,
  Post,
  SortOptions,
} from './post.dto';
import { createPost, findAllPosts, getTotalPosts } from './post.service';

class RostResolver {
  @Query(() => [Post])
  async getAllPosts(
    @Arg('posts')
    {
      orderBy = 'createdAt',
      orderType = OrderTypeType.DESC,
      take = 25,
      skip = 0,
    }: GetPostsInput,
  ) {
    const sortOptions: SortOptions = {
      [orderBy]: orderType,
    };

    try {
      const total = await getTotalPosts();
      const postsWithoutTotal = await findAllPosts({
        take,
        skip,
        sortOptions,
      });
      const posts = postsWithoutTotal.map((post) => ({ ...post, total }));

      return posts;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw Error(error);
    }
  }

  @Authorized()
  @Mutation(() => Post)
  async createNewPost(
    @Arg('input') input: CreatePostInput,
    @Ctx() context: Context,
  ) {
    try {
      const cleanData = sanitizeHtml(input.text, sanitizeHtmlOptions);

      if (!cleanData) {
        throw new ApolloError('hello');
      }

      if (!context.user) {
        throw new ApolloError('Author does not exist');
      }

      const authorId = context.user.id;
      const post = await createPost(input, authorId);

      return post;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw Error(error);
    }
  }
}

export default RostResolver;
