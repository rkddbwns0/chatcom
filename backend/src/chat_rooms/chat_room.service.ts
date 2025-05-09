import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat_roomEntity } from '../entities/chat_room.entity';
import { In, Repository } from 'typeorm';
import { RoomMebersEntity } from '../entities/room_members.entity';
import { FriendsEntity } from '../entities/friends.entity';
import { ChatType, CreateRoomDto } from './chat_room.dto';
import { UserEntity } from '../entities/user.entity';
import { ChatLog, ChatLogDocument } from 'src/chat_log/schema/chat_log.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { r } from 'react-router/dist/development/fog-of-war-D4x86-Xc';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectRepository(Chat_roomEntity)
    private readonly chat_room: Repository<Chat_roomEntity>,

    @InjectRepository(RoomMebersEntity)
    private readonly room_members: Repository<RoomMebersEntity>,

    @InjectRepository(FriendsEntity)
    private readonly friends: Repository<FriendsEntity>,

    @InjectRepository(UserEntity)
    private readonly user: Repository<UserEntity>,

    @InjectModel(ChatLog.name)
    private readonly chatLog: Model<ChatLogDocument>,
  ) {}

  async createRoom(createRoomDto: CreateRoomDto) {
    try {
      const users = await Promise.all(
        createRoomDto.user_id.map((user_id) => {
          return this.user.findOne({
            where: { user_id: user_id },
            select: ['user_id', 'nickname', 'name', 'email'],
          });
        }),
      );

      const userFilter = users.filter((user): user is UserEntity => !!user);

      if (userFilter.length !== createRoomDto.user_id.length) {
        throw new BadRequestException(
          '존재하지 않은 유저가 있습니다. 다시 생성해 주세요.',
        );
      }

      if (createRoomDto.user_id.length === 2) {
        createRoomDto.chat_type = ChatType.one_to_one;

        const createRooms = this.chat_room.create({
          title: createRoomDto.title,
        });
        const saveRoom = await this.chat_room.save(createRooms);

        const createRoomMembers = userFilter.map((userEntity) => {
          return this.room_members.save({
            room_id: saveRoom,
            user_id: userEntity,
          });
        });
        return { message: '채팅방이 생성되었습니다.' };
      } else if (createRoomDto.user_id.length > 2) {
        createRoomDto.chat_type = ChatType.group;

        const title = users.map((user) => user?.nickname);
        createRoomDto.title = title.join(', ');

        const createRooms = this.chat_room.create({
          title: createRoomDto.title,
        });
        const saveRoom = await this.chat_room.save(createRooms);

        const createRoomMembers = userFilter.map((userEntity) => {
          return this.room_members.save({
            room_id: saveRoom,
            user_id: userEntity,
          });
        });

        return { message: '채팅방이 생성되었습니다.' };
      } else {
        throw new BadRequestException(
          '채팅방을 생성하기 위한 유저가 없습니다. 다시 확인해 주세요.',
        );
      }
    } catch (error) {
      console.error(error);
      return { error: error.message };
    }
  }

  async chatList(user_id: number) {
    try {
      const chatList = await this.room_members
        .createQueryBuilder('room_members')
        .leftJoinAndSelect('room_members.room_id', 'chat_room')
        .leftJoinAndSelect('room_members.user_id', 'user')
        .leftJoin('friends', 'friend', 'friend.user_id = room_members.user_id')
        .select([
          'room_members.room_id as room_id',
          `(SELECT COUNT(*) FROM room_members WHERE room_members.room_id = room_members.room_id) as count`,
          'COALESCE(chat_room.title, chat_room.title, friend.alias) as title',
          'chat_room.chat_type as chat_type',
        ])
        .where('room_members.user_id = :user_id', { user_id: user_id })
        .groupBy(
          'room_members.room_id,chat_room.title, friend.alias, chat_room.chat_type',
        )
        .getRawMany();

      const list_map = chatList.map((chat) => chat.room_id);

      const chatLog = await this.chatLog.find({
        where: { room_id: In(list_map) },
        order: { created_at: -1 },
      });
      return { chatList: chatList, chatLog: chatLog };
    } catch (error) {
      console.log(error);
    }
  }
}
