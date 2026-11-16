import { CanonicalTrackingStatus, TrackingEvent } from '@manga/domain';

export interface RateQuoteRequest {
  originPostalOrCity: string;
  destinationPostalOrCity: string;
  weightG: number;
}

export interface RateQuote {
  carrierId: string;
  serviceCode: string;
  serviceName: string;
  rateMinor: bigint;
  currency: string;
  estimatedTransitDays: number;
}

export interface CreateShipmentParams {
  shipmentGroupId: string;
  recipientAddress: any;
  senderAddress: any;
  weightG: number;
}

export interface ShipmentLabelResult {
  carrierId: string;
  serviceCode: string;
  trackingNumber: string;
  labelUrl: string;
  costMinor: bigint;
}

export interface CarrierAdapter {
  carrierId: string;
  getRates(params: RateQuoteRequest): Promise<RateQuote[]>;
  createShipment(params: CreateShipmentParams): Promise<ShipmentLabelResult>;
  mapCarrierStatus(rawStatus: string): CanonicalTrackingStatus;
}

export class MockCarrierAdapter implements CarrierAdapter {
  public carrierId = 'mock_carrier_logistics';

  public async getRates(params: RateQuoteRequest): Promise<RateQuote[]> {
    return [
      {
        carrierId: this.carrierId,
        serviceCode: 'EXPRESS_PARCEL',
        serviceName: 'Express 48h Delivery',
        rateMinor: 150000n, // 1,500 NGN
        currency: 'NGN',
        estimatedTransitDays: 2,
      },
    ];
  }

  public async createShipment(params: CreateShipmentParams): Promise<ShipmentLabelResult> {
    const trackingNumber = `TRK-${Date.now().toString().slice(-6)}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
    return {
      carrierId: this.carrierId,
      serviceCode: 'EXPRESS_PARCEL',
      trackingNumber,
      labelUrl: `https://labels.manga.internal/${trackingNumber}.pdf`,
      costMinor: 150000n,
    };
  }

  public mapCarrierStatus(rawStatus: string): CanonicalTrackingStatus {
    const normalized = rawStatus.toUpperCase();
    if (normalized.includes('DELIVERED')) return 'delivered';
    if (normalized.includes('OUT_FOR_DELIVERY') || normalized.includes('WITH_COURIER'))
      return 'out_for_delivery';
    if (normalized.includes('IN_TRANSIT') || normalized.includes('HUB_SCANNED'))
      return 'in_transit';
    if (normalized.includes('PICKED_UP')) return 'picked_up';
    if (normalized.includes('FAIL') || normalized.includes('MISSED'))
      return 'failed_attempt';
    if (normalized.includes('RETURN')) return 'returned_to_sender';
    return 'label_created';
  }
}
