import { Controller, Get, Patch, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { ParseObjectIdPipe } from '../../common/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';

@ApiTags('notifications')
@ApiBearerAuth('access-token')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // ── Get own notifications (paginated) ────────────────────────────────
  @Get()
  @ApiOperation({ summary: 'Get paginated notifications for current user' })
  @ApiOkResponse({ description: 'Paginated notification list with unread count' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  getMyNotifications(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    return this.notificationsService.getMyNotifications(user, page, limit);
  }

  // ── Unread count — for bell badge ─────────────────────────────────────
  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notification count (for bell badge)' })
  @ApiOkResponse({ description: '{ count: number }' })
  getUnreadCount(@CurrentUser() user: JwtPayload) {
    return this.notificationsService.getUnreadCount(user);
  }

  // ── Admin: all notifications ──────────────────────────────────────────
  @Get('all')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get all notifications — Admin only' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.notificationsService.getAll(page, limit);
  }

  // ── Mark single as read ───────────────────────────────────────────────
  @Patch(':id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark a single notification as read' })
  @ApiParam({ name: 'id', description: 'Notification ObjectId' })
  markAsRead(@Param('id', ParseObjectIdPipe) id: Types.ObjectId, @CurrentUser() user: JwtPayload) {
    return this.notificationsService.markAsRead(id, user);
  }

  // ── Mark ALL as read ──────────────────────────────────────────────────
  @Patch('read-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiOkResponse({ description: '{ modifiedCount: number }' })
  markAllAsRead(@CurrentUser() user: JwtPayload) {
    return this.notificationsService.markAllAsRead(user);
  }
}
