import { Length } from 'class-validator';
import { Field, ID, InputType, ObjectType } from 'type-graphql';

import { Comment } from '../comment/comment.dto';
import { User } from '../user/user.dto';

@ObjectType()
export class Post {
  @Field(() => ID)
  id: string;

  @Field()
  text: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field(() => Comment, { nullable: true })
  comments?: [Comment];

  @Field(() => User)
  user: [User];
}

@InputType()
export class CreatePostInput {
  @Field()
  @Length(20, 255)
  text: string;
}
