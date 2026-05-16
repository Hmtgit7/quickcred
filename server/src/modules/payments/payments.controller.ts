import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { ParseObjectIdPipe } from '../../common/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';

@ApiTags('payments')
@ApiBearerAuth('access-token')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // ── Record a payment ────────────────────────────────────────────────────
  @Post()
  @Roles(Role.Collection, Role.Admin)
  @ApiOperation({ summary: 'Record a borrower payment (Collection team)' })
  @ApiCreatedResponse({ description: 'Payment recorded; loan auto-closes if fully repaid' })
  @HttpCode(HttpStatus.CREATED)
  recordPayment(@Body() dto: RecordPaymentDto, @CurrentUser() user: JwtPayload) {
    return this.paymentsService.recordPayment(dto, user);
  }

  // ── Get all payments for a loan ─────────────────────────────────────────
  @Get('loan/:loanId')
  @Roles(Role.Collection, Role.Admin, Role.Disbursement, Role.Sanction)
  @ApiOperation({ summary: 'Get all payments for a specific loan' })
  @ApiOkResponse({ description: 'List of payments ordered by date' })
  @ApiParam({ name: 'loanId', description: 'MongoDB ObjectId of the loan' })
  getLoanPayments(@Param('loanId', ParseObjectIdPipe) loanId: Types.ObjectId) {
    return this.paymentsService.getLoanPayments(loanId);
  }

  // ── Payment summary ─────────────────────────────────────────────────────
  @Get('loan/:loanId/summary')
  @Roles(Role.Collection, Role.Admin, Role.Disbursement, Role.Borrower)
  @ApiOperation({ summary: 'Get payment summary — total paid, outstanding balance' })
  @ApiOkResponse({ description: 'Payment summary object' })
  @ApiParam({ name: 'loanId', description: 'MongoDB ObjectId of the loan' })
  getPaymentSummary(@Param('loanId', ParseObjectIdPipe) loanId: Types.ObjectId) {
    return this.paymentsService.getPaymentSummary(loanId);
  }
}
