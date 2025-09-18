// src/campaigns/campaigns.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignsService } from './campaigns.service';
import { CampaignsController } from './campaigns.controller';
import { Campaign, CampaignSchema } from './schemas/campaign.schema';
import { AuthModule } from 'src/auth/auth.module';
import { CampaignMessage, CampaignMessageSchema } from 'src/campaign-mesage/schemas/campaign-message.schema';
import { Contact, ContactSchema } from 'src/contacts/schemas/contact.schema';
import { MessageTemplate, MessageTemplateSchema } from 'src/message-templates/schemas/mesage-template.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Campaign.name, schema: CampaignSchema },{ name: CampaignMessage.name, schema: CampaignMessageSchema },{ name: Contact.name, schema: ContactSchema },{name: MessageTemplate.name, schema: MessageTemplateSchema},]),AuthModule],
  controllers: [CampaignsController],
  providers: [CampaignsService],
})
export class CampaignsModule {}
