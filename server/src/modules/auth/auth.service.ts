import { Injectable, ConflictException, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../users/schemas/user.schema';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponse } from './types/auth.types';
import { AuthTokens } from './interfaces/auth-tokens.interface';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly BCRYPT_ROUNDS = 10;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  // ── Signup ───────────────────────────────────────────────────────────────
  async signup(dto: SignupDto): Promise<AuthResponse> {
    const existing = await this.userModel.findOne({
      email: dto.email.toLowerCase(),
    });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const hashed = await bcrypt.hash(dto.password, this.BCRYPT_ROUNDS);

    const user = await this.userModel.create({
      email: dto.email.toLowerCase(),
      password: hashed,
      fullName: dto.fullName,
      role: Role.Borrower, // signup always creates a borrower — execs are seeded
    });

    this.logger.log(`New borrower registered: ${user.email}`);

    const tokens = await this.generateAndStoreTokens(user);
    return { ...tokens, user: this.sanitizeUser(user) };
  }

  // ── Login ────────────────────────────────────────────────────────────────
  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.userModel
      .findOne({ email: dto.email.toLowerCase() })
      .select('+password');

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generateAndStoreTokens(user);
    return { ...tokens, user: this.sanitizeUser(user) };
  }

  // ── Refresh tokens ───────────────────────────────────────────────────────
  async refresh(user: JwtPayload): Promise<AuthTokens> {
    const dbUser = await this.userModel.findById(user.sub);
    if (!dbUser) {
      throw new UnauthorizedException('User not found');
    }
    return this.generateAndStoreTokens(dbUser);
  }

  // ── Logout ───────────────────────────────────────────────────────────────
  async logout(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $unset: { refreshToken: 1 },
    });
  }

  // ── Helpers ──────────────────────────────────────────────────────────────
  private async generateAndStoreTokens(user: UserDocument): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessSecret = this.configService.get<string>('jwt.secret') ?? '';
    const refreshSecret = this.configService.get<string>('jwt.refreshSecret') ?? '';
    const accessExpiry = this.toJwtExpirySeconds(
      this.configService.get<string>('jwt.expiry') ?? '15m'
    );
    const refreshExpiry = this.toJwtExpirySeconds(
      this.configService.get<string>('jwt.refreshExpiry') ?? '7d'
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: accessExpiry,
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: refreshExpiry,
      }),
    ]);

    // Store hashed refresh token — never store plain token in DB
    const hashedRefresh = await bcrypt.hash(refreshToken, this.BCRYPT_ROUNDS);
    await this.userModel.findByIdAndUpdate(user._id, {
      refreshToken: hashedRefresh,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.configService.get<string>('jwt.expiry') ?? '15m',
    };
  }

  private sanitizeUser(user: UserDocument): Omit<User, 'password' | 'refreshToken'> {
    const obj = user.toObject() as User & { password?: string; refreshToken?: string };
    const { password, refreshToken, ...safe } = obj;
    void password;
    void refreshToken;
    return safe;
  }

  private toJwtExpirySeconds(value: string): number {
    const match = value.trim().match(/^(\d+)([smhd])$/i);
    if (!match) {
      throw new UnauthorizedException(`Invalid JWT expiry config: ${value}`);
    }
    const amount = Number.parseInt(match[1], 10);
    const unit = match[2].toLowerCase();
    const multiplier: Record<string, number> = {
      s: 1,
      m: 60,
      h: 60 * 60,
      d: 60 * 60 * 24,
    };
    return amount * multiplier[unit];
  }
}
