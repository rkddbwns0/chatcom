import {BadRequestException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Chat_roomEntity} from "../entities/chat_room.entity";
import {Repository} from "typeorm";
import {RoomParticipantsEntity} from "../entities/room_participants.entity";
import {FriendsEntity} from "../entities/friends.entity";
import {CreateRoomDto} from "./chat_room.dto";
import {UserEntity} from "../entities/user.entity";
import {raw} from "express";
import {newMangleNameCache} from "@swc/core/binding";

@Injectable()
export class ChatRoomService {
    constructor(
        @InjectRepository(Chat_roomEntity)
        private readonly chat_room: Repository<Chat_roomEntity>,

        @InjectRepository(RoomParticipantsEntity)
        private readonly roomParticipants: Repository<RoomParticipantsEntity>,

        @InjectRepository(FriendsEntity)
        private readonly friends: Repository<FriendsEntity>,

        @InjectRepository(UserEntity)
        private readonly user: Repository<UserEntity>,
    ) {}

    async createRoom(createRoomDto: CreateRoomDto) {
        try {
            const users = await Promise.all(
                createRoomDto.user_id.map((user_id) => {
                    return this.user.findOne({
                        where: { user_id: user_id},
                        select: ["user_id", "nickname", "name", "email"],
                    })
                })
            )

            const userFilter = users.filter((user): user is UserEntity => !!user);

            if(userFilter.length !== createRoomDto.user_id.length) {
                throw new BadRequestException("존재하지 않은 유저가 있습니다. 다시 생성해 주세요.")
            }

            const title = users.map(user => user?.nickname);
            createRoomDto.title = title.join(', ');

            const createRooms = this.chat_room.create({title: createRoomDto.title});
            const saveRoom = await this.chat_room.save(createRooms);

            if (!saveRoom) {
                throw new BadRequestException('채팅방 생성에 실패했습니다. 다시 시도해 주세요.')
            }

            const createRoomParticipants = userFilter.map((userEntity) => {
                return this.roomParticipants.save({room_id: saveRoom, user_id: userEntity})
            })

            return {message: '채팅방이 생성되었습니다.'}
        } catch (error) {
            console.error(error)
            return {error: error.message}
        }
    }

    async chatList(room_id: number) {
        try {
            const chatList = await this.chat_room.find({
                where: {room_id: room_id},
                select: ["room_id", "title", "created_at"],
                order: {created_at: "ASC"},
            })
            return chatList;
        } catch (error) {
            console.log(error);
        }
    }

}