// src/campaigns/campaigns.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign } from './schemas/campaign.schema';
import { CreateCampaignDto } from './dto/create-campain.dto';
import { CampaignMessage } from 'src/campaign-mesage/schemas/campaign-message.schema';
import { Contact } from 'src/contacts/schemas/contact.schema';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<Campaign>,
    @InjectModel(CampaignMessage.name) private campaignMessageModel: Model<CampaignMessage>,
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
  ) {}

  async create(createCampaignDto: CreateCampaignDto, userId: string): Promise<Campaign> {
    const createdCampaign = new this.campaignModel({
      ...createCampaignDto,
      createdBy: userId,
    });
    return createdCampaign.save();
  }

  async findAll(workspaceId?: string): Promise<Campaign[]> {
  const query = workspaceId ? { workspaceId } : {};
  return this.campaignModel
    .find(query)
    .populate('templateId')
    .populate('workspaceId')
    .populate('createdBy')
    .exec();
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
  if (campaign.status !== 'Draft') throw new BadRequestException('Only draft campaigns can be launched');

  // 1. Update status + launchedAt
  campaign.status = 'Running';
  campaign.launchedAt = new Date();
  await campaign.save();

  // 2. Fetch contacts based on campaign.selectedTags
  // (replace with real ContactService or query)
  const contacts = await this.contactModel.find({ 
    workspaceId: campaign.workspaceId,
    tags: { $in: campaign.selectedTags }
  });

  // 3. Create campaign messages snapshot
  const messages = contacts.map(c => ({
    workspace: campaign.workspaceId,
    campaign: campaign._id,
    contactIds: [c._id],
    createdBy: userId,
    messageContent: `Hello ${c.name}, from ${campaign.name}`,
    sentAt: new Date()
  }));

  await this.campaignModel.insertMany(messages);

  // 4. Fake complete after 5s
  setTimeout(async () => {
    await this.campaignModel.findByIdAndUpdate(campaign._id, {
      status: 'Completed'
    });
  }, 5000);

  return campaign;
}

}
