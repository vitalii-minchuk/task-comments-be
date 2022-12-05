import { IsEmail, isURL, Length } from 'class-validator';
import { Field, ID, InputType, ObjectType } from 'type-graphql';
import { Post } from '../post/post.dto';
import { Comment } from '../comment/comment.dto';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  homePageUrl?: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field(() => Post, { nullable: true })
  posts?: [Post];

  @Field(() => Comment, { nullable: true })
  comments?: [Comment];
}

@InputType()
export class RegisterUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(2, 64)
  username: string;

  @Field()
  @Length(6, 44)
  password: string;

  @Field({ nullable: true })
  homePageUrl?: string;
}

@InputType()
export class LoginUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(6, 44)
  password: string;
}
