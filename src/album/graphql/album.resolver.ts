import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AlbumTypeGraphQL } from './album.type';
import { AlbumService } from '../album.service';
import { CreateAlbumInput, UpdateAlbumTitleInput } from './album.input';
import { PublicAccess } from 'supertokens-nestjs';

interface Album {
  id: number;
  title: string;
  artistId: number;
  type: 'SINGLE' | 'ALBUM';
  dropDate: Date;
}

@Resolver(() => AlbumTypeGraphQL)
export class AlbumResolver {
  constructor(private readonly albumService: AlbumService) {}

  @Query(() => [AlbumTypeGraphQL])
  @PublicAccess()
  async allAlbums(
    @Args('cursor', { type: () => Int, nullable: true }) cursor = 0,
    @Args('limit', { type: () => Int, nullable: true }) limit = 10,
  ) {
    const albums = await this.albumService.findAll(cursor, limit);
    return albums.map((album) => this.mapEntityToGraphQL(album));
  }

  @Query(() => [AlbumTypeGraphQL])
  @PublicAccess()
  async topAlbums(@Args('amount', { type: () => Int }) amount: number) {
    const albums = await this.albumService.findTop(amount);
    return albums.map((album) => this.mapEntityToGraphQL(album));
  }

  @Query(() => [AlbumTypeGraphQL])
  @PublicAccess()
  async latestAlbums() {
    const albums = await this.albumService.findLatest();
    return albums.map((album) => this.mapEntityToGraphQL(album));
  }

  @Mutation(() => AlbumTypeGraphQL)
  @PublicAccess()
  async createAlbum(@Args('data') data: CreateAlbumInput) {
    const album = await this.albumService.create(data);
    return this.mapEntityToGraphQL(album);
  }

  @Mutation(() => AlbumTypeGraphQL)
  @PublicAccess()
  async renameAlbum(@Args('data') data: UpdateAlbumTitleInput) {
    const album = await this.albumService.renameAlbum(data.id, data.name);
    return this.mapEntityToGraphQL(album);
  }

  @Mutation(() => Boolean)
  @PublicAccess()
  async deleteAlbum(@Args('id', { type: () => Int }) id: number) {
    await this.albumService.deleteAlbum(id);
    return true;
  }

  private mapEntityToGraphQL(album: Album): AlbumTypeGraphQL {
    return {
      id: album.id,
      title: album.title,
      artistId: album.artistId,
      type: album.type,
      dropDate: album.dropDate,
    };
  }
}
