// src/workspaces/dto/add-users.dto.ts
import { IsArray, IsEmail } from 'class-validator';

export class AddUsersDto {
  @IsArray()
  @IsEmail({}, { each: true })
  emails: string[];
}
