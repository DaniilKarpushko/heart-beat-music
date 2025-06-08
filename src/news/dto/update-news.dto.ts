import { IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateNewsDto {
  @ApiPropertyOptional({
    example: 'Новый заголовок',
    description: 'Обновлённый заголовок',
  })
  @IsString()
  @IsOptional()
  header?: string;

  @ApiPropertyOptional({
    example: 'Обновлённый текст новости',
    description: 'Обновлённый контент',
  })
  @IsString()
  @IsOptional()
  text?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/updated-image.jpg',
    description: 'Обновлённый URL изображения',
  })
  @IsUrl()
  @IsOptional()
  pictureUrl?: string;
}
