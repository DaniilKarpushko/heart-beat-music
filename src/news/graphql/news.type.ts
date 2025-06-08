import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NewsType {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  writerId: string;

  @Field()
  header: string;

  @Field()
  text: string;

  @Field()
  pictureUrl: string;
}
