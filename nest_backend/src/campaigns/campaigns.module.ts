// src/campaigns/campaigns.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignsService } from './campaigns.service';
import { CampaignsController } from './campaigns.controller';
import { Campaign, CampaignSchema } from './schemas/campain.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Campaign.name, schema: CampaignSchema }])],
  controllers: [CampaignsController],
  providers: [CampaignsService],
})
export class CampaignsModule {}
