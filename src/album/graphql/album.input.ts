import { Field, InputType, Int } from '@nestjs/graphql';
import { AlbumType } from '@prisma/client';
import { IsEnum, IsInt, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateAlbumInput {
  @Field()
  @IsString()
  @MinLength(1)
  title: string;

  @Field(() => Int)
  @IsInt()
  artistId: number;

  @Field(() => AlbumType)
  @IsEnum(AlbumType)
  type: AlbumType;

  @Field(() => Int)
  @IsInt()
  length: number;

  @Field()
  dropDate: Date;
}

@InputType()
export class UpdateAlbumTitleInput {
  @Field(() => Int)
  id: number;

  @Field()
  @IsString()
  @MinLength(1)
  name: string;
}
