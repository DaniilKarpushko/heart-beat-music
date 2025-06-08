import { Injectable, NotFoundException } from '@nestjs/common';
import { Cache } from '@nestjs/cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(
    private readonly cacheManager: Cache,
    private readonly prisma: PrismaService,
  ) {}

  async create(createNewsDto: CreateNewsDto) {
    return this.prisma.news.create({
      data: {
        writerId: createNewsDto.userId,
        text: createNewsDto.text,
        pictureUrl: createNewsDto.pictureUrl,
        header: createNewsDto.header,
        date: new Date().toISOString(),
      },
    });
  }

  async findAll(cursor: number, limit: number) {
    const cacheKey = `news_${cursor}_${limit}`;

    const cachedData:
      | {
          id: number;
          writerId: string;
          header: string;
          text: string;
          pictureUrl: string;
          date: Date;
        }[]
      | null = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const news = await this.prisma.news.findMany({
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      take: limit,
      orderBy: { date: 'desc' },
    });

    await this.cacheManager.set(cacheKey, news, 10);

    return news;
  }

  async delete(id: number) {
    return this.prisma.news.delete({ where: { id: id } });
  }

  async findOne(id: number) {
    const news = await this.prisma.news.findUnique({
      where: { id: id },
    });

    if (!news) {
      throw new NotFoundException('News not found');
    }

    return news;
  }

  async update(id: number, news: UpdateNewsDto) {
    return this.prisma.news.update({
      where: { id: id },
      data: { ...news },
    });
  }
}
