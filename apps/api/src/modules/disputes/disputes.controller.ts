import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import {
  DisputesService,
  OpenDisputeDto,
  SubmitEvidenceDto,
  ResolveDisputeDto,
} from './disputes.service.js';

export class OpenDisputeInput {
  orderId!: string;
  shipmentGroupId!: string;
  openedBy!: 'buyer' | 'vendor';
  type!: string;
  reason!: string;
  claimedAmountMinor?: string;
  currency?: string;
}

export class SubmitEvidenceInput {
  party!: 'buyer' | 'vendor' | 'carrier' | 'platform';
  kind!: 'photo' | 'video' | 'document' | 'message_transcript';
  uri!: string;
  notes?: string;
}

export class ResolveDisputeInput {
  adminId!: string;
  outcome!: 'resolved_buyer_favor' | 'resolved_vendor_favor' | 'settled_by_platform';
  resolutionNotes!: string;
  refundAmountMinor?: string;
  refundSource?: 'vendor' | 'platform_guarantee';
  currency?: string;
  idempotencyKey!: string;
}

@Controller('v1/admin/disputes')
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Get()
  public async listDisputes(@Query('status') status?: string) {
    return await this.disputesService.listDisputes(status);
  }

  @Get(':id')
  public async getDisputeDetail(@Param('id') caseId: string) {
    return await this.disputesService.getDisputeDetail(caseId);
  }

  @Post('open')
  public async openDispute(@Body() body: OpenDisputeInput) {
    return await this.disputesService.openDispute({
      ...body,
      claimedAmountMinor: body.claimedAmountMinor ? BigInt(body.claimedAmountMinor) : undefined,
    });
  }

  @Post(':id/evidence')
  public async submitEvidence(
    @Param('id') caseId: string,
    @Body() body: SubmitEvidenceInput
  ) {
    return await this.disputesService.submitEvidence({
      ...body,
      caseId,
    });
  }

  @Post(':id/resolve')
  public async resolveDispute(
    @Param('id') caseId: string,
    @Body() body: ResolveDisputeInput
  ) {
    return await this.disputesService.resolveDispute(caseId, {
      ...body,
      refundAmountMinor: body.refundAmountMinor ? BigInt(body.refundAmountMinor) : undefined,
    });
  }
}
