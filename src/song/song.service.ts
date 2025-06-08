import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

@Injectable()
export class SongService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(cursor: number, limit: number = 10) {
    return this.prisma.song.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { id: 'asc' },
    });
  }

  async findTop(top: number) {
    return this.prisma.song.findMany({
      take: top,
      orderBy: { listens: 'desc' },
      include: {
        artist: true,
        album: true,
      },
    });
  }

  async findByAlbum(albumId: number, cursor: number, limit: number = 10) {
    return this.prisma.song.findMany({
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      take: limit,
      where: { albumId: albumId },
    });
  }

  async findOne(id: number) {
    return this.prisma.song.findUnique({ where: { id: id } });
  }

  async create(createSongDto: CreateSongDto) {
    return this.prisma.song.create({
      data: {
        title: createSongDto.title,
        path: createSongDto.path,
        artistId: createSongDto.artistId,
        albumId: createSongDto.albumId,
        duration: createSongDto.duration,
        listens: 0,
      },
    });
  }

  async update(id: number, updateSongDto: UpdateSongDto) {
    return this.prisma.song.update({
      where: { id: id },
      data: { ...updateSongDto },
    });
  }

  async remove(id: number) {
    return this.prisma.song.delete({ where: { id: id } });
  }

  async incrementListens(id: number) {
    return this.prisma.song.update({
      where: { id },
      data: { listens: { increment: 1 } },
    });
  }
}
