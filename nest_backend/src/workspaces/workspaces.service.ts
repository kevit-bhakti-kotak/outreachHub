import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Workspace } from './schemas/workspace.schema';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectModel(Workspace.name) private workspaceModel: Model<Workspace>,
  ) {}

  async create(createWorkspaceDto: CreateWorkspaceDto, userId: any) {
    const newWorkspace = new this.workspaceModel({
      ...createWorkspaceDto,
      createdBy: userId,
    });
    return newWorkspace.save();
  }

  async findAll() {
    return this.workspaceModel.find().populate('createdBy', 'email');
  }

  async findOne(id: string) {
    return this.workspaceModel.findById(id).populate('createdBy', 'email');
  }
  async update(id: string, updateDto: UpdateWorkspaceDto) {
  return this.workspaceModel.findByIdAndUpdate(
    id,
    { $set: updateDto },
    { new: true },
  );
}

async remove(id: string) {
  return this.workspaceModel.findByIdAndDelete(id);
}

}
