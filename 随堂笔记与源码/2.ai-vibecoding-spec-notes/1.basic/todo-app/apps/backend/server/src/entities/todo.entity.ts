import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { UserEntity } from './user.entity'

@Entity('todos')
export class TodoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    title: string

    @Column({ default: false })
    completed: boolean

    @Column({ default: false })
    important: boolean

    @Column()
    userId: string

    @ManyToOne(() => UserEntity, user => user.todos)
    @JoinColumn({ name: 'userId' })
    user: UserEntity

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
