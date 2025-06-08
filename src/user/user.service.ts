import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { deleteUser } from 'supertokens-node';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    return user;
  }

  async create(username: string, userId: string) {
    return this.prisma.user.create({
      data: {
        nickname: username,
        id: userId,
      },
    });
  }

  async addFavouriteSong(userId: string, songId: number) {
    return this.prisma.userSong.create({
      data: {
        songId,
        userId,
      },
      include: {
        song: {
          select: {
            title: true,
          },
        },
      },
    });
  }

  async favouriteSongs(userId: string) {
    return this.prisma.userSong.findMany({
      where: { userId: userId },
      include: { song: true },
    });
  }

  async deleteFavouriteSong(userId: string, songId: number) {
    return this.prisma.userSong.delete({
      where: {
        userId_songId: {
          userId: userId,
          songId: songId,
        },
      },
    });
  }

  async delete(id: string) {
    await deleteUser(id);
    return this.prisma.user.delete({ where: { id } });
  }
}
