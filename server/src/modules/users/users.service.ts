import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PAGINATION } from '../../common/constants';
import { PaginatedResponse } from '../../common/interfaces/paginated-response.interface';
import { BREService } from '../bre/bre.service';
import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private breService: BREService
  ) {}

  async getMe(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).lean();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserDocument> {
    const breResult = this.breService.evaluate({
      dob: dto.dob,
      monthlySalary: dto.monthlySalary,
      employmentMode: dto.employmentMode,
      pan: dto.pan,
    });

    if (!breResult.passed) {
      throw new UnprocessableEntityException({
        message: 'Eligibility check failed',
        failedRules: breResult.failedRules,
      });
    }

    const updated = await this.userModel
      .findByIdAndUpdate(
        userId,
        {
          fullName: dto.fullName,
          pan: dto.pan.toUpperCase(),
          dob: new Date(dto.dob),
          monthlySalary: dto.monthlySalary,
          employmentMode: dto.employmentMode,
          profileCompleted: true,
        },
        { new: true }
      )
      .lean();

    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  async getLeads(
    page = PAGINATION.DEFAULT_PAGE as number,
    limit = PAGINATION.DEFAULT_LIMIT as number
  ): Promise<PaginatedResponse<UserDocument>> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.userModel
        .find({ profileCompleted: false })
        .select('-password -refreshToken')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.userModel.countDocuments({ profileCompleted: false }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAll(
    page = PAGINATION.DEFAULT_PAGE as number,
    limit = PAGINATION.DEFAULT_LIMIT as number
  ): Promise<PaginatedResponse<UserDocument>> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.userModel
        .find()
        .select('-password -refreshToken')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.userModel.countDocuments(),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
