import { Module } from '@nestjs/common';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacesService } from './workspaces.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Workspace, WorkspaceSchema } from './schemas/workspace.schema';
import { AuthModule } from 'src/auth/auth.module';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
   imports: [
    MongooseModule.forFeature([{ name: Workspace.name, schema: WorkspaceSchema },{ name: User.name, schema: UserSchema }]),AuthModule
  ],
  controllers: [WorkspacesController],
  providers: [WorkspacesService],
   exports: [WorkspacesService],
})
export class WorkspacesModule {}
