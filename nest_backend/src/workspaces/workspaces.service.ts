import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Workspace } from './schemas/workspace.schema';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { User } from 'src/users/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { AddUsersDto } from './dto/add-user.dto';

type AddUserResult = {
  email: string;
  status: 'NOT_FOUND' | 'ADDED' | 'ALREADY_EXISTS';
};

@Injectable()
export class WorkspacesService {
  
  constructor(
  @InjectModel(Workspace.name) private workspaceModel: Model<Workspace>,
  @InjectModel(User.name) private userModel: Model<User>,
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
  const ws = await this.workspaceModel.findById(id).populate('createdBy', 'email');
  if (!ws) throw new NotFoundException('Workspace not found');

  // get all users that belong to this workspace
  const users = await this.userModel.find(
    { "workspaces.workspaceId": id },
    { name: 1, email: 1, "workspaces.$": 1 } // only include matching workspace role
  );

  return {
    ...ws.toObject(),
    users: users.map(u => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.workspaces[0].role
    }))
  };
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

//workspace-user logic...
// async addExistingUserToWorkspace(
//   workspaceId: string,
//   userId: string,
//   role: 'Editor' | 'Viewer',
//   adminId: string
// ) {
//   const workspace = await this.workspaceModel.findById(workspaceId);
//   if (!workspace) throw new NotFoundException('Workspace not found');

//   // Only workspace creator (admin) can add users — change if you want other policy
//   if (workspace.createdBy.toString() !== adminId) {
//     throw new ForbiddenException('Not allowed');
//   }

//   const user = await this.userModel.findById(userId);
//   if (!user) throw new NotFoundException('User not found');

//   // avoid duplicates
//   const already = (user.workspaces || []).some(w => String(w.workspaceId) === String(workspaceId));
//   if (!already) {
//     user.workspaces.push({ workspaceId: new Types.ObjectId(workspaceId), role });
//     await user.save();
//   }

//   // return sanitized user info
//   return { message: 'User added to workspace', userId: user._id };
// inside workspaces.service.ts

// Define a result type for clarity


// workspaces.service.ts
async addUsersToWorkspace(
  workspaceId: string,
  users: { email: string; role: 'Editor' | 'Viewer' }[],
  adminId: string,
) {
  // Example: use adminId to check permissions or log action
  const results: { email: string; status: 'NOT_FOUND' | 'ADDED' | 'ALREADY_EXISTS' }[] = [];

  for (const { email, role } of users) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      results.push({ email, status: 'NOT_FOUND' });
      continue;
    }

    const alreadyMember = user.workspaces.some(
      (w) => w.workspaceId.toString() === workspaceId,
    );

    if (alreadyMember) {
      results.push({ email, status: 'ALREADY_EXISTS' });
    } else {
      user.workspaces.push({ workspaceId: new Types.ObjectId(workspaceId), role });
      await user.save();
      results.push({ email, status: 'ADDED' });
    }
  }

  return results;
}

async updateUserRole(
  workspaceId: string,
  userId: string,
  role: 'Editor' | 'Viewer'
) {
  // Directly update nested role in one query
  await this.userModel.updateOne(
    { _id: userId, 'workspaces.workspaceId': workspaceId },
    { $set: { 'workspaces.$.role': role } }
  );

  // return updated workspace view
  return this.workspaceModel.findById(workspaceId)
    .populate('users.user', 'name email');
}
async removeUser(workspaceId: string, userId: string) {
  // Remove from workspace.users array
  await this.workspaceModel.findByIdAndUpdate(
    workspaceId,
    { $pull: { users: { userId } } },
  );

  // Also remove workspace from user's schema
  return this.userModel.findByIdAndUpdate(
    userId,
    { $pull: { workspaces: { workspaceId } } },
    { new: true }
  );
}



}
