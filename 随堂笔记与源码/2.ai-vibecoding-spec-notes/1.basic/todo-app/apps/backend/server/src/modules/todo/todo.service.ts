import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { TodoEntity } from '../../entities/todo.entity'
import { CreateTodoDto } from './dto/create-todo.dto'
import { UpdateTodoDto } from './dto/update-todo.dto'

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(TodoEntity)
        private readonly todoRepository: Repository<TodoEntity>
    ) {}

    findAll(userId: string) {
        return this.todoRepository.find({ where: { userId }, order: { createdAt: 'DESC' } })
    }

    findOne(userId: string, id: string) {
        return this.todoRepository.findOne({ where: { id, userId } })
    }

    create(userId: string, dto: CreateTodoDto) {
        const todo = this.todoRepository.create({ ...dto, userId })
        return this.todoRepository.save(todo)
    }

    async update(userId: string, id: string, dto: UpdateTodoDto) {
        const todo = await this.findOne(userId, id)
        if (!todo) {
            throw new NotFoundException('Todo 不存在')
        }

        Object.assign(todo, dto)
        return this.todoRepository.save(todo)
    }

    async remove(userId: string, id: string) {
        const todo = await this.findOne(userId, id)
        if (!todo) {
            throw new NotFoundException('Todo 不存在')
        }

        await this.todoRepository.remove(todo)
        return { id }
    }
}
