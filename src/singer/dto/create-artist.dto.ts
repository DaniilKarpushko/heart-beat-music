import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArtistDto {
  @ApiProperty({ example: 'Иван', description: 'Имя артиста' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Иванов', description: 'Фамилия артиста' })
  @IsNotEmpty()
  surname: string;

  @ApiProperty({ example: 'DJ Vanya', description: 'Псевдоним артиста' })
  @IsNotEmpty()
  nickname: string;
}
