import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Token, TokenSchema } from './schemas/token.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
