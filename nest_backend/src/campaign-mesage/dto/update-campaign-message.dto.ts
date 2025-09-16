import { PartialType } from '@nestjs/mapped-types';
import { CreateCampaignMessageDto } from './create-campaign-message.dto';

export class UpdateCampaignMessageDto extends PartialType(CreateCampaignMessageDto) {}