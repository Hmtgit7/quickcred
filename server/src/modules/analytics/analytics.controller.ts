import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@ApiTags('analytics')
@ApiBearerAuth('access-token')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // Admin only — full loan book overview
  @Get('overview')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'KPI overview — Admin only' })
  @ApiOkResponse({ description: 'OverviewKpis object' })
  getOverview() {
    return this.analyticsService.getOverview();
  }

  // Admin + Disbursement team
  @Get('disbursement-chart')
  @Roles(Role.Admin, Role.Disbursement)
  @ApiOperation({ summary: 'Disbursement trend — last N days' })
  @ApiQuery({ name: 'days', required: false, example: 30 })
  getDisbursementChart(@Query('days') days?: number) {
    return this.analyticsService.getDisbursementChart(days ? Number(days) : 30);
  }

  // Admin + Collection team
  @Get('repayment-chart')
  @Roles(Role.Admin, Role.Collection)
  @ApiOperation({ summary: 'Repayment vs expected — last N months' })
  @ApiQuery({ name: 'months', required: false, example: 6 })
  getRepaymentChart(@Query('months') months?: number) {
    return this.analyticsService.getRepaymentChart(months ? Number(months) : 6);
  }

  // Admin + Sanction team (helps them see pipeline)
  @Get('status-breakdown')
  @Roles(Role.Admin, Role.Sanction, Role.Sales)
  @ApiOperation({ summary: 'Loan status breakdown for pie chart' })
  getStatusBreakdown() {
    return this.analyticsService.getStatusBreakdown();
  }
}
