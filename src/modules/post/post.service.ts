import logger from '../../helpers/logger';
import { prisma } from '../../utils/prisma';
import { User } from '../user/user.dto';
import { CreatePostInput, SortOptions } from './post.dto';

export async function createPost(input: CreatePostInput, authorId: User['id']) {
  const post = await prisma.post.create({
    data: {
      text: input.text,
      user: {
        connect: {
          id: authorId,
        },
      },
    },
  });

  return post;
}

export async function findAllPosts({
  skip = 0,
  take,
  sortOptions,
}: {
  skip?: number;
  take?: number;
  sortOptions: SortOptions;
}) {
  const modifySortOptions = (sortOptions: SortOptions) => {
    logger.info(sortOptions.createdAt);
    if (sortOptions.createdAt) {
      return sortOptions;
    }
    return { user: sortOptions };
  };

  logger.info(modifySortOptions(sortOptions));
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      createdAt: true,
      text: true,
      user: {
        select: {
          email: true,
          username: true,
        },
      },
    },
    orderBy: modifySortOptions(sortOptions),
    take,
    skip,
  });

  return posts;
}

export async function getTotalPosts() {
  const allPosts = await prisma.post.findMany();
  return allPosts.length;
}
