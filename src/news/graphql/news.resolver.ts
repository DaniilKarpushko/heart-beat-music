import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NewsType } from './news.type';
import { NewsService } from '../news.service';
import { CreateNewsInput, UpdateNewsInput } from './news.input';
import { PublicAccess } from 'supertokens-nestjs';

interface News {
  id: number;
  writerId: string;
  header: string;
  text: string;
  pictureUrl: string;
}

@Resolver(() => NewsType)
export class NewsResolver {
  constructor(private readonly newsService: NewsService) {}

  @Query(() => [NewsType])
  @PublicAccess()
  async news(
    @Args('cursor', { type: () => Int, nullable: true }) cursor: number = 0,
    @Args('limit', { type: () => Int, nullable: true }) limit: number = 10,
  ) {
    const result = await this.newsService.findAll(cursor, limit);
    return result.map((news) => this.mapNewsToGraphQL(news));
  }

  @Query(() => NewsType)
  @PublicAccess()
  async newsById(@Args('id', { type: () => Int }) id: number) {
    const news = await this.newsService.findOne(id);
    return this.mapNewsToGraphQL(news);
  }

  @Mutation(() => NewsType)
  @PublicAccess()
  async createNews(@Args('input') input: CreateNewsInput) {
    const news = await this.newsService.create(input);
    return this.mapNewsToGraphQL(news);
  }

  @Mutation(() => NewsType)
  @PublicAccess()
  async updateNews(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateNewsInput,
  ) {
    const updated = await this.newsService.update(id, input);
    return this.mapNewsToGraphQL(updated as News);
  }

  @Mutation(() => Boolean)
  @PublicAccess()
  async deleteNews(@Args('id', { type: () => Int }) id: number) {
    await this.newsService.delete(id);
    return true;
  }

  private mapNewsToGraphQL(news: News): NewsType {
    return {
      id: news.id,
      writerId: news.writerId,
      header: news.header,
      text: news.text,
      pictureUrl: news.pictureUrl,
    };
  }
}
