import { prisma } from '../../utils/prisma';
import { User } from '../user/user.dto';
import { CreateCommentInput } from './comment.dto';

export async function createComment(
  input: CreateCommentInput,
  authorId: User['id'],
) {
  const comment = await prisma.comment.create({
    data: {
      text: input.text,
      postId: 'clb3lnki60008xqbu7z1jsl8y',
      userId: authorId,
    },
  });
}
