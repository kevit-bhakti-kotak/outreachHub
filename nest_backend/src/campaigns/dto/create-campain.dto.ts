// src/campaigns/dto/create-campaign.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsMongoId, IsIn } from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsMongoId()
  @IsNotEmpty()
  workspaceId: string;

  @IsIn(['draft', 'active', 'completed'])
  @IsOptional()
  status?: string;
}
