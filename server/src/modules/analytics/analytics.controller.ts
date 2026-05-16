import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@ApiTags('analytics')
@ApiBearerAuth('access-token')
@Controller('analytics')
@Roles(Role.Admin) // all analytics endpoints are admin-only by default
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get KPI overview — loan book, repayment rate, counts' })
  @ApiOkResponse({ description: 'OverviewKpis object' })
  getOverview() {
    return this.analyticsService.getOverview();
  }

  @Get('disbursement-chart')
  @ApiOperation({ summary: 'Disbursement trend — last N days (default 30)' })
  @ApiQuery({ name: 'days', required: false, example: 30 })
  getDisbursementChart(@Query('days') days?: number) {
    return this.analyticsService.getDisbursementChart(days ? Number(days) : 30);
  }

  @Get('repayment-chart')
  @ApiOperation({ summary: 'Repayment vs expected — last N months (default 6)' })
  @ApiQuery({ name: 'months', required: false, example: 6 })
  getRepaymentChart(@Query('months') months?: number) {
    return this.analyticsService.getRepaymentChart(months ? Number(months) : 6);
  }

  @Get('status-breakdown')
  @ApiOperation({ summary: 'Loan status breakdown for pie chart' })
  getStatusBreakdown() {
    return this.analyticsService.getStatusBreakdown();
  }
}
