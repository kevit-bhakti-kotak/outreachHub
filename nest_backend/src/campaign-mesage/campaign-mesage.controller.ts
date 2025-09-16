import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Req,
  UseGuards,
  HttpException,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CampaignMesageService } from './campaign-mesage.service';
import { CreateCampaignMessageDto } from './dto/create-campaign-message.dto';
import { UpdateCampaignMessageDto } from './dto/update-campaign-message.dto';
import mongoose from 'mongoose';

@Controller('campaigns/:campaignId/messages')
@UseGuards(JwtAuthGuard)
export class CampaignMesageController {
  constructor(private readonly campaignMessageService: CampaignMesageService) {}

  /** Create a new message under a campaign */
  @Post()
  async create(
    @Param('campaignId') campaignId: string,
    @Body() dto: CreateCampaignMessageDto,
    @Req() req: any
  ) {
    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      throw new HttpException('Invalid campaign id', 400);
    }

    return this.campaignMessageService.create({
      ...dto,
      campaign: campaignId,        // 👈 from URL
      createdBy: req.user.userId,  // 👈 logged-in user
      workspace: dto.workspace,    // 👈 still from body
    });
  }

  /** List messages for a campaign with pagination */
  @Get()
  async findByCampaign(
    @Param('campaignId') campaignId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ) {
    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      throw new HttpException('Invalid campaign id', 400);
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    return this.campaignMessageService.findByCampaign(
      campaignId,
      pageNum,
      limitNum
    );
  }

  /** Get a single message by ID */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid message id', 400);
    }

    return this.campaignMessageService.findOne(id);
  }

  /** Update a message */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCampaignMessageDto
  ) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid message id', 400);
    }

    return this.campaignMessageService.update(id, updateDto);
  }

  /** Delete a message */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid message id', 400);
    }

    return this.campaignMessageService.remove(id);
  }
}
