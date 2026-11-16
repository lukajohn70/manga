import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.js';
import { OutboxService } from '../outbox/outbox.service.js';
import { DomainEventNames } from '@manga/domain';

export interface CreateOfferDto {
  vendorId: string;
  variantId: string;
  condition: 'new' | 'refurbished_excellent' | 'refurbished_good' | 'used';
  priceMinor: bigint;
  currency: string;
  compareAtMinor?: bigint;
  handlingTimeHours?: number;
  shippingProfileId: string;
  policyTemplateId: string;
}

export interface UpdatePriceDto {
  offerId: string;
  newPriceMinor: bigint;
  compareAtMinor?: bigint;
  expectedVersion: number; // Optimistic locking (§6.2)
}

@Injectable()
export class OffersService {
  constructor(
    private readonly db: DatabaseService,
    private readonly outbox: OutboxService
  ) {}

  public async createOffer(dto: CreateOfferDto): Promise<any> {
    const res = await this.db.query(
      `INSERT INTO offers.offers (
        vendor_id, variant_id, condition, price_minor, currency,
        compare_at_minor, handling_time_hours, shipping_profile_id, policy_template_id, status, version
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'active', 1)
      RETURNING *`,
      [
        dto.vendorId,
        dto.variantId,
        dto.condition,
        dto.priceMinor.toString(),
        dto.currency.toUpperCase(),
        dto.compareAtMinor ? dto.compareAtMinor.toString() : null,
        dto.handlingTimeHours ?? 24,
        dto.shippingProfileId,
        dto.policyTemplateId,
      ],
      { vendorId: dto.vendorId }
    );

    const offer = res.rows[0];

    // Emit offer.created
    await this.outbox.stageEvent({
      id: crypto.randomUUID(),
      name: DomainEventNames.OFFER_CREATED,
      aggregateType: 'offer',
      aggregateId: offer.id,
      correlationId: crypto.randomUUID(),
      timestamp: new Date(),
      payload: {
        offerId: offer.id,
        variantId: offer.variant_id,
        vendorId: offer.vendor_id,
        priceMinor: offer.price_minor,
      },
    });

    // Recompute Buy Box asynchronously
    await this.recalculateBuyBox(dto.variantId);

    return offer;
  }

  public async updateOfferPrice(dto: UpdatePriceDto): Promise<any> {
    const res = await this.db.query(
      `UPDATE offers.offers
       SET price_minor = $1, compare_at_minor = $2, version = version + 1
       WHERE id = $3 AND version = $4
       RETURNING *`,
      [
        dto.newPriceMinor.toString(),
        dto.compareAtMinor ? dto.compareAtMinor.toString() : null,
        dto.offerId,
        dto.expectedVersion,
      ]
    );

    if (res.rows.length === 0) {
      throw new ConflictException(
        `Failed to update offer ${dto.offerId}: version mismatch (optimistic lock conflict) or offer not found.`
      );
    }

    const updatedOffer = res.rows[0];

    await this.outbox.stageEvent({
      id: crypto.randomUUID(),
      name: DomainEventNames.OFFER_PRICE_CHANGED,
      aggregateType: 'offer',
      aggregateId: updatedOffer.id,
      correlationId: crypto.randomUUID(),
      timestamp: new Date(),
      payload: {
        offerId: updatedOffer.id,
        variantId: updatedOffer.variant_id,
        oldPrice: null,
        newPrice: updatedOffer.price_minor,
      },
    });

    await this.recalculateBuyBox(updatedOffer.variant_id);

    return updatedOffer;
  }

  /**
   * Buy-Box Ranking calculation (§7.1, §9):
   * Factors: lowest price, handling speed, vendor tier & standing.
   */
  public async recalculateBuyBox(variantId: string): Promise<any> {
    const offersRes = await this.db.query(
      `SELECT o.*, v.tier as vendor_tier, v.status as vendor_status
       FROM offers.offers o
       JOIN vendor.vendors v ON o.vendor_id = v.id
       WHERE o.variant_id = $1 AND o.status = 'active' AND v.status = 'active'`,
      [variantId]
    );

    if (offersRes.rows.length === 0) {
      return null;
    }

    const scoredOffers = offersRes.rows.map((offer) => {
      let score = 100;
      // 1. Handling time penalty (each day beyond same-day subtracts 5 points)
      score -= Math.floor(offer.handling_time_hours / 24) * 5;

      // 2. Vendor tier bonus
      if (offer.vendor_tier === 'tier_3') score += 15;
      else if (offer.vendor_tier === 'tier_2') score += 5;

      // 3. Price ranking weight (lower price is normalized)
      const priceNumeric = Number(offer.price_minor);

      return {
        offer,
        score,
        priceNumeric,
      };
    });

    // Sort primarily by highest score, secondarily by lowest price
    scoredOffers.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.priceNumeric - b.priceNumeric;
    });

    const winner = scoredOffers[0];

    // Persist to offers.buybox_scores
    await this.db.query(
      `INSERT INTO offers.buybox_scores (variant_id, winning_offer_id, score, computed_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (variant_id)
       DO UPDATE SET winning_offer_id = EXCLUDED.winning_offer_id,
                     score = EXCLUDED.score,
                     computed_at = NOW()`,
      [variantId, winner.offer.id, winner.score]
    );

    return {
      variantId,
      winningOfferId: winner.offer.id,
      score: winner.score,
    };
  }
}
