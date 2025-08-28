// src/message-templates/message-templates.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Patch, Req, UseGuards } from '@nestjs/common';
import { MessageTemplatesService } from './message-templates.service';
import { CreateMessageTemplateDto } from './dto/create-message-template.dto';
import { UpdateMessageTemplateDto } from './dto/update-message-template.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('message-templates')
@UseGuards(JwtAuthGuard)
export class MessageTemplatesController {
  constructor(private readonly templatesService: MessageTemplatesService) {}

  @Post()
  async create(@Body() dto: CreateMessageTemplateDto, @Req() req) {
    return this.templatesService.create(dto, req.user.userId);
  }

  @Get()
  async findAll() {
    return this.templatesService.findAll();
  }

  @Get('campaign/:campaignId')
  async findByCampaign(@Param('campaignId') campaignId: string) {
    return this.templatesService.findByCampaign(campaignId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.templatesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateMessageTemplateDto) {
    return this.templatesService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.templatesService.remove(id);
  }
}
