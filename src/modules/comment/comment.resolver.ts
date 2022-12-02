import { ApolloError } from 'apollo-server-core';
import { Arg, Ctx, Mutation, Query } from 'type-graphql';

import logger from '../../helpers/logger';
import { Context } from '../../utils/create-server';
import {
  Comment,
  CreateCommentInput,
  GetPostCommentsInput,
} from './comment.dto';
import { createComment, findAllPostComments } from './comment.service';

class CommentResolver {
  @Query(() => [Comment])
  async getAllPostComments(@Arg('input') input: GetPostCommentsInput) {
    try {
      const comments = await findAllPostComments(input.postId);
      logger.info(comments);
      return comments;
    } catch (error: any) {
      throw Error(error);
    }
  }

  @Mutation(() => Comment)
  async createNewComment(
    @Arg('input') input: CreateCommentInput,
    @Ctx() context: Context,
  ) {
    try {
      if (!context.user) {
        throw new ApolloError('Author does not exist');
      }
      const authorId = context.user.id;
      const comment = await createComment(input, authorId);

      return comment;
    } catch (error: any) {
      throw Error(error);
    }
  }
}

export default CommentResolver;
