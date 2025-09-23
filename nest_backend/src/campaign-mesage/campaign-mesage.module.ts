import { Module } from '@nestjs/common';
import { CampaignMesageController } from './campaign-mesage.controller';
import { CampaignMesageService } from './campaign-mesage.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignMessage, CampaignMessageSchema } from './schemas/campaign-message.schema';
import {  Campaign, CampaignSchema,  } from '../campaigns/schemas/campaign.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[
    AuthModule,
    MongooseModule.forFeature([
    {name: CampaignMessage.name , schema: CampaignMessageSchema},
    {name: Campaign.name, schema: CampaignSchema}
  ])],
  controllers: [CampaignMesageController],
  providers: [CampaignMesageService]
})
export class CampaignMessageModule {}