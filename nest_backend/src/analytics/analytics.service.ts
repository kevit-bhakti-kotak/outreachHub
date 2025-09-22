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
    const workspaceFilterObjectId = { workspace: new Types.ObjectId(workspaceId) }; // For CampaignMessages

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
    ]);

    // -------------------
    // Messages by type (Text vs Text+Image)
    // -------------------
    const messagesByTypeRaw = await this.messageModel.aggregate([
  { $match: { workspace: workspaceFilterObjectId } },
  {
    $group: {
      _id: {
        day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        type: "$type"
      },
      count: { $sum: 1 }
    }
  },
  { $sort: { "_id.day": 1 } }
]);

    const messagesByType = ['Text', 'Text+Image'].map(type => {
  const count = messagesByTypeRaw
    .filter(m => m._id.type === type)
    .reduce((sum, m) => sum + m.count, 0);
  return { type, count };
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
      .select('name tags createdAt')
      .lean();

    // -------------------
    // Top Tags
    // -------------------
    const topTagsRaw = await this.contactModel.aggregate([
      { $match: { ...workspaceFilterString, ...dateFilter } },
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
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
      topTags,
    };
  }
}
