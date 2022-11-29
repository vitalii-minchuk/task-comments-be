import { IsEmail, Length } from 'class-validator';
import { Field, ID, InputType, ObjectType } from 'type-graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  homePageUrl?: string;
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
