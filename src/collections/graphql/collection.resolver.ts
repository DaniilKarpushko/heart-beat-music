import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CollectionSong, CollectionType } from './collection.type';
import { CollectionService } from '../collection.service';
import { CreateCollectionInput } from './collection.input';
import { PublicAccess } from 'supertokens-nestjs';

@Resolver(() => CollectionType)
export class CollectionResolver {
  constructor(private readonly collectionService: CollectionService) {}

  @Query(() => [CollectionType])
  @PublicAccess()
  async collections(
    @Args('cursor', { type: () => Int }) cursor: number,
    @Args('limit', { type: () => Int }) limit: number,
  ) {
    return this.collectionService.findAll(cursor, limit);
  }

  @Query(() => CollectionType)
  @PublicAccess()
  async collection(@Args('id', { type: () => Int }) id: number) {
    return this.collectionService.findOne(id);
  }

  @Query(() => [CollectionSong])
  @PublicAccess()
  async collectionSongs(@Args('id', { type: () => Int }) id: number) {
    return this.collectionService.getSongs(id);
  }

  @Mutation(() => CollectionType)
  @PublicAccess()
  async createCollection(
    @Args('input') input: CreateCollectionInput,
  ): Promise<CollectionType> {
    return this.collectionService.create(input.name, 0);
  }

  @Mutation(() => Boolean)
  @PublicAccess()
  async deleteCollection(@Args('id', { type: () => Int }) id: number) {
    await this.collectionService.delete(id);
    return true;
  }

  @Mutation(() => Boolean)
  @PublicAccess()
  async addSongToCollection(
    @Args('collectionId', { type: () => Int }) collectionId: number,
    @Args('songId', { type: () => Int }) songId: number,
  ) {
    await this.collectionService.addSong(collectionId, songId);
    return true;
  }
}
