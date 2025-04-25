import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber, IsString} from "class-validator";
import {UserEntity} from "../entities/user.entity";

export class SendFriendDto {
    @ApiProperty({description: '친구 요청자 아이디', type: 'integer', nullable: false})
    @IsNotEmpty()
    @IsNumber()
    send_id: UserEntity;

    @ApiProperty({description: "친구 요청 접수자 아이디", type: 'integer', nullable: false})
    @IsNotEmpty()
    @IsNumber()
    receiver_id: string;
}

export class ResponseFriendDto {
    @ApiProperty({description: '친구 요청 응답 여부("수락", "거절")'})
    @IsNotEmpty()
    @IsString()
    status: string;

    @ApiProperty({description: '친구 요청자 아이디', type: 'integer', nullable: false})
    @IsNotEmpty()
    @IsNumber()
    send_id: UserEntity;

    @ApiProperty({description: "친구 요청 접수자 아이디", type: 'integer', nullable: false})
    @IsNotEmpty()
    @IsNumber()
    receiver_id: UserEntity;

    @ApiProperty({description: "친구 별명 -> defalut: 사용자 닉네임으로.", type: "string", nullable: false})
    @IsNotEmpty()
    @IsString()
    alias: string;
}