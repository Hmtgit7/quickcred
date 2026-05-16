import { Controller, Get, Patch, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get own profile' })
  @ApiOkResponse({ description: 'Current user profile' })
  getMe(@CurrentUser() user: JwtPayload) {
    return this.usersService.getMe(user.sub);
  }

  @Patch('profile')
  @Roles(Role.Borrower)
  @ApiOperation({ summary: 'Update borrower profile + run eligibility (BRE) check' })
  updateProfile(@CurrentUser() user: JwtPayload, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.sub, dto);
  }

  @Get('leads')
  @Roles(Role.Sales, Role.Admin)
  @ApiOperation({ summary: '[Sales] View users who have not applied yet' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getLeads(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.usersService.getLeads(page, limit);
  }

  @Get()
  @Roles(Role.Admin)
  @ApiOperation({ summary: '[Admin] List all users paginated' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.usersService.findAll(page, limit);
  }
}
