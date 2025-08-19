import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/schemas/user.schema';
import { Token } from './schemas/token.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, // from JwtModule
    @InjectModel(User.name) private readonly userModel: Model<User>, // from UsersModule
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>, //from AuthModule
  ) {}
  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user._id, email: user.email, isAdmin: user.isAdmin };
    const token = this.jwtService.sign(payload);

    // store token in whitelist
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1h expiry of token
    await this.tokenModel.create({ userId: user._id, token, expiresAt });

    return { token };
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const exists = await this.tokenModel.findOne({ token });
      if (!exists) throw new UnauthorizedException('Token not whitelisted');
      return payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async logout(token: string) {
    await this.tokenModel.deleteOne({ token });
    return { message: 'Logged out successfully' };
  }
}
