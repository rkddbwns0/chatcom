import {BadRequestException, Injectable} from "@nestjs/common";
import {UserEntity} from "../entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CreateUserDto} from "../dto/user.dto";
import * as bcrypt from 'bcrypt'
import {randomBytes, scrypt, createCipheriv} from 'crypto'
import {promisify} from 'util'
import {stringify} from "ts-jest";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly user: Repository<UserEntity>,
    ) {}

    async createUser(createUserDto: CreateUserDto) {
        try {
            await this.duplicateEmail(createUserDto.email);
            await this.duplicateNickname(createUserDto.nickname);
            const hashing = await this.hashData(createUserDto.password);
            const encrypt = await this.encryptData(createUserDto.resident_num)
            createUserDto.password = hashing
            createUserDto.resident_num = stringify(encrypt)

            const new_user = await this.user.create(createUserDto)
            const save_user = await this.user.save(new_user);

            return save_user
        } catch (error) {
            console.error(error)
        }
    }

    private async duplicateEmail(email: string) {
        try {
            const dupEmail = await this.user.findOne({where: {email: email}});

            if (dupEmail) {
                throw new BadRequestException("이미 가입된 이메일입니다.");
            }

            return true
        } catch (error) {
            console.error(error)
        }
    }

    private async duplicateNickname(nickname: string) {
        try {
            const dupNickname = await this.user.findOne({where: {nickname: nickname}});

            if (dupNickname) {
                throw new BadRequestException('이미 사용 중인 닉네임입니다.')
            }

            return true
        } catch (error) {
            console.error(error)
        }
    }

    private async hashData (password: string) {
        const hashPassword = await bcrypt.hash(password, 10);
        return hashPassword
    }

    private async encryptData (resident_num: string){
        const iv = randomBytes(16)

        const key = (await promisify(scrypt)(resident_num, 'salt', 32)) as Buffer;
        const cipher = createCipheriv('aes-256-ctr', key, iv)

        const encryptedText = Buffer.concat([
            cipher.update(resident_num),
            cipher.final()
        ])
        return encryptedText
    }
}