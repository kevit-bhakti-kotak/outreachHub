import { IsString, IsEmail, IsOptional, IsBoolean, IsArray, ValidateNested, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

class WorkspaceDto {
  @IsMongoId()
  @IsOptional()
  workspaceId?: string;

  @IsString()
  @IsOptional()
  role?: 'Editor' | 'Viewer';
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  passwordHash?: string; // or newPassword if you want to rename it for clarity

  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkspaceDto)
  @IsOptional()
  workspaces?: WorkspaceDto[];
}
