import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Артист' })
export class ArtistType {
  @Field(() => ID, { description: 'Уникальный идентификатор артиста' })
  id: number;

  @Field(() => String, { description: 'Имя артиста' })
  name: string;

  @Field(() => String, { description: 'Фамилия артиста' })
  surname: string;

  @Field(() => String, { nullable: true, description: 'Псевдоним артиста' })
  nickname?: string;
}
