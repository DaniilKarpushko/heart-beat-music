import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlbumDto } from './dto/create-album.dto';

@Injectable()
export class AlbumService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(cursor?: number, limit: number = 10) {
    return this.prisma.album.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { id: 'asc' },
      include: { songs: true },
    });
  }

  async create(createAlbumDto: CreateAlbumDto) {
    return this.prisma.album.create({
      data: {
        title: createAlbumDto.title,
        artistId: createAlbumDto.artistId,
        type: createAlbumDto.type,
        dropDate: createAlbumDto.dropDate,
      },
    });
  }

  async findLatest(limit: number = 10) {
    return this.prisma.album.findMany({
      take: limit,
      orderBy: { dropDate: 'desc' },
      include: {
        artist: true,
        _count: { select: { songs: true } },
      },
    });
  }

  async findTop(top: number) {
    const topAlbums = await this.prisma.song.groupBy({
      by: ['albumId'],
      _sum: { listens: true },
      orderBy: { _sum: { listens: 'desc' } },
      take: top,
    });

    const albumIds = topAlbums.map((album) => album.albumId as number); // Получаем ID

    return this.prisma.album.findMany({
      where: { id: { in: albumIds } },
      include: {
        songs: {
          include: {
            artist: true,
          },
        },
        artist: true,
      },
    });
  }

  async deleteAlbum(albumId: number) {
    return this.prisma.album.deleteMany({ where: { id: albumId } });
  }

  async renameAlbum(albumId: number, newName: string) {
    return this.prisma.album.update({
      data: {
        title: newName,
      },
      where: {
        id: albumId,
      },
    });
  }

  async findOne(albumId: number) {
    return this.prisma.album.findUnique({ where: { id: albumId } });
  }
}
