import { Controller, Post, Patch, Body, Param } from '@nestjs/common';
import { OffersService, CreateOfferDto, UpdatePriceDto } from './offers.service.js';

@Controller('v1/offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  public async createOffer(@Body() body: any) {
    return await this.offersService.createOffer({
      ...body,
      priceMinor: BigInt(body.priceMinor),
      compareAtMinor: body.compareAtMinor ? BigInt(body.compareAtMinor) : undefined,
    });
  }

  @Patch(':id/price')
  public async updatePrice(@Param('id') offerId: string, @Body() body: any) {
    return await this.offersService.updateOfferPrice({
      offerId,
      newPriceMinor: BigInt(body.newPriceMinor),
      compareAtMinor: body.compareAtMinor ? BigInt(body.compareAtMinor) : undefined,
      expectedVersion: body.expectedVersion,
    });
  }
}
