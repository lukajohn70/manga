/**
 * Manga Platform - Returns & Disputes Domain Model
 */

export type ReturnStatus =
  | 'requested'
  | 'pending_vendor_review'
  | 'approved'
  | 'rejected'
  | 'label_issued'
  | 'in_transit'
  | 'received'
  | 'inspected'
  | 'refund_issued'
  | 'closed';

export type ReturnReasonCode =
  | 'defective'
  | 'not_as_described'
  | 'wrong_item'
  | 'missing_parts'
  | 'buyer_remorse'
  | 'arrived_late';

export type DisputeStatus =
  | 'opened'
  | 'awaiting_evidence'
  | 'in_mediation'
  | 'resolved_buyer_favor'
  | 'resolved_vendor_favor'
  | 'settled_by_platform';

export interface ReturnItem {
  readonly id: string;
  readonly returnRequestId: string;
  readonly orderLineId: string;
  readonly qty: number;
  readonly conditionClaimed: string;
  readonly conditionGraded?: string;
}

export interface ReturnRequest {
  readonly id: string;
  readonly orderId: string;
  readonly shipmentGroupId: string;
  readonly status: ReturnStatus;
  readonly reasonCode: ReturnReasonCode;
  readonly resolutionRequested: 'refund' | 'exchange' | 'store_credit';
  readonly riskScore: number;
  readonly items: readonly ReturnItem[];
  readonly requestedAt: Date;
}

export interface DisputeCase {
  readonly id: string;
  readonly returnRequestId?: string;
  readonly orderId: string;
  readonly shipmentGroupId: string;
  readonly openedBy: 'buyer' | 'vendor';
  readonly status: DisputeStatus;
  readonly deadlineAt: Date;
  readonly outcome?: string;
  readonly ledgerTxId?: string;
}
