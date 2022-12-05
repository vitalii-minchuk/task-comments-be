import { Length, Max, Min } from 'class-validator';
import { Field, ID, InputType, Int, ObjectType } from 'type-graphql';

import { Comment } from '../comment/comment.dto';
import { User } from '../user/user.dto';

@ObjectType()
export class Post {
  @Field(() => ID)
  id: string;

  @Field()
  text: string;

  @Field({ nullable: true })
  image_url?: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field(() => Comment, { nullable: true })
  comments?: [Comment];

  @Field(() => User)
  user: [User];

  @Field(() => Int)
  total: number;
}

@InputType()
export class CreatePostInput {
  @Field()
  @Length(20, 640)
  text: string;

  @Field({ nullable: true })
  image_url?: string;
}

export enum OrderTypeType {
  ASC = 'asc',
  DESC = 'desc',
}

@InputType()
export class GetPostsInput {
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @Min(0)
  skip?: number;

  @Field(() => Int, { nullable: true })
  @Min(1)
  @Max(50)
  take?: number;

  @Field({ nullable: true })
  orderBy?: string;

  @Field({ nullable: true })
  orderType?: string;
}

@ObjectType()
export class SortOptions {
  @Field({ nullable: true })
  username?: OrderTypeType;

  @Field({ nullable: true })
  email?: OrderTypeType;

  @Field({ nullable: true })
  createdAt?: OrderTypeType;
}
