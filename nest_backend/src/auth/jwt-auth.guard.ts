import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) throw new UnauthorizedException('No token provided');
    const token = authHeader.split(' ')[1];

    const payload = await this.authService.validateToken(token);
    request.user = {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    }; // attach user info
    return true;
  }
}
