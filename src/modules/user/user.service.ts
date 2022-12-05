import { faker } from '@faker-js/faker';
import argon2 from 'argon2';

import { prisma } from '../../utils/prisma';
import { LoginUserInput, RegisterUserInput } from './user.dto';

export async function createUser(input: RegisterUserInput) {
  const password = await argon2.hash(input.password);

  const user = await prisma.user.create({
    data: {
      avatar: faker.image.avatar(),
      email: input.email,
      username: input.username,
      homePageUrl: input.homePageUrl,
      password,
    },
  });

  return user;
}

export async function findUserByEmail(email: LoginUserInput['email']) {
  const user = await prisma.user.findFirst({ where: { email } });

  return user;
}
