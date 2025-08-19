import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateWorkspaceDto, @Req() req) {
    return this.workspacesService.create(dto, req.user.userId);
  }

  @Get()
  async findAll() {
    return this.workspacesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.workspacesService.findOne(id);
  }
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateWorkspaceDto) {
    return this.workspacesService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.workspacesService.remove(id);
  }
}
