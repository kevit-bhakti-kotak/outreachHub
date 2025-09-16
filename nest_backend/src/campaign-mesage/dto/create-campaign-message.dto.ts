// campaign-messages/dto/create-campaign-message.dto.ts
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCampaignMessageDto {

  @IsNotEmpty()
  workspace: string; // ObjectId of the workspace

  @IsArray()
  @IsNotEmpty()
  contactIds: string[]; // array of ObjectIds of contacts

  @IsString()
  @IsNotEmpty()
  messageContent: string;

  @IsOptional()
  sentAt?: Date; // optional, defaults to now;
}