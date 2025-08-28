// src/campaigns/campaigns.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign, CampaignDocument } from './schemas/campain.schema';
import { CreateCampaignDto } from './dto/create-campain.dto';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
  ) {}

  async create(createCampaignDto: CreateCampaignDto, userId: string): Promise<Campaign> {
    const createdCampaign = new this.campaignModel({
      ...createCampaignDto,
      createdBy: userId,
    });
    return createdCampaign.save();
  }

  async findAll(): Promise<Campaign[]> {
    return this.campaignModel.find().populate('workspaceId').populate('createdBy').exec();
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
}
