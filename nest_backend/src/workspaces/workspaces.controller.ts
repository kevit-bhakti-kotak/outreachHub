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

@Delete(':id/users/:userId')
removeUserFromWorkspace(
  @Param('id') workspaceId: string,
  @Param('userId') userId: string,
  @Req() req
) {
  return this.workspacesService.removeUser(workspaceId, userId);
}
@Patch(':id/users/:userId')
@UseGuards(JwtAuthGuard)
async updateUserRole(
  @Param('id') workspaceId: string,
  @Param('userId') userId: string,
  @Body('role') role: 'Editor' | 'Viewer',
) {
  return this.workspacesService.updateUserRole(workspaceId, userId, role);
}

  @Post(':id/users')
@UseGuards(JwtAuthGuard)
async addUsers(
  @Param('id') workspaceId: string,
  @Body() body: { users: { email: string; role: 'Editor' | 'Viewer' }[] },
  @Req() req
) {
  const adminId = req.user.userId;
  return this.workspacesService.addUsersToWorkspace(workspaceId, body.users, adminId);
}

@Patch(':id/users/:userId/remove')
@UseGuards(JwtAuthGuard)
async removeUser(
  @Param('id') workspaceId: string,
  @Param('userId') userId: string,
) {
  return this.workspacesService.removeUser(workspaceId, userId);
}



}
