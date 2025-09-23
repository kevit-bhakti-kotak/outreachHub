import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CampaignMessage } from './schemas/campaign-message.schema';
import { CreateCampaignMessageDto } from './dto/create-campaign-message.dto';
import { UpdateCampaignMessageDto } from './dto/update-campaign-message.dto';

@Injectable()
export class CampaignMesageService {
  constructor(
    @InjectModel(CampaignMessage.name)
    private campaignMessageModel: Model<CampaignMessage>,
  ) {}

  /** Create a new campaign message */
  async create(dto: CreateCampaignMessageDto & { campaign: string; createdBy: string; workspace: string }): Promise<CampaignMessage> {
    const msg = new this.campaignMessageModel({
      ...dto,
      campaign: new Types.ObjectId(dto.campaign),
      createdBy: new Types.ObjectId(dto.createdBy),
      workspace: new Types.ObjectId(dto.workspace),
    });
    return msg.save();
  }

  /** List messages under a campaign with pagination */
  async findByCampaign(
    campaignId: string,
    page = 1,
    limit = 10
  ): Promise<{ data: CampaignMessage[]; total: number; page: number; limit: number }> {
    const cId = new Types.ObjectId(campaignId);

    const [data, total] = await Promise.all([
      this.campaignMessageModel
        .find({ campaign: cId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('createdBy workspace campaign')
        .exec(),
      this.campaignMessageModel.countDocuments({ campaign: cId }),
    ]);

    return { data, total, page, limit };
  }

  /** Get a single message */
  async findOne(id: string): Promise<CampaignMessage> {
    const msg = await this.campaignMessageModel.findById(id).exec();
    if (!msg) throw new NotFoundException('Message not found');
    return msg;
  }

  /** Update a message */
  async update(id: string, updateDto: UpdateCampaignMessageDto): Promise<CampaignMessage> {
    const updated = await this.campaignMessageModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Message not found');
    return updated;
  }

  /** Delete a message */
  async remove(id: string): Promise<CampaignMessage> {
    const deleted = await this.campaignMessageModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Message not found');
    return deleted;
  }
}
