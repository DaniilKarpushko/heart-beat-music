import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(newsId: number, userId: string, text: string) {
    return this.prisma.comment.create({
      data: {
        newsId: newsId,
        userId: userId,
        text: text,
      },
    });
  }

  async findAny(newsId: number, cursor: number, limit: number) {
    return this.prisma.comment.findMany({
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      take: limit,
      where: { newsId: newsId },
      orderBy: { id: 'desc' },
      include: { user: true },
    });
  }

  async delete(id: number) {
    return this.prisma.comment.delete({ where: { id: id } });
  }

  async changeComment(id: number, userId: string, text: string) {
    return this.prisma.comment.update({
      where: {
        id: id,
        userId: userId,
      },
      data: {
        text: text,
      },
    });
  }
}
