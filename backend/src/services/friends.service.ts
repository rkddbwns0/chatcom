import {BadRequestException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../entities/user.entity";
import {DataSource, Repository} from "typeorm";
import {FriendsEntity} from "../entities/friends.entity";
import {ResponseFriendDto, SendFriendDto} from "../dto/friends.dto";
import {Friends_requestsEntity} from "../entities/friends_requests.entity";

@Injectable()
export class FriendsService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly user: Repository<UserEntity>,

        @InjectRepository(FriendsEntity)
        private readonly friends: Repository<FriendsEntity>,

        @InjectRepository(Friends_requestsEntity)
        private readonly friends_requests: Repository<Friends_requestsEntity>,

        private readonly dataSource: DataSource
    ) {}

    async sendFreind(sendFriendDto: SendFriendDto) {
        try {
            const send_user = await this.user.findOne({where: {user_id: sendFriendDto.send_id.user_id}})
            const receiver_user = await this.user.findOne({where: {user_id: sendFriendDto.receiver_id.user_id}})
            const duplicate_request = await this.friends_requests.findOne({where: {send_id: sendFriendDto.send_id, receiver_id: sendFriendDto.receiver_id}})
            const duplicate_friend = await this.friends.findOne({
                where: {
                    user_id: sendFriendDto.send_id || sendFriendDto.receiver_id,
                    friend_id: sendFriendDto.send_id || sendFriendDto.receiver_id,
                },
            })

            if (!send_user) {
                throw new BadRequestException('존재하지 않는 유저입니다.')
            }
            if (!receiver_user) {
                throw new BadRequestException('존재하지 않는 유저입니다. 요청을 보낼 수 없습니다.')
            }
            if (duplicate_friend) {
                throw new BadRequestException('이미 친구 상태인 유저입니다.')
            }
            if (duplicate_request) {
                throw new BadRequestException('이미 친구 요청을 보낸 상태입니다.')
            }

            const send_request = await this.friends_requests.create(sendFriendDto);
            await this.friends_requests.save(send_request);

            return {message: '친구 요청을 보냈습니다.'}
        } catch (error) {
            console.log(error);
            return {error: error.message}
        }
    }

    async responseFriend(responseFriendDto: ResponseFriendDto) {
        try {
            const findRequest = await this.friends_requests.findOne({
                where: {
                    send_id: responseFriendDto.send_id.send_id,
                    receiver_id: responseFriendDto.receiver_id.receiver_id,
                },
                relations: ['send_id', 'receiver_id']
            })

            if (!findRequest) {
                throw new BadRequestException('유효하지 않은 요청입니다.');
            }

            const queryRunner =  this.dataSource.manager.connection.createQueryRunner()
            await queryRunner.startTransaction()

            try {
                const responseRepo = queryRunner.manager.getRepository(FriendsEntity);
                const requestRepo = queryRunner.manager.getRepository(Friends_requestsEntity);

                if(responseFriendDto.status === '수락') {
                    const addFriend1 = responseRepo.create({
                        user_id: responseFriendDto.send_id,
                        friend_id: responseFriendDto.receiver_id,
                        with_friend_state: true,
                        alias: findRequest.receiver_id.nickname
                    });

                    const addFriend2 = responseRepo.create({
                        user_id: responseFriendDto.receiver_id,
                        friend_id: responseFriendDto.send_id,
                        with_friend_state: true,
                        alias: findRequest.send_id.nickname
                    });

                    await responseRepo.save([addFriend1, addFriend2])
                    await requestRepo.delete(findRequest.id)

                    await queryRunner.commitTransaction()
                } else if (responseFriendDto.status === '거절') {
                    await requestRepo.delete(findRequest)
                    await queryRunner.commitTransaction()
                } else {
                    throw new BadRequestException('유효하지 않은 요청 방식입니다.')
                }
            } catch (error) {
                await queryRunner.rollbackTransaction()
                console.log(error);
                throw new BadRequestException('요청 처리가 실패되었습니다. 다시 시도해 주세요.')
            } finally {
                await queryRunner.release()
            }
        } catch (error) {
            console.log(error);
        }
    }
}