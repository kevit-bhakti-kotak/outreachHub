import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsArray, ValidateNested, IsMongoId, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

class WorkspaceAssignmentDto {
  @IsMongoId()
  workspaceId: string;

  @IsString()
  @IsIn(['Editor', 'Viewer'])
  role: 'Editor' | 'Viewer';
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(10)
  phoneNumber: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  isAdmin?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkspaceAssignmentDto)
  workspaces?: WorkspaceAssignmentDto[];
}
