import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { AlbumType } from '@prisma/client';

registerEnumType(AlbumType, {
  name: 'AlbumType',
});

@ObjectType()
export class AlbumTypeGraphQL {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field(() => Int)
  artistId: number;

  @Field(() => AlbumType)
  type: AlbumType;

  @Field()
  dropDate: Date;
}
