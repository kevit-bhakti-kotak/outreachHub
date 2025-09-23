import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Campaign } from '../campaigns/schemas/campaign.schema';
import { Contact } from '../contacts/schemas/contact.schema';
import { CampaignMessage } from '../campaign-mesage/schemas/campaign-message.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<Campaign>,
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
    @InjectModel(CampaignMessage.name) private messageModel: Model<CampaignMessage>,
  ) {}

  async getWorkspaceAnalytics(workspaceId: string, startDate?: string, endDate?: string) {
    const dateFilter: any = {};

    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // -------------------
    // Filters for different collections
    // -------------------
    const workspaceFilterString = { workspaceId }; // For Campaigns & Contacts
    // -------------------
    // Campaigns per day
    // -------------------
   const campaignsPerDay = await this.campaignModel.aggregate([
  { $match: { ...workspaceFilterString, ...dateFilter } },
  {
    $group: {
      _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
      count: { $sum: 1 },
    },
  },
  { $sort: { _id: 1 } },
  {
    $project: {
      _id: 0,
      date: '$_id',
      count: 1,
    },
  },
]);

    // -------------------
    // Messages by type (Text vs Text+Image)
    // -------------------
  // -------------------
// Messages by type (from MessageTemplate via Campaign)
// -------------------
const messagesByTypeRaw = await this.messageModel.aggregate([
  { $match: { workspace: workspaceId, ...dateFilter } },

  // Join with Campaign
  {
    $lookup: {
      from: 'campaigns',
      localField: 'campaign',
      foreignField: '_id',
      as: 'campaign',
    },
  },
  { $unwind: { path: '$campaign', preserveNullAndEmptyArrays: true } },

  // Convert campaign.templateId (string) -> ObjectId
  {
    $addFields: {
      campaignTemplateIdObj: {
        $cond: [
          { $eq: [{ $type: '$campaign.templateId' }, 'string'] },
          { $toObjectId: '$campaign.templateId' },
          '$campaign.templateId'
        ],
      },
    },
  },

  // Lookup MessageTemplate using converted ObjectId
  {
    $lookup: {
      from: 'messagetemplates',
      localField: 'campaignTemplateIdObj',
      foreignField: '_id',
      as: 'template',
    },
  },
  { $unwind: { path: '$template', preserveNullAndEmptyArrays: true } },

  // Group by template.type
  {
    $group: {
      _id: '$template.type',
      count: { $sum: 1 },
    },
  },
]);

const messagesByType = ['Text', 'Text+Image'].map(type => {
  // Map DB "Text-Image" → "Text+Image" for frontend
  const dbType = type === 'Text+Image' ? 'Text-Image' : type;
  const found = messagesByTypeRaw.find(m => m._id === dbType);
  return { type, count: found ? found.count : 0 };
});


    // -------------------
    // Contacts reached vs not reached
    // -------------------
    const reachedCount = await this.contactModel.countDocuments({
      ...workspaceFilterString,
      reached: true,
      ...dateFilter,
    });

    const notReachedCount = await this.contactModel.countDocuments({
      ...workspaceFilterString,
      reached: false,
      ...dateFilter,
    });

    // -------------------
    // Recent Campaigns
    // -------------------
    const recentCampaigns = await this.campaignModel
      .find({ ...workspaceFilterString, ...dateFilter })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name selectedTags createdAt')
      .lean();

    // -------------------
    // Top Tags
    // -------------------
const topTagsRaw = await this.campaignModel.aggregate([
  { $match: { ...workspaceFilterString, ...dateFilter } },
  { $unwind: '$selectedTags' },
  {
    $group: {
      _id: '$selectedTags',
      count: { $sum: 1 },
    },
  },
  { $sort: { count: -1 } },
  { $limit: 5 },
]);


    const topTags = topTagsRaw.map((t) => ({ tag: t._id, count: t.count }));

    // -------------------
    // Return full analytics
    // -------------------
    return {
  campaignsPerDay,
  messagesByType,
  contactsReached: {
    reached: reachedCount,
    notReached: notReachedCount,
  },
  recentCampaigns,
  topTags: topTagsRaw.map(t => ({ tag: t._id, count: t.count })),
};

  }
}
