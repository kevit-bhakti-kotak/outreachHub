// src/message-templates/schemas/message-template.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageTemplateDocument = MessageTemplate & Document;

@Schema({ timestamps: true })
export class MessageTemplate {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'Campaign', required: true })
  campaignId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const MessageTemplateSchema = SchemaFactory.createForClass(MessageTemplate);
