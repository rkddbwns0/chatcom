import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber, IsString} from "class-validator";
import {FriendsEntity} from "../entities/friends.entity";
import {UserEntity} from "../entities/user.entity";

export class CreateRoomDto {
    @ApiProperty({
        description: '유저 아이디(배열 형식으로 가져올 것.)'
    })
    @IsNotEmpty()
    @IsNumber({}, {each: true})
    user_id: number[];

    @ApiProperty({
        description: '타이틀 (채팅방 제목)'
    })
    @IsNotEmpty()
    @IsString()
    title: string;
}