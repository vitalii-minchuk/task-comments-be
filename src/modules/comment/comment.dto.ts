import { Length } from 'class-validator';
import { Field, ID, InputType, ObjectType } from 'type-graphql';

import { User } from '../user/user.dto';

@ObjectType()
export class Comment {
  @Field(() => ID)
  id: string;

  @Field()
  text: string;

  @Field()
  image_url: string;

  @Field(() => User)
  user: [User];

  @Field()
  postId: string;

  @Field(() => [Comment])
  children: [Comment];

  @Field({ nullable: true })
  parentId?: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}

@InputType()
export class CreateCommentInput {
  @Field()
  @Length(20, 255)
  text: string;

  @Field({ nullable: true })
  image_url?: string;

  @Field()
  postId: string;

  @Field({ nullable: true })
  parentId?: string;
}

@InputType()
export class GetPostCommentsInput {
  @Field()
  postId: string;
}
