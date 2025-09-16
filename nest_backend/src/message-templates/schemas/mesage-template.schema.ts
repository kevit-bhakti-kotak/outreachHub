import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type MessageTemplateDocument = MessageTemplate & Document;

class MessageContent {
  @Prop({ required: true })
  text: string;

  @Prop({ required: false })
  imageUrl?: string;
}

@Schema({ timestamps: true })
export class MessageTemplate {
  @Prop({ required: true })
  name: string;

  @Prop({ type: String, enum: ['Text', 'Text-Image'], required: true })
  type: 'Text' | 'Text-Image';

  @Prop({ type: MessageContent, required: true })
  message: MessageContent;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Workspace', required: true })
  workspaceId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: false })
  createdBy: mongoose.Types.ObjectId;
}

export const MessageTemplateSchema = SchemaFactory.createForClass(MessageTemplate);

MessageTemplateSchema.index({ workspaceId: 1, type: 1 });