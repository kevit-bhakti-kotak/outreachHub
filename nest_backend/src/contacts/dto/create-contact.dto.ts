import { IsArray, IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsMongoId()
  @IsNotEmpty()
  workspaceId: string;
}
