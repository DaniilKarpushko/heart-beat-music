import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNewsDto {
  @ApiProperty({
    example: 1,
    description: 'ID пользователя, который создает новость',
  })
  userId: string;

  @ApiProperty({
    example: 'Заголовок новости',
    description: 'Заголовок для новости',
  })
  @IsString()
  header: string;

  @ApiProperty({
    example: 'Текст новости',
    description: 'Содержимое новости',
  })
  @IsString()
  text: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'URL изображения для новости',
  })
  @IsUrl()
  pictureUrl: string;
}
