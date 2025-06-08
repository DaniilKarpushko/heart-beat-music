import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCollectionDto {
  @ApiProperty({
    description: 'Название коллекции',
    example: 'Collection Name',
    minLength: 1,
  })
  @IsString()
  name: string;
}
