import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { Users } from 'src/auth/user.entity';
import { Logger } from '@nestjs/common';

@Controller('task')
@UseGuards(AuthGuard())
export class TaskController {

  private logger = new Logger('TasksController');
  constructor(private taskService: TaskService) {}


  /**
   * 
   * Section which doesn't use any persistent data
   * 
  @Get()
  public getTasks(@Query() getTaskFilterDto: GetTaskFilterDto): Task[] {
    if (Object.keys(getTaskFilterDto).length > 0) {
      return this.taskService.getAllTasksWithFilters(getTaskFilterDto);
    }
    return this.taskService.getAllTasks();
  }

  /**
   * @Post()
  public createTask(
    @Body('name') title: string,
    @Body('description') description: string,
  ): Task {
    return this.taskService.createPost(title, description);
  }
  

  @Post()
  public createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.taskService.createPost(createTaskDto);
  }

  @Get('/:id')
  public getTaskById(@Param('id') id: string): Task {
    return this.taskService.getTaskById(id);
  }

  @Delete('/:id')
  public deleteTaskById(@Param('id') id: string): string {
    return this.taskService.deleteTaskById(id);
  }

  /**
   *
   * Using DTO's here won't matter much, because there are only two distinct parameters, it's better to use
   * DTO's when we have multiple body or param fields
   
  @Patch('/:id/status')
  public updateStatusOfTask(
    @Param('id') id: string,
    //@Body('status') status: TaskStatus,
    @Body() updateTaskDto: UpdateTaskDto,
  ): string {
    return this.taskService.updateTaskStatusById(id, updateTaskDto);
  }

  */


  /**
   * 
   * This section uses the persistent data.
   * 
   */

  @Get('/:id')
  public getTaskById(@Param('id') id: string, @GetUser() user: Users): Promise<Task> {
    return this.taskService.getTaskById(id, user);
  }

  @Get()
  public getTasks(@Query() filterDto: GetTaskFilterDto, @GetUser() user: Users): Promise<Task[]> {
      this.logger.verbose(
        `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(
          filterDto,
        )}`,
      );
      return this.taskService.getAllTasksWithFilters(filterDto, user);
  }

  @Post()
  public createTask(@Body() createTaskDto: CreateTaskDto,
  @GetUser() user: Users): Promise<Task> {
    this.logger.verbose(
      `User "${user.username}" creating a new task. Data: ${JSON.stringify(
        createTaskDto,
      )}`,
    );
    return this.taskService.createPost(createTaskDto, user);
  }

  @Delete('/:id')
  public deleteTask(@Param('id') id: string, @GetUser() user: Users): Promise<void> {
    return this.taskService.deleteTaskById(id, user);
  }

  @Patch('/:id/status')
  public updateStatusOfTask(
    @Param('id') id: string,
    //@Body('status') status: TaskStatus,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: Users
  ): Promise<Task> {
    return this.taskService.updateTaskStatusById(id, updateTaskDto, user);
  }

}
