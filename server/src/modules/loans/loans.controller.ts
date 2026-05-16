import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { LoansService } from './loans.service';
import { ApplyLoanDto } from './dto/apply-loan.dto';
import { SanctionLoanDto } from './dto/sanction-loan.dto';
import { DisburseLoanDto } from './dto/disburse-loan.dto';
import { LoanQueryDto } from './dto/loan-query.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { ParseObjectIdPipe } from '../../common/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';

@ApiTags('loans')
@ApiBearerAuth('access-token')
@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  // ── Borrower: apply for a loan ──────────────────────────────────────────
  @Post()
  @Roles(Role.Borrower)
  @ApiOperation({ summary: 'Apply for a new loan (Borrower only)' })
  @ApiCreatedResponse({ description: 'Loan application submitted' })
  applyLoan(@Body() dto: ApplyLoanDto, @CurrentUser() user: JwtPayload) {
    return this.loansService.applyLoan(dto, user);
  }

  // ── Borrower: own loan history ──────────────────────────────────────────
  @Get('my')
  @Roles(Role.Borrower)
  @ApiOperation({ summary: "Get current borrower's loan history" })
  @ApiOkResponse({ description: 'List of own loans' })
  getMyLoans(@CurrentUser() user: JwtPayload) {
    return this.loansService.getMyLoans(user);
  }

  // ── Ops: get all loans (paginated) ──────────────────────────────────────
  @Get()
  @Roles(Role.Admin, Role.Sales, Role.Sanction, Role.Disbursement, Role.Collection)
  @ApiOperation({ summary: 'Get all loans — ops dashboard (paginated, filterable)' })
  @ApiOkResponse({ description: 'Paginated loan list' })
  getAll(@Query() query: LoanQueryDto) {
    return this.loansService.getAll(query);
  }

  // ── Get single loan by ID ───────────────────────────────────────────────
  @Get(':id')
  @Roles(Role.Admin, Role.Borrower, Role.Sanction, Role.Disbursement, Role.Collection, Role.Sales)
  @ApiOperation({ summary: 'Get a single loan by ID' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId of the loan' })
  getById(@Param('id', ParseObjectIdPipe) id: Types.ObjectId, @CurrentUser() user: JwtPayload) {
    return this.loansService.getById(id, user);
  }

  // ── Sanction: approve or reject ─────────────────────────────────────────
  @Patch(':id/sanction')
  @Roles(Role.Sanction, Role.Admin)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve or reject a loan application (Sanction team)' })
  @ApiParam({ name: 'id', description: 'Loan ObjectId' })
  sanctionLoan(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() dto: SanctionLoanDto,
    @CurrentUser() user: JwtPayload
  ) {
    return this.loansService.sanctionLoan(id, dto, user);
  }

  // ── Disbursement: mark disbursed ─────────────────────────────────────────
  @Patch(':id/disburse')
  @Roles(Role.Disbursement, Role.Admin)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark a loan as disbursed (Disbursement team)' })
  @ApiParam({ name: 'id', description: 'Loan ObjectId' })
  disburseLoan(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() dto: DisburseLoanDto,
    @CurrentUser() user: JwtPayload
  ) {
    return this.loansService.disburseLoan(id, dto, user);
  }

  // ── Audit trail ─────────────────────────────────────────────────────────
  @Get(':id/audit')
  @Roles(Role.Admin, Role.Sanction, Role.Disbursement, Role.Collection)
  @ApiOperation({ summary: 'Get full audit trail for a loan (Admin/Ops)' })
  @ApiParam({ name: 'id', description: 'Loan ObjectId' })
  getAuditTrail(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.loansService.getAuditTrail(id);
  }
}
