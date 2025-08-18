import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // load .env globally
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRoot(
  process.env.MONGO_URI ?? 'mongodb://localhost:27017/outreachhub',),
    UsersModule,
  ],
})
export class AppModule {}
