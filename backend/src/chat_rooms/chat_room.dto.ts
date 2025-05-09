import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export enum ChatType {
  one_to_one = 'one_to_one',
  group = 'group',
}
export class CreateRoomDto {
  @ApiProperty({
    description: '유저 아이디(배열 형식으로 가져올 것.)',
  })
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  user_id: number[];

  @ApiProperty({
    description: '타이틀 (채팅방 제목)',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: '채팅방 타입 (one_to_one, group)',
    type: 'string',
    enum: ['one_to_one', 'group'],
    default: 'one_to_one',
  })
  @IsNotEmpty()
  @IsString()
  chat_type: ChatType;
}
