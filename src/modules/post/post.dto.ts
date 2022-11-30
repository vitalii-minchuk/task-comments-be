import { Length } from 'class-validator';
import { Field, ID, InputType, ObjectType } from 'type-graphql';

@ObjectType()
export class Post {
  @Field(() => ID)
  id: string;

  @Field()
  text: string;

  //   @Field({ nullable: true })
  //   comments: [Comment];

  @Field()
  authorId: string;
}

@InputType()
export class CreatePostInput {
  @Field()
  @Length(20, 255)
  text: string;

  @Field()
  link: string;
}
