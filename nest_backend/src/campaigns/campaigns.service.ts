// src/campaigns/campaigns.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Campaign } from './schemas/campaign.schema';
import { CreateCampaignDto } from './dto/create-campain.dto';
import { CampaignMessage } from 'src/campaign-mesage/schemas/campaign-message.schema';
import { Contact } from 'src/contacts/schemas/contact.schema';
import { MessageTemplate } from 'src/message-templates/schemas/mesage-template.schema';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<Campaign>,
    @InjectModel(CampaignMessage.name) private campaignMessageModel: Model<CampaignMessage>,
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
    @InjectModel(MessageTemplate.name) private templateModel: Model<MessageTemplate>, 
  ) {}
  

  async create(createCampaignDto: CreateCampaignDto, userId: string): Promise<Campaign> {
    const createdCampaign = new this.campaignModel({
      ...createCampaignDto,
      createdBy: userId,
    });
    return createdCampaign.save();
  }

  async findAll(workspaceId?: string, page?: number, limit?: number): Promise<{ data: Campaign[]; total: number }> {
    const query = workspaceId ? { workspaceId } : {};
    const skip = page && limit ? (page - 1) * limit : 0;
    const campaignsQuery = this.campaignModel.find(query)
      .populate('templateId')
      .populate('workspaceId')
      .populate('createdBy')
      .skip(skip)
      .limit(limit || 0);

    const [data, total] = await Promise.all([
      campaignsQuery.exec(),
      this.campaignModel.countDocuments(query).exec(),
    ]);

    return { data, total };
  }

  async findOne(id: string): Promise<Campaign | null> {
    return this.campaignModel.findById(id).exec();
  }

  async update(id: string, updateDto: Partial<CreateCampaignDto>): Promise<Campaign | null> {
    return this.campaignModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
  }

  async remove(id: string): Promise<any> {
    return this.campaignModel.findByIdAndDelete(id).exec();
  }

  async launchCampaign(id: string, userId: string) {
    const campaign = await this.campaignModel.findById(id);
    if (!campaign) throw new NotFoundException('Campaign not found');
    if (campaign.status !== 'Draft') {
      throw new BadRequestException('Only draft campaigns can be launched');
    }

    // 1. Update status + launchedAt
    campaign.status = 'Running';
    campaign.launchedAt = new Date();
    await campaign.save();

    // 2. Populate template if available
    let template: MessageTemplate | null = null;
    if (campaign.templateId) {
      template = await this.templateModel.findById(campaign.templateId);
    }

    // 3. Fetch contacts based on tags
    const contacts = await this.contactModel.find({
      workspaceId: campaign.workspaceId,
      tags: { $in: campaign.selectedTags },
    });

    // 4. Create ONE campaign message with ALL contact IDs
    const campaignMessage = {
      workspace: campaign.workspaceId,
      campaign: campaign._id,
      contactIds: contacts.map(c => c._id), // All contact IDs in one array
      createdBy: new Types.ObjectId(userId), // Consistent createdBy
      messageContent: template
        ? template.message.text.replace('{{name}}', 'there') // Generic personalization
        : `Hello there, from ${campaign.name}`, // Generic message
      sentAt: new Date(),
    };

    await this.campaignMessageModel.create(campaignMessage);

    // 5. Fake complete after 5s (simulate async send)
    setTimeout(async () => {
      await this.campaignModel.findByIdAndUpdate(campaign._id, {
        status: 'Completed',
      });
    }, 5000);

    return campaign;
  }

async copyCampaign(id: string, userId: string) {
  const original = await this.campaignModel.findById(id);
  if (!original) throw new NotFoundException('Campaign not found');

  const copy = new this.campaignModel({
    name: `${original.name} (Copy)`,
    description: original.description,
    selectedTags: original.selectedTags,
    templateId: (original.templateId as any)?._id || original.templateId,
    workspaceId: (original.workspaceId as any)?._id || original.workspaceId,

    createdBy: new Types.ObjectId(userId),
    status: 'Draft',
  });

  return copy.save();
}
}
