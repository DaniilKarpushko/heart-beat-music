import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ArtistType } from './artist.type';
import { Logger } from '@nestjs/common';
import { ArtistService } from '../artist.service';
import { CreateArtistInput, UpdateArtistInput } from './artist.input';
import { PublicAccess } from 'supertokens-nestjs';

interface Artist {
  id: number;
  name: string;
  surname: string;
  nickname: string;
}

@Resolver(() => ArtistType)
export class ArtistResolver {
  private readonly logger = new Logger(ArtistResolver.name);

  constructor(private readonly artistService: ArtistService) {}

  private mapArtistToGraphQL(artist: Artist): ArtistType {
    return {
      id: artist.id,
      name: artist.name,
      surname: artist.surname,
      nickname: artist.nickname,
    };
  }

  @Query(() => [ArtistType], {
    description: 'Получить топ артистов по рейтингу',
  })
  @PublicAccess()
  async getTop(
    @Args('amount', { type: () => Int }) amount: number,
  ): Promise<ArtistType[]> {
    try {
      const artists = await this.artistService.getTop(amount);
      return artists.map((artist) => artist);
    } catch (error) {
      this.logger.error(`Ошибка при получении топ артистов: ${error}`);
      throw error;
    }
  }

  @Query(() => ArtistType, { description: 'Получить артиста по ID' })
  @PublicAccess()
  async findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<ArtistType> {
    try {
      const artist = await this.artistService.findOne(id);
      if (!artist) {
        throw new Error('Артист не найден');
      }
      return this.mapArtistToGraphQL(artist as Artist);
    } catch (error) {
      this.logger.error(`Ошибка при получении артиста с ID ${id}: ${error}`);
      throw error;
    }
  }

  @Query(() => [ArtistType], {
    description: 'Получить всех артистов с пагинацией',
  })
  @PublicAccess()
  async findAll(
    @Args('cursor', { type: () => Int, nullable: true, defaultValue: 0 })
    cursor: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
  ): Promise<ArtistType[]> {
    try {
      const artists = await this.artistService.getAll(cursor, limit);
      return artists.map((artist) => this.mapArtistToGraphQL(artist as Artist));
    } catch (error) {
      this.logger.error(`Ошибка при получении списка артистов: ${error}`);
      throw error;
    }
  }

  @Mutation(() => ArtistType, { description: 'Создать нового артиста' })
  @PublicAccess()
  async create(
    @Args('input') createArtistInput: CreateArtistInput,
  ): Promise<ArtistType> {
    try {
      const artist = await this.artistService.create(createArtistInput);
      return this.mapArtistToGraphQL(artist as Artist);
    } catch (error) {
      this.logger.error(`Ошибка при создании артиста: ${error}`);
      throw error;
    }
  }

  @Mutation(() => ArtistType, { description: 'Удалить артиста по ID' })
  @PublicAccess()
  async delete(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<ArtistType> {
    try {
      const artist = await this.artistService.findOne(id);
      if (!artist) {
        throw new Error('Артист не найден');
      }
      await this.artistService.delete(id);
      return this.mapArtistToGraphQL(artist as Artist);
    } catch (error) {
      this.logger.error(`Ошибка при удалении артиста с ID ${id}: ${error}`);
      throw error;
    }
  }

  @Mutation(() => ArtistType, { description: 'Обновить данные артиста' })
  @PublicAccess()
  async update(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updateArtistInput: UpdateArtistInput,
  ): Promise<ArtistType> {
    try {
      const artist = await this.artistService.update(id, updateArtistInput);
      return this.mapArtistToGraphQL(artist as Artist);
    } catch (error) {
      this.logger.error(`Ошибка при обновлении артиста с ID ${id}: ${error}`);
      throw error;
    }
  }
}
