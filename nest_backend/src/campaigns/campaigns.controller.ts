// src/campaigns/campaigns.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards, Req, Query } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campain.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('campaigns')
@UseGuards(JwtAuthGuard)
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  async create(@Body() dto: CreateCampaignDto, @Req() req) {
    return this.campaignsService.create(dto, req.user.userId);
  }

 @Get()
async findAll(@Query('workspaceId') workspaceId?: string) {
  return this.campaignsService.findAll(workspaceId);
}


  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.campaignsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<CreateCampaignDto>) {
    return this.campaignsService.update(id, dto);
  }

  @Patch(':id/launch')
  async launch(@Param('id') id: string, @Req() req) {
  return this.campaignsService.launchCampaign(id, req.user._id);
}


  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.campaignsService.remove(id);
  }
}
