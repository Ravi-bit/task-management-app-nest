import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Task } from 'src/task/task.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  //eager true means whenever we retrieve user entity from DB, we retrieve tasks related to that user as well. if false we don't fetch tasks
  @OneToMany((_type) => Task, (task) => task.user, { eager: true })
  tasks: Task[];
}