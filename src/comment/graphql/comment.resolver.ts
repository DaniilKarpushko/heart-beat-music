import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommentType } from './comment.type';
import { CommentService } from '../comment.service';
import { PublicAccess } from 'supertokens-nestjs';

@Resolver(() => CommentType)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Query(() => [CommentType])
  @PublicAccess()
  async comments(
    @Args('newsId', { type: () => Int }) newsId: number,
    @Args('cursor', { type: () => Int, nullable: true, defaultValue: 0 })
    cursor: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
  ) {
    return this.commentService.findAny(newsId, cursor, limit);
  }

  @Mutation(() => CommentType)
  @PublicAccess()
  async createComment(
    @Args('newsId', { type: () => Int }) newsId: number,
    @Args('userId', { type: () => String }) userId: string,
    @Args('text') text: string,
  ) {
    return this.commentService.create(newsId, userId, text);
  }

  @Mutation(() => CommentType)
  @PublicAccess()
  async updateComment(
    @Args('id', { type: () => Int }) id: number,
    @Args('userId', { type: () => String }) userId: string,
    @Args('text') text: string,
  ) {
    return this.commentService.changeComment(id, userId, text);
  }

  @Mutation(() => Boolean)
  @PublicAccess()
  async deleteComment(
    @Args('commentId', { type: () => Int }) commentId: number,
  ) {
    await this.commentService.delete(commentId);
    return true;
  }
}
