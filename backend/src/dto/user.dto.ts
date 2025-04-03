import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        description: '유저 이름',
        type: 'string',
        maxLength: 10,
        minLength: 3,
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: '유저 이메일',
        type: 'string',
        maxLength: 25,
        minLength: 10,
    })
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty({
        description: '유저 비밀번호',
        type: 'string',
        maxLength: 20,
        minLength: 8,
    })
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({
        description: '유저 연락처',
        type: 'integer',
        maximum: 11
    })
    @IsNotEmpty()
    @IsNumber()
    phone: number;

    @ApiProperty({
        description: '유저 주민등록번호',
        type: 'integer',
        maximum: 13,
    })
    @IsNotEmpty()
    @IsNumber()
    resident_num: string;

    @ApiProperty({
        description: '유저 닉네임',
        type: 'string',
        maxLength: 20,
        minLength: 3,
    })
    @IsNotEmpty()
    @IsString()
    nickname: string;
}
