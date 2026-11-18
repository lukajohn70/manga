import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { VendorService, RegisterVendorDto, CreateWarehouseDto } from './vendor.service.js';
import { CsvImportService } from './import/csv-import.service.js';

@Controller('v1/vendor')
@UseGuards(RolesGuard)
export class VendorController {
  constructor(
    private readonly vendorService: VendorService,
    private readonly csvImport: CsvImportService
  ) {}

  @Post('register')
  public async register(@Body() dto: RegisterVendorDto) {
    return await this.vendorService.registerVendor(dto);
  }

  @Post(':id/kyc')
  @Roles('VENDOR')
  public async submitKyc(@Param('id') vendorId: string, @Body() body: any) {
    return await this.vendorService.submitKyc({
      ...body,
      vendorId,
    });
  }

  @Post(':id/warehouses')
  @Roles('VENDOR')
  public async createWarehouse(
    @Param('id') vendorId: string,
    @Body() dto: Omit<CreateWarehouseDto, 'vendorId'>
  ) {
    return await this.vendorService.createWarehouse({
      ...dto,
      vendorId,
    });
  }

  @Get(':id/warehouses')
  @Roles('VENDOR')
  public async listWarehouses(@Param('id') vendorId: string) {
    return await this.vendorService.listWarehouses(vendorId);
  }

  @Post(':id/imports')
  @Roles('VENDOR')
  public async importProductsCsv(
    @Param('id') vendorId: string,
    @Body('csvContent') csvContent: string,
    @Query('dryRun') dryRun?: string
  ) {
    const isDryRun = dryRun === 'true';
    const rows = this.csvImport.parseCsvString(csvContent);
    return await this.csvImport.processImport(vendorId, rows, isDryRun);
  }
}
