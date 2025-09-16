// src/campaigns/dto/create-campaign.dto.ts
import { IsString, IsOptional, IsEnum, IsArray, IsMongoId, IsDateString } from 'class-validator';

export class CreateCampaignDto {
  @IsString()
   name: string;

  @IsOptional()
  @IsString()
   description?: string;

  @IsOptional()
  @IsEnum(['Draft', 'Running', 'Completed'])
   status?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
   selectedTags?: string[];

  @IsOptional()
   templateId?: string;

  @IsOptional()
  readonly workspaceId?: string;

   @IsOptional()
  readonly createdBy?: string;
}
