/**
 * Manga Platform - Shipping & Tracking Domain Model
 */

export type CanonicalTrackingStatus =
  | 'label_created'
  | 'picked_up'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'failed_attempt'
  | 'exception'
  | 'returned_to_sender';

export interface TrackingLocation {
  readonly city?: string;
  readonly stateOrProvince?: string;
  readonly countryCode?: string;
  readonly facilityName?: string;
}

export interface TrackingEvent {
  readonly id: string;
  readonly shipmentId: string;
  readonly statusCanonical: CanonicalTrackingStatus;
  readonly carrierStatus: string;
  readonly occurredAt: Date;
  readonly location?: TrackingLocation;
  readonly sourceEventId: string;
  readonly seq: number;
}

export interface ParcelDimensions {
  readonly lengthMm: number;
  readonly widthMm: number;
  readonly heightMm: number;
}

export interface Parcel {
  readonly id: string;
  readonly shipmentId: string;
  readonly dimensionsMm: ParcelDimensions;
  readonly weightGrams: number;
}

export interface Shipment {
  readonly id: string;
  readonly shipmentGroupId: string;
  readonly carrierId: string;
  readonly serviceCode: string;
  readonly trackingNumber: string;
  readonly labelUrl?: string;
  readonly costMinor: bigint;
  readonly weightGrams: number;
  readonly pickupRef?: string;
  readonly createdAt: Date;
}
