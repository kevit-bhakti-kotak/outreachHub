// src/message-templates/message-templates.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageTemplatesService } from './message-templates.service';
import { MessageTemplatesController } from './message-templates.controller';
import { MessageTemplate, MessageTemplateSchema } from './schemas/mesage-template.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MessageTemplate.name, schema: MessageTemplateSchema }]),AuthModule
  ],
  controllers: [MessageTemplatesController],
  providers: [MessageTemplatesService],
})
export class MessageTemplatesModule {}
