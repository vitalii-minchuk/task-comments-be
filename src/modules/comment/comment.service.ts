import { prisma } from '../../utils/prisma';
import { Post } from '../post/post.dto';
import { User } from '../user/user.dto';
import { CreateCommentInput } from './comment.dto';

export async function createComment(
  input: CreateCommentInput,
  authorId: User['id'],
) {
  const comment = await prisma.comment.create({
    data: {
      text: input.text,
      image_url: input.image_url ? input.image_url : '',
      post: { connect: { id: input.postId } },
      user: {
        connect: {
          id: authorId,
        },
      },
      ...(input.parentId && {
        parent: {
          connect: {
            id: input.parentId,
          },
        },
      }),
    },
  });

  return comment;
}

export async function findAllPostComments(postId: Post['id']) {
  const comments = await prisma.comment.findMany({
    where: {
      postId,
    },
    include: {
      user: true,
    },
  });

  return comments;
}
