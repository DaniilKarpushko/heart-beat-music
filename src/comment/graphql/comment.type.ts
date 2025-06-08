import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CommentType {
  @Field(() => Int)
  id: number;

  @Field()
  text: string;

  @Field(() => Int)
  userId: number;
}
