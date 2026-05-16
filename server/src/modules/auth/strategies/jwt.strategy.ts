import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectModel } from '@nestjs/mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import { User, UserDocument } from '../../users/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret') ?? '',
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    // Verify user still exists in DB (handles deleted accounts)
    const user = await this.userModel.findById(payload.sub).select('_id email role').lean();

    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    // Return value is attached to req.user
    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
