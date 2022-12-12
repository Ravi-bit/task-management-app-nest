import { Injectable, NotFoundException } from '@nestjs/common';
//import { Task, TaskStatus } from './task.model';
//import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Users } from 'src/auth/user.entity';

@Injectable()
export class TaskService {
 
  constructor(@InjectRepository(TaskRepository)
  private taskRepository: TaskRepository,
  ) { }

  //private Tasks: Task[] = [];

  /**
   * 
   * Section which doesn't use persistent data/ persistency
   * 
  public getAllTasks(): Task[] {
    return this.Tasks;
  }

  /**
   * Works as an and filter. it will search with the tasks which has both status mentioned and search keyword not or operation
  
  public getAllTasksWithFilters(getTaskFilterDto: GetTaskFilterDto): Task[] {
    let filterTasks: Task[] = this.getAllTasks();
    const { status, search } = getTaskFilterDto;
    if (status) {
      filterTasks = filterTasks.filter((task: Task) => task.status === status);
     } 
   
    if (search) {
      filterTasks = filterTasks.filter((task: Task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }
        return false;
      });
    }
    return filterTasks;
  }

  /**
  public createPost(title: string, description: string): Task {
    const task: Task = {
      id: uuid(),
      name: title,
      description,
      status: TaskStatus.OPEN,
    };
    this.Tasks.push(task);
    return task;
  }
  

  public createPost(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.Tasks.push(task);
    return task;
  }

  public getTaskById(id: string): Task {
    const found = this.Tasks.find((task) => task.id === id);
    if (!found) {
      throw new NotFoundException(`Task with id - ${id} is not found`);
    }
    return found;
  }

  public deleteTaskById(id: string): string {
    const found = this.getTaskById(id);
    this.Tasks = this.Tasks.filter((task) => task.id !== found.id);
    return `Task with id - ${id} deleted successfully`;
  }

  public updateTaskStatusById(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): string {
    const task: Task = this.getTaskById(id);

    /** 
     * Validation without Pipes and decorartors
     * 
    switch (updateTaskDto.status) {
      case 'OPEN':
        task.status = TaskStatus.OPEN;
        break;
      case 'CLOSED':
        task.status = TaskStatus.CLOSE;
        break;
      case 'IN_PROGRESS':
        task.status = TaskStatus.INPROGRESS;
        break;
      case 'DONE':
        task.status = TaskStatus.DONE;
        break;
      default:
        return `Error while updating status for task id - ${id} (No such status available)`;
    }
    
    task.status = updateTaskDto.status;
    return `Updated the status for the task id - ${id} successfully`;
  }
  */

  /**
   * 
   * Section which uses data persistency
   */
  
  public async getTaskById(id: string, user: Users) : Promise<Task> {
    return this.taskRepository.getTask(id, user);
  }


  
  public createPost(createTaskDto: CreateTaskDto, user :Users): Promise<Task> {
     return this.taskRepository.createTask(createTaskDto, user);
  }



  public async deleteTaskById(id: string, user:Users): Promise<void> {
    const task = await this.taskRepository.delete({id, user});
    if(task.affected === 0){
      throw new NotFoundException(`Task with id - ${id} not found`);
    }
  }


  public async updateTaskStatusById(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: Users
  ): Promise<Task> {
    const task = await this.taskRepository.getTask(id, user);
    task.status = updateTaskDto.status;
    return this.taskRepository.updateTask(task);
  }


  public getAllTasksWithFilters(filterDto: GetTaskFilterDto, user: Users): Promise<Task[]>{
    
     return this.taskRepository.getTasks(filterDto, user);
     
  }

}
