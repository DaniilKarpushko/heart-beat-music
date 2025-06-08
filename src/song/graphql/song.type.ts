import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SongType {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field(() => Int)
  artistId: number;

  @Field(() => Int)
  albumId: number;

  @Field(() => Int)
  duration: number;

  @Field(() => Int)
  listens: number;

  @Field()
  path: string;
}
