import { Module , Injectable} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './task.controller';
import { TaskRepository } from './task.repository';
import { AuthModule } from 'src/auth/auth.module';
import { TaskService } from './task.service';

@Module({
  imports :[
    TypeOrmModule.forFeature([TaskRepository]),
    AuthModule
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
