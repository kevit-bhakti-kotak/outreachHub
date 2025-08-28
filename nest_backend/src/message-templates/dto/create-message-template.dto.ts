// src/message-templates/dto/create-message-template.dto.ts
import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class CreateMessageTemplateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsMongoId()
  @IsNotEmpty()
  campaignId: string;
}
