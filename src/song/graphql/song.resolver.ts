import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SongType } from './song.type';
import { Logger } from '@nestjs/common';
import { SongService } from '../song.service';
import { CreateSongInput, UpdateSongInput } from './song.input';
import { PublicAccess } from 'supertokens-nestjs';

export interface Song {
  id: number;
  title: string;
  artistId: number;
  albumId: number;
  duration: number;
  listens: number;
  path: string;
}

@Resolver(() => SongType)
export class SongResolver {
  private readonly logger = new Logger(SongResolver.name);

  constructor(private readonly songService: SongService) {}

  @Query(() => [SongType], { description: 'Получить все песни с пагинацией' })
  @PublicAccess()
  async getAll(
    @Args('cursor', { type: () => Int, nullable: true, defaultValue: 0 })
    cursor: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
  ): Promise<SongType[]> {
    try {
      const songs = await this.songService.findAll(cursor, limit);
      return songs.map((song) => this.mapSongToGraphQL(song as Song));
    } catch (error) {
      this.logger.error(`Ошибка при получении песен: ${error}`);
      throw error;
    }
  }

  @Query(() => SongType, { description: 'Получить песню по ID' })
  @PublicAccess()
  async findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<SongType> {
    try {
      const song = await this.songService.findOne(id);
      if (!song) {
        throw new Error('Песня не найдена');
      }
      return song as Song;
    } catch (error) {
      this.logger.error(`Ошибка при получении песни с ID ${id}: ${error}`);
      throw error;
    }
  }

  @Mutation(() => SongType, { description: 'Создать новую песню' })
  @PublicAccess()
  async create(
    @Args('input') createSongInput: CreateSongInput,
  ): Promise<SongType> {
    try {
      const song = await this.songService.create(createSongInput);
      return song as Song;
    } catch (error) {
      this.logger.error(`Ошибка при создании песни: ${error}`);
      throw error;
    }
  }

  @Mutation(() => SongType, { description: 'Обновить песню' })
  @PublicAccess()
  async update(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updateSongInput: UpdateSongInput,
  ): Promise<SongType> {
    try {
      const song = await this.songService.update(id, updateSongInput);
      return song as Song;
    } catch (error) {
      this.logger.error(`Ошибка при обновлении песни с ID ${id}: ${error}`);
      throw error;
    }
  }

  @Mutation(() => SongType, { description: 'Удалить песню по ID' })
  @PublicAccess()
  async delete(@Args('id', { type: () => Int }) id: number): Promise<SongType> {
    try {
      const song = await this.songService.findOne(id);
      if (!song) {
        throw new Error('Песня не найдена');
      }
      await this.songService.remove(id);
      return song as Song;
    } catch (error) {
      this.logger.error(`Ошибка при удалении песни с ID ${id}: ${error}`);
      throw error;
    }
  }

  @Query(() => [SongType], {
    description: 'Получить топ песен по количеству прослушиваний',
  })
  @PublicAccess()
  async getTop(
    @Args('amount', { type: () => Int }) amount: number,
  ): Promise<SongType[]> {
    try {
      const songs = await this.songService.findTop(amount);
      return songs.map((song) => this.mapSongToGraphQL(song as Song));
    } catch (error) {
      this.logger.error(`Ошибка при получении топ песен: ${error}`);
      throw error;
    }
  }

  private mapSongToGraphQL(song: Song): SongType {
    return {
      id: song.id,
      title: song.title,
      artistId: song.artistId,
      albumId: song.albumId,
      duration: song.duration,
      listens: song.listens,
      path: song.path,
    };
  }
}
