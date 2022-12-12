import { IsOptional, IsEnum, IsString } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

/**
 * symbol '?' is to show that the property is optional and not required but that is
 * not available at run time. so we can use class decorators and validation pipes
 *
 */

export class GetTaskFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
