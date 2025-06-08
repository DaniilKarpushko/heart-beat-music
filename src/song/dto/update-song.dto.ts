import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSongDto {
  @ApiProperty({
    description: 'Название песни',
    example: 'Updated Song',
    type: String,
    required: false,
  })
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Продолжительность песни в секундах',
    example: 180,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiProperty({
    description: 'Количество прослушиваний песни',
    example: 1600,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  listens?: number;

  @ApiProperty({
    description: 'Путь к файлу песни',
    example: '/songs/updatedsong.mp3',
    type: String,
    required: false,
  })
  @IsOptional()
  path?: string;
}
