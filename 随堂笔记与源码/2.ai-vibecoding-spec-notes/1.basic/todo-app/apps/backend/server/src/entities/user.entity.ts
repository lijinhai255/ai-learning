import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { TodoEntity } from './todo.entity'

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true })
    username: string

    @Column()
    password: string

    @CreateDateColumn()
    createdAt: Date

    @OneToMany(() => TodoEntity, todo => todo.user)
    todos: TodoEntity[]
}
