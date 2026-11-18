import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';
import {
  AdminRepairService,
  ReplayOutboxDto,
  ReleaseStuckReservationDto,
  RefreshSearchIndexDto,
  ReverseLedgerTxDto,
  ResyncTrackingDto,
} from './admin-repair.service.js';

export class ReplayOutboxBodyDto implements ReplayOutboxDto {
  eventId!: string;
  actorId!: string;
  reason!: string;
}

export class ReleaseStuckReservationBodyDto implements ReleaseStuckReservationDto {
  reservationId!: string;
  actorId!: string;
  reason!: string;
}

export class RefreshSearchIndexBodyDto implements RefreshSearchIndexDto {
  productId!: string;
  actorId!: string;
  reason!: string;
}

export class ReverseLedgerTxBodyDto implements ReverseLedgerTxDto {
  transactionId!: string;
  actorId!: string;
  checkerId!: string;
  reason!: string;
  idempotencyKey!: string;
}

export class ResyncTrackingBodyDto implements ResyncTrackingDto {
  shipmentId!: string;
  actorId!: string;
  reason!: string;
}

@Controller('admin/repair')
@UseGuards(RolesGuard)
@Roles('ADMIN')
export class AdminRepairController {
  constructor(private readonly repairService: AdminRepairService) {}

  @Post('replay-outbox')
  public async replayOutbox(@Body() dto: ReplayOutboxBodyDto): Promise<any> {
    return await this.repairService.replayOutboxEvent(dto);
  }

  @Post('release-reservation')
  public async releaseReservation(@Body() dto: ReleaseStuckReservationBodyDto): Promise<any> {
    return await this.repairService.releaseStuckReservation(dto);
  }

  @Post('refresh-search')
  public async refreshSearch(@Body() dto: RefreshSearchIndexBodyDto): Promise<any> {
    return await this.repairService.refreshSearchIndex(dto);
  }

  @Post('reverse-ledger')
  public async reverseLedger(@Body() dto: ReverseLedgerTxBodyDto): Promise<any> {
    return await this.repairService.reverseLedgerTransaction(dto);
  }

  @Post('resync-tracking')
  public async resyncTracking(@Body() dto: ResyncTrackingBodyDto): Promise<any> {
    return await this.repairService.resyncTracking(dto);
  }

  @Get('audit-logs')
  public async getAuditLogs(@Query('limit') limit?: number): Promise<any[]> {
    return await this.repairService.getAuditLogs(limit ? Number(limit) : 50);
  }
}
