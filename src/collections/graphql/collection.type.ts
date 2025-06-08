import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CollectionType {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => Float)
  rating: number;
}

@ObjectType()
export class CollectionSong {
  @Field(() => Int)
  songId: number;

  @Field()
  title: string;
}
