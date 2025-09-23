// src/message-templates/message-templates.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageTemplate, MessageTemplateDocument } from './schemas/mesage-template.schema';
import { CreateMessageTemplateDto } from './dto/create-message-template.dto';
import { UpdateMessageTemplateDto } from './dto/update-message-template.dto';

@Injectable()
export class MessageTemplatesService {
  constructor(
    @InjectModel(MessageTemplate.name) private templateModel: Model<MessageTemplateDocument>,
  ) {}
  
  async create(dto: CreateMessageTemplateDto, userId: string): Promise<MessageTemplate> {
    const created = new this.templateModel({ ...dto, createdBy: userId });
    return created.save();
  }

  async findAll(): Promise<MessageTemplate[]> {
    return this.templateModel.find()
      .populate('createdBy')
      .exec();
  }

  async findByCampaign(campaignId: string): Promise<MessageTemplate[]> {
    return this.templateModel.find({ campaignId })
      .populate('createdBy')
      .exec();
  }
 async findByWorkspace(workspaceId: string) {
  return this.templateModel.find({ workspaceId }).exec();
}


  async findOne(id: string): Promise<MessageTemplate | null> {
    return this.templateModel.findById(id).exec();
  }

  async update(id: string, dto: UpdateMessageTemplateDto): Promise<MessageTemplate | null> {
    return this.templateModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async remove(id: string): Promise<any> {
    return this.templateModel.findByIdAndDelete(id).exec();
  }
}
