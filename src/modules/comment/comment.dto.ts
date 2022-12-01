import { Length } from 'class-validator';
import { Field, ID, InputType, ObjectType } from 'type-graphql';
import { Post } from '../post/post.dto';

@ObjectType()
export class Comment {
  @Field(() => ID)
  id: string;

  @Field()
  text: string;

  @Field()
  authorId: string;

  @Field()
  postId: string;

  @Field(() => Comment, { nullable: true })
  children?: [Comment];

  @Field(() => Comment, { nullable: true })
  parent?: Comment;
}

@InputType()
export class CreateCommentInput {
  @Field()
  @Length(20, 255)
  text: string;

  @Field()
  postId: string;
}

@InputType()
export class GetPostCommentsInput {
  @Field()
  postId: string;
}
