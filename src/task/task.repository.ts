import { EntityRepository, Repository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from './dto/create-task.dto';
import {  TaskStatus } from './task-status.enum';
import { NotFoundException, Logger, InternalServerErrorException } from "@nestjs/common";
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { Users } from "src/auth/user.entity";

/**
 * 
 * if we are using latest typeorm and entity repository is showing deprecated
 * then we can inject like constructor(@InjectRepository(TaskRepository)
  private taskRepository: Repository<Task
 * 
 */
@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{
    
    private logger = new Logger('TasksRepository', true);

    public async getTasks(filterDto: GetTaskFilterDto, user:Users): Promise<Task[]>{
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');
        query.where({ user });
        if(status){
           query.andWhere('task.status = :value', {value : status});
        }
        if(search){
            query.andWhere('(task.title ilike :value or task.description ilike :value)',{
                value : `%${search}%`
            });
            
            /** 
            query.andWhere('LOWER(task.title) like LOWER(:value) or LOWER(task.description) ilike LOWER():value)',{
                value : `%${search}%`
            });
            */
        }

        try {
            const tasks = await query.getMany();
            return tasks;
        } catch (error) {
            this.logger.error(
              `Failed to get tasks for user "${
                user.username
              }". Filters: ${JSON.stringify(filterDto)}`,
              error.stack,
            );
            throw new InternalServerErrorException();
        }

    }




    public async getTask(id: string, user: Users): Promise<Task> {
        const found = await this.findOne({ where: { id, user } });
        /** 
         * both works the same
         * 
        const found = await this.findOne({ id, user });
        */
        if (!found) {
            throw new NotFoundException(`Task with id - ${id} is not found`);
        }
        return found;
    }



    public async createTask(createTaskDto: CreateTaskDto, user: Users): Promise<Task> {
        const { title, description } = createTaskDto;
        const task = this.create({
            title,
            description,
            status: TaskStatus.OPEN,
            user
        });
        
        await this.save(task);
        return task;
    }

    
   public async updateTask(task): Promise<Task> {
      const updated = await this.save(task);
      return updated;
   }

}
