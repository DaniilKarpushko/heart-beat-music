import { Field, Float, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType({ description: 'Данные для создания артиста' })
export class CreateArtistInput {
  @Field(() => String, { description: 'Имя артиста' })
  name: string;

  @Field(() => String, { description: 'Фамилия артиста' })
  surname: string;

  @Field(() => String, { nullable: true, description: 'Псевдоним артиста' })
  nickname: string;

  @Field(() => Float, { description: 'Рейтинг артиста' })
  rating: number;
}

@InputType({ description: 'Данные для обновления артиста' })
export class UpdateArtistInput {
  @Field(() => String, { nullable: true, description: 'Имя артиста' })
  @IsOptional()
  name: string;

  @Field(() => String, { nullable: true, description: 'Фамилия артиста' })
  @IsOptional()
  surname?: string;

  @Field(() => String, { nullable: true, description: 'Псевдоним артиста' })
  @IsOptional()
  nickname?: string;
}
