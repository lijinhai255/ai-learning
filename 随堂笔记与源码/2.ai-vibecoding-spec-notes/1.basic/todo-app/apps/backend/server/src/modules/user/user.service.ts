import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserEntity } from '../../entities/user.entity'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {}

    findByUsername(username: string) {
        return this.userRepository.findOne({ where: { username } })
    }

    findById(id: string) {
        return this.userRepository.findOne({ where: { id } })
    }

    create(username: string, password: string) {
        const user = this.userRepository.create({ username, password })
        return this.userRepository.save(user)
    }
}
