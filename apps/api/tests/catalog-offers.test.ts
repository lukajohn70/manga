import { describe, it, expect, beforeEach } from 'vitest';
import { MockDatabaseService } from './mock-database.service.js';
import { OutboxService } from '../src/modules/outbox/outbox.service.js';
import { CatalogService } from '../src/modules/catalog/catalog.service.js';
import { OffersService } from '../src/modules/offers/offers.service.js';
import { SearchService } from '../src/modules/search/search.service.js';
import { DomainEventNames } from '@manga/domain';

describe('Milestone 1: Catalog, Offers & Buy-Box Engine', () => {
  let db: MockDatabaseService;
  let outbox: OutboxService;
  let catalog: CatalogService;
  let offers: OffersService;
  let search: SearchService;

  beforeEach(() => {
    db = new MockDatabaseService();
    outbox = new OutboxService();
    catalog = new CatalogService(db, outbox);
    offers = new OffersService(db, outbox);
    search = new SearchService(db);
  });

  it('validates attributes against category attribute definitions', async () => {
    // 1. Create category
    const cat = await catalog.createCategory({
      slug: 'smartphones',
      name: 'Smartphones & Accessories',
    });

    // 2. Define required 'storage_gb' attribute (number)
    await catalog.defineAttribute({
      categoryId: cat.id,
      key: 'storage_gb',
      type: 'number',
      required: true,
    });

    // 3. Attempt to create master product missing required attribute -> must fail
    await expect(
      catalog.createMasterProduct({
        title: 'Phone X',
        description: 'Next gen phone',
        categoryId: cat.id,
        attributes: {},
      })
    ).rejects.toThrow(/Missing required attribute 'storage_gb'/);

    // 4. Attempt with wrong type (string instead of number) -> must fail
    await expect(
      catalog.createMasterProduct({
        title: 'Phone X',
        description: 'Next gen phone',
        categoryId: cat.id,
        attributes: { storage_gb: '128GB' },
      })
    ).rejects.toThrow(/Attribute 'storage_gb' must be a number/);

    // 5. Valid master product
    const validProd = await catalog.createMasterProduct({
      title: 'Phone X',
      description: 'Next gen phone',
      categoryId: cat.id,
      brandName: 'BrandX',
      attributes: { storage_gb: 128 },
    });

    expect(validProd.id).toBeDefined();
    expect(validProd.status).toBe('pending_moderation');
  });

  it('publishes domain event when product is moderated and published', async () => {
    const cat = await catalog.createCategory({ slug: 'books', name: 'Books' });
    const prod = await catalog.createMasterProduct({
      title: 'Manga Volume 1',
      description: 'First edition',
      categoryId: cat.id,
      attributes: {},
    });

    let stagedEvent: any = null;
    outbox.stageEvent = async (event: any) => {
      stagedEvent = event;
      return {} as any;
    };

    const moderated = await catalog.moderateProduct(prod.id, 'published');
    expect(moderated.status).toBe('published');
    expect(stagedEvent).not.toBeNull();
    expect(stagedEvent.name).toBe(DomainEventNames.PRODUCT_PUBLISHED);
    expect(stagedEvent.aggregateId).toBe(prod.id);
  });

  it('calculates Buy-Box winner and respects optimistic concurrency control', async () => {
    const cat = await catalog.createCategory({ slug: 'laptops', name: 'Laptops' });
    const prod = await catalog.createMasterProduct({
      title: 'Pro Laptop 16',
      description: 'Fast laptop',
      categoryId: cat.id,
      attributes: {},
    });

    const variant = await catalog.createVariant({
      masterProductId: prod.id,
      skuCanonical: 'LAPTOP-16-512',
      weightG: 2100,
      optionValues: { ram: '16GB', ssd: '512GB' },
    });

    // Seed two vendors
    const vendorA = { id: crypto.randomUUID(), business_name: 'Fast Vendor', tier: 'tier_2', status: 'active' };
    const vendorB = { id: crypto.randomUUID(), business_name: 'Slow Vendor', tier: 'tier_1', status: 'active' };
    db.tables['vendor.vendors'].push(vendorA, vendorB);

    // Vendor B creates offer at 500,000 NGN, 48 hours handling
    const offerB = await offers.createOffer({
      vendorId: vendorB.id,
      variantId: variant.id,
      condition: 'new',
      priceMinor: 50000000n,
      currency: 'NGN',
      handlingTimeHours: 48,
      shippingProfileId: crypto.randomUUID(),
      policyTemplateId: crypto.randomUUID(),
    });

    // Vendor A creates offer with faster handling (24h) and higher tier
    const offerA = await offers.createOffer({
      vendorId: vendorA.id,
      variantId: variant.id,
      condition: 'new',
      priceMinor: 49000000n,
      currency: 'NGN',
      handlingTimeHours: 24,
      shippingProfileId: crypto.randomUUID(),
      policyTemplateId: crypto.randomUUID(),
    });

    // Check Buy-Box winner
    const buyBox = await offers.recalculateBuyBox(variant.id);
    expect(buyBox.winningOfferId).toBe(offerA.id);

    // Optimistic Concurrency: Update price with matching version succeeds
    const updated = await offers.updateOfferPrice({
      offerId: offerA.id,
      newPriceMinor: 48000000n,
      expectedVersion: 1,
    });
    expect(updated.version).toBe(2);

    // Stale version update must throw ConflictException
    await expect(
      offers.updateOfferPrice({
        offerId: offerA.id,
        newPriceMinor: 47000000n,
        expectedVersion: 1, // now outdated (expected 2)
      })
    ).rejects.toThrow(/version mismatch/);
  });
});
