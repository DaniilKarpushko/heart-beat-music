import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateArtistDto {
  @ApiPropertyOptional({ example: 'Пётр', description: 'Имя артиста' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Петров', description: 'Фамилия артиста' })
  @IsOptional()
  surname?: string;

  @ApiPropertyOptional({ example: 'MC Petr', description: 'Псевдоним' })
  @IsOptional()
  nickname?: string;
}
