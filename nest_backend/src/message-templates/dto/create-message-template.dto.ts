import {
  IsString,
  IsNotEmpty,
  IsEnum,
  ValidateNested,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

class MessageContentDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class CreateMessageTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(['Text', 'Text-Image'], { message: 'type must be either Text or Text-Image' })
  type: 'Text' | 'Text-Image';

  @ValidateNested()
  @Type(() => MessageContentDto)
  message: MessageContentDto;

  @IsMongoId({ message: 'Invalid workspaceId format' })
  workspaceId: string;

  @IsOptional()
  @IsMongoId({ message: 'Invalid createdBy format' })
  createdBy?: string;
}