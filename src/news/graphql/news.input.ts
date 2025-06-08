import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateNewsInput {
  @Field(() => String)
  userId: string;

  @Field()
  header: string;

  @Field()
  text: string;

  @Field()
  pictureUrl: string;
}

@InputType()
export class UpdateNewsInput {
  @Field({ nullable: true })
  header?: string;

  @Field({ nullable: true })
  text?: string;

  @Field({ nullable: true })
  pictureUrl?: string;
}
