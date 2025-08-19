import { Module } from '@nestjs/common';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacesService } from './workspaces.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Workspace, WorkspaceSchema } from './schemas/workspace.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
   imports: [
    MongooseModule.forFeature([{ name: Workspace.name, schema: WorkspaceSchema }]),AuthModule
  ],
  controllers: [WorkspacesController],
  providers: [WorkspacesService],
   exports: [WorkspacesService],
})
export class WorkspacesModule {}
