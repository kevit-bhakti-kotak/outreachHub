import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ContactsModule } from './contacts/contacts.module';
import { WorkspacesModule } from './workspaces/workspaces.module';

@Module({
  imports: [
    // load .env globally
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRoot(
  process.env.MONGO_URI ?? 'mongodb://localhost:27017/outreachhub',),
    UsersModule, AuthModule, ContactsModule, WorkspacesModule,
  ],
})
export class AppModule {}
