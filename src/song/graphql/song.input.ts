import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

@InputType()
export class CreateSongInput {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field(() => Int)
  @IsNumber()
  artistId: number;

  @Field(() => Int)
  @IsNumber()
  albumId: number;

  @Field(() => Int)
  @IsNumber()
  duration: number;

  @Field(() => Int)
  @IsNumber()
  listens: number;

  @Field()
  @IsNotEmpty()
  path: string;
}

@InputType()
export class UpdateSongInput {
  @Field({ nullable: true })
  @IsOptional()
  title?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  listens?: number;

  @Field({ nullable: true })
  @IsOptional()
  path?: string;
}
