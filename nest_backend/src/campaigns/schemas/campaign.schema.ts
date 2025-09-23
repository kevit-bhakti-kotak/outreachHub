// src/campaigns/schemas/campaign.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Campaign extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ 
    type: String, 
    enum: ['Draft', 'Running', 'Completed'], 
    default: 'Draft' 
  })
  status: string;

  @Prop({ type: [String] })
  selectedTags: string[];

  @Prop({ type: Types.ObjectId, ref: 'MessageTemplate' })
  templateId: Types.ObjectId;

  @Prop()
  launchedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'Workspace', required: true })
  workspaceId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
CampaignSchema.index({ workspaceId: 1, status: 1 });