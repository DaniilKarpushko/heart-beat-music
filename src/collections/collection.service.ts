import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CollectionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(name: string, rating: number) {
    return this.prisma.collection.create({
      data: {
        name,
        rating,
      },
    });
  }

  async addSong(collectionId: number, songId: number) {
    const collection = await this.prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    const song = await this.prisma.song.findUnique({
      where: { id: songId },
    });

    if (!song) {
      throw new NotFoundException('Song not found');
    }

    return this.prisma.collectionSong.create({
      data: {
        collectionId,
        songId,
      },
    });
  }

  async update(collectionId: number, newRating: number): Promise<any> {
    return this.prisma.collection.update({
      where: { id: collectionId },
      data: { rating: newRating },
    });
  }

  async getSongs(collectionId: number) {
    return this.prisma.collectionSong.findMany({
      where: { collectionId },
      include: {
        song: true,
      },
    });
  }

  async findAll(cursor: number, limit: number) {
    return this.prisma.collection.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { id: 'asc' },
    });
  }

  async delete(id: number) {
    return this.prisma.collection.delete({ where: { id: id } });
  }

  async findOne(id: number) {
    return this.prisma.collection.findUnique({ where: { id: id } });
  }
}
