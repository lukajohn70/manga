import { Controller, Post, Get, Body, Param, Query, Headers } from '@nestjs/common';
import { ShippingService, IngestTrackingDto } from './shipping.service.js';

export class IngestTrackingInput {
  carrierId!: string;
  trackingNumber!: string;
  sourceEventId!: string;
  carrierStatus!: string;
  occurredAt!: Date;
  location?: {
    city?: string;
    stateOrProvince?: string;
  };
}

@Controller('v1/vendor/shipment-groups')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Get()
  public async listOrders(
    @Query('vendorId') vendorId: string,
    @Query('status') status?: string
  ) {
    return await this.shippingService.listVendorShipmentGroups(vendorId, status);
  }

  @Post(':id/accept')
  public async acceptOrder(
    @Param('id') shipmentGroupId: string,
    @Body('vendorId') vendorId: string
  ) {
    return await this.shippingService.acceptShipmentGroup(shipmentGroupId, vendorId);
  }

  @Post(':id/pack')
  public async startPacking(
    @Param('id') shipmentGroupId: string,
    @Body('vendorId') vendorId: string
  ) {
    return await this.shippingService.packShipmentGroup(shipmentGroupId, vendorId);
  }

  @Post(':id/labels')
  public async generateLabel(
    @Param('id') shipmentGroupId: string,
    @Body('vendorId') vendorId: string,
    @Body('weightG') weightG?: number
  ) {
    return await this.shippingService.createShipmentLabel(
      shipmentGroupId,
      vendorId,
      weightG ?? 500
    );
  }

  @Post('tracking/webhook')
  public async ingestTracking(@Body() body: IngestTrackingInput) {
    await this.shippingService.ingestTrackingEvent({
      ...body,
      occurredAt: new Date(body.occurredAt || Date.now()),
    });
    return { received: true };
  }
}
