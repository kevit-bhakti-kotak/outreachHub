// src/message-templates/dto/update-message-template.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageTemplateDto } from './create-message-template.dto';

export class UpdateMessageTemplateDto extends PartialType(CreateMessageTemplateDto) {}
