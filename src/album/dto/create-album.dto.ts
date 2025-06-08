import { AlbumType } from '@prisma/client';
import { IsDate, IsEnum, IsInt, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateAlbumDto {
  @ApiProperty({
    description: 'Название альбома',
    example: 'Album Name',
    minLength: 1,
  })
  @IsString()
  @MinLength(1, { message: 'Title cannot be empty' })
  title: string;

  @ApiProperty({
    description: 'ID артиста, которому принадлежит альбом',
    example: 123,
  })
  @IsInt()
  artistId: number;

  @ApiProperty({
    description: 'Тип альбома (например, "ALBUM" или "SINGLE")',
    enum: ['SINGLE', 'ALBUM'],
    example: 'ALBUM',
  })
  @IsEnum(AlbumType)
  type: AlbumType;

  @ApiProperty({
    description: 'Дата выхода альбома',
    example: '2024-12-31',
    type: 'string',
    format: 'date',
  })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  dropDate: Date;
}
