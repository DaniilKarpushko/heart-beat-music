import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(cursor?: number, limit: number = 10) {
    return this.prisma.artist.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { id: 'asc' },
      include: { albums: false, songs: false },
    });
  }

  async getTop(top: number) {
    return this.prisma.artistRating.findMany({
      orderBy: { rating: 'desc' },
      take: top,
      select: {
        id: true,
        name: true,
        surname: true,
        nickname: true,
      },
    });
  }

  async findOne(id: number) {
    const artist = await this.prisma.artist.findUnique({
      where: { id: id },
    });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  async create(createArtistDto: CreateArtistDto) {
    return this.prisma.artist.create({
      data: createArtistDto,
    });
  }

  async delete(id: number) {
    return this.prisma.artist.delete({
      where: { id: id },
    });
  }

  async update(id: number, updateArtistDto: UpdateArtistDto) {
    return this.prisma.artist.update({
      where: { id: id },
      data: { ...updateArtistDto },
    });
  }
}
