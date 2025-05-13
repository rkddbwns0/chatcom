import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateChatLogDto {
  @ApiProperty({
    description: '채팅방 아이디',
    required: false,
    type: 'number',
  })
  @IsNotEmpty()
  @IsNumber()
  room_id: number;

  @ApiProperty({
    description: '유저 아이디',
    required: false,
    type: 'number',
  })
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @ApiProperty({
    description: '유저 닉네임',
    required: false,
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @ApiProperty({
    description: '메시지 내용',
    required: false,
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  message: string;
}
