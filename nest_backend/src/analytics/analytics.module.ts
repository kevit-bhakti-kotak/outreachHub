import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Campaign, CampaignSchema } from 'src/campaigns/schemas/campaign.schema';
import { Contact, ContactSchema } from 'src/contacts/schemas/contact.schema';
import { CampaignMessage, CampaignMessageSchema } from 'src/campaign-mesage/schemas/campaign-message.schema';
import { MessageTemplate, MessageTemplateSchema } from 'src/message-templates/schemas/mesage-template.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [ AuthModule,
    MongooseModule.forFeature([
      { name: Campaign.name, schema: CampaignSchema },
      { name: Contact.name, schema: ContactSchema },
      { name: CampaignMessage.name, schema: CampaignMessageSchema },
      { name: MessageTemplate.name, schema: MessageTemplateSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}