import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSongDto {
  @ApiProperty({
    description: 'Название песни',
    example: 'My Song',
    type: String,
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'ID артиста, который исполнил песню',
    example: 1,
    type: Number,
  })
  @IsNumber()
  artistId: number;

  @ApiProperty({
    description: 'ID альбома, к которому относится песня',
    example: 1,
    type: Number,
  })
  @IsNumber()
  albumId: number;

  @ApiProperty({
    description: 'Продолжительность песни в секундах',
    example: 210,
    type: Number,
  })
  @IsNumber()
  duration: number;

  @ApiProperty({
    description: 'Количество прослушиваний песни',
    example: 1500,
    type: Number,
  })
  @IsNumber()
  listens: number;

  @ApiProperty({
    description: 'Путь к файлу песни',
    example: '/songs/mysong.mp3',
    type: String,
  })
  @IsNotEmpty()
  path: string;
}
