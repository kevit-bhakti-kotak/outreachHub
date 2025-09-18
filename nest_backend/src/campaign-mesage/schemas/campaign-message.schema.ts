import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class CampaignMessage extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Workspace', required: true })
  workspace: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Campaign', required: true })
  campaign: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Contact', required: true })
   contactIds: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ required: true })
  messageContent: string;

  @Prop({ default: Date.now })
  sentAt: Date;
}

export const CampaignMessageSchema = SchemaFactory.createForClass(CampaignMessage);
CampaignMessageSchema.index({ campaign: 1, contactIds: 1 });
