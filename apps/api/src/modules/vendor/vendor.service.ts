import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.js';
import { OutboxService } from '../outbox/outbox.service.js';
import { KycProvider, MockKycProvider, KycSubmission } from './kyc.provider.js';
import { DomainEventNames } from '@manga/domain';

export class RegisterVendorDto {
  userId!: string;
  businessName!: string;
  legalEntityType!: string;
}

export class CreateWarehouseDto {
  vendorId!: string;
  code!: string;
  name!: string;
  address!: {
    streetAddress: string;
    city: string;
    stateOrProvince: string;
    countryCode: string;
    postalCode?: string;
  };
  isPrimary?: boolean;
}

@Injectable()
export class VendorService {
  private kycProvider: KycProvider;

  constructor(
    private readonly db: DatabaseService,
    private readonly outbox: OutboxService
  ) {
    this.kycProvider = new MockKycProvider();
  }

  public async registerVendor(dto: RegisterVendorDto): Promise<any> {
    const res = await this.db.query(
      `INSERT INTO vendor.vendors (user_id, business_name, legal_entity_type, tier, status, kyc_status)
       VALUES ($1, $2, $3, 'tier_1', 'pending_verification', 'pending')
       RETURNING *`,
      [dto.userId, dto.businessName, dto.legalEntityType]
    );

    return res.rows[0];
  }

  public async submitKyc(submission: KycSubmission): Promise<any> {
    const kycResult = await this.kycProvider.submitBusinessVerification(submission);

    const newVendorStatus = kycResult.status === 'verified' ? 'active' : 'pending_verification';

    const res = await this.db.query(
      `UPDATE vendor.vendors
       SET kyc_status = $1, kyc_reference = $2, status = $3
       WHERE id = $4
       RETURNING *`,
      [kycResult.status, kycResult.kycReference, newVendorStatus, submission.vendorId]
    );

    if (res.rows.length === 0) {
      throw new NotFoundException(`Vendor with id ${submission.vendorId} not found`);
    }

    const updatedVendor = res.rows[0];

    if (kycResult.status === 'verified') {
      await this.outbox.stageEvent({
        id: crypto.randomUUID(),
        name: DomainEventNames.VENDOR_APPROVED,
        aggregateType: 'vendor',
        aggregateId: submission.vendorId,
        correlationId: crypto.randomUUID(),
        timestamp: new Date(),
        payload: {
          vendorId: submission.vendorId,
          businessName: updatedVendor.business_name,
          tier: updatedVendor.tier,
        },
      });
    }

    return updatedVendor;
  }

  public async updateTier(vendorId: string, newTier: 'tier_1' | 'tier_2' | 'tier_3'): Promise<any> {
    const res = await this.db.query(
      `UPDATE vendor.vendors SET tier = $1 WHERE id = $2 RETURNING *`,
      [newTier, vendorId]
    );

    if (res.rows.length === 0) {
      throw new NotFoundException(`Vendor with id ${vendorId} not found`);
    }

    await this.outbox.stageEvent({
      id: crypto.randomUUID(),
      name: DomainEventNames.VENDOR_TIER_CHANGED,
      aggregateType: 'vendor',
      aggregateId: vendorId,
      correlationId: crypto.randomUUID(),
      timestamp: new Date(),
      payload: { vendorId, tier: newTier },
    });

    return res.rows[0];
  }

  public async suspendVendor(vendorId: string, reason: string): Promise<any> {
    const res = await this.db.query(
      `UPDATE vendor.vendors SET status = 'suspended' WHERE id = $1 RETURNING *`,
      [vendorId]
    );

    if (res.rows.length === 0) {
      throw new NotFoundException(`Vendor with id ${vendorId} not found`);
    }

    await this.outbox.stageEvent({
      id: crypto.randomUUID(),
      name: DomainEventNames.VENDOR_SUSPENDED,
      aggregateType: 'vendor',
      aggregateId: vendorId,
      correlationId: crypto.randomUUID(),
      timestamp: new Date(),
      payload: { vendorId, reason },
    });

    return res.rows[0];
  }

  public async createWarehouse(dto: CreateWarehouseDto): Promise<any> {
    const res = await this.db.query(
      `INSERT INTO vendor.warehouses (vendor_id, code, name, address, is_primary)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [dto.vendorId, dto.code, dto.name, JSON.stringify(dto.address), dto.isPrimary ?? false],
      { vendorId: dto.vendorId }
    );

    return res.rows[0];
  }

  public async listWarehouses(vendorId: string): Promise<any[]> {
    const res = await this.db.query(
      `SELECT * FROM vendor.warehouses WHERE vendor_id = $1 ORDER BY is_primary DESC, created_at ASC`,
      [vendorId],
      { vendorId }
    );

    return res.rows;
  }
}
