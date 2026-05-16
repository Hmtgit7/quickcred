import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import { User, UserDocument } from '../../users/schemas/user.schema';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.refreshSecret') ?? '',
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request<unknown, unknown, { refreshToken?: string }>,
    payload: JwtPayload
  ): Promise<JwtPayload> {
    const incomingToken = req.body.refreshToken;
    if (!incomingToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const user = await this.userModel.findById(payload.sub).select('+refreshToken');

    if (!user?.refreshToken) {
      throw new UnauthorizedException('Refresh token not found — please login again');
    }

    const isValid = await bcrypt.compare(incomingToken, user.refreshToken);
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return { sub: payload.sub, email: payload.email, role: payload.role };
  }
}
