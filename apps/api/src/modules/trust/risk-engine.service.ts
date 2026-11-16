import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.js';
import { OutboxService } from '../outbox/outbox.service.js';
import { DomainEventNames } from '@manga/domain';

export type RiskAction = 'allow' | 'require_3ds_otp' | 'hold_review' | 'deny';

export interface EvaluateRiskDto {
  orderId?: string;
  buyerId?: string;
  orderAmountMinor: bigint;
  currency: string;
  deviceFingerprint?: string;
  ipAddress?: string;
  cardAttemptsLast10Min?: number;
  ordersFromIpLastHour?: number;
  buyerCompletedOrdersCount?: number;
  buyerReturnRatePercent?: number;
  shadowMode?: boolean;
}

export interface RiskEvaluationResult {
  evaluationId: string;
  action: RiskAction;
  riskScore: number; // 0 to 100
  matchedRules: string[];
  shadowMode: boolean;
  evaluatedAt: Date;
}

@Injectable()
export class RiskEngineService {
  private readonly logger = new Logger(RiskEngineService.name);

  // Blacklisted device fingerprints (e.g. known emulator/bot farm signatures)
  private readonly blacklistedFingerprints = new Set<string>([
    'fp_emulator_nox_001',
    'fp_botfarm_headless_99',
  ]);

  constructor(
    private readonly db: DatabaseService,
    private readonly outbox: OutboxService
  ) {}

  /**
   * Synchronous lightweight rule evaluation at checkout (< 100ms) (§13)
   */
  public async evaluateCheckoutRisk(dto: EvaluateRiskDto): Promise<RiskEvaluationResult> {
    const matchedRules: string[] = [];
    let riskScore = 0;
    let action: RiskAction = 'allow';

    // Rule 1: Device Reputation Check
    if (dto.deviceFingerprint && this.blacklistedFingerprints.has(dto.deviceFingerprint)) {
      matchedRules.push('RULE_BLACKLISTED_DEVICE_FINGERPRINT');
      riskScore += 90;
      action = 'deny';
    }

    // Rule 2: IP Velocity Check (>= 5 orders from same IP in 1 hour)
    if (dto.ordersFromIpLastHour && dto.ordersFromIpLastHour >= 5) {
      matchedRules.push('RULE_HIGH_IP_VELOCITY');
      riskScore += 45;
      if (action !== 'deny') action = 'hold_review';
    }

    // Rule 3: Card Attempt Velocity (>= 3 attempts in 10 minutes)
    if (dto.cardAttemptsLast10Min && dto.cardAttemptsLast10Min >= 3) {
      matchedRules.push('RULE_CARD_ATTEMPT_VELOCITY');
      riskScore += 40;
      if (action !== 'deny' && action !== 'hold_review') {
        action = 'require_3ds_otp';
      }
    }

    // Rule 4: High Value Order Threshold (> ₦2,000,000 with 0 prior completed orders)
    const HIGH_VALUE_THRESHOLD = 200000000n; // 2,000,000.00 minor units
    if (
      dto.orderAmountMinor > HIGH_VALUE_THRESHOLD &&
      (!dto.buyerCompletedOrdersCount || dto.buyerCompletedOrdersCount === 0)
    ) {
      matchedRules.push('RULE_NEW_BUYER_HIGH_VALUE_THRESHOLD');
      riskScore += 35;
      if (action === 'allow') {
        action = 'require_3ds_otp';
      }
    }

    // Rule 5: Serial Return Abuse (Return rate > 60% with >= 5 orders)
    if (
      dto.buyerCompletedOrdersCount &&
      dto.buyerCompletedOrdersCount >= 5 &&
      dto.buyerReturnRatePercent &&
      dto.buyerReturnRatePercent > 60
    ) {
      matchedRules.push('RULE_EXCESSIVE_RETURN_RATE');
      riskScore += 30;
      if (action === 'allow') {
        action = 'hold_review';
      }
    }

    // Cap score at 100
    riskScore = Math.min(riskScore, 100);

    const evaluationId = crypto.randomUUID();
    const evaluatedAt = new Date();
    const shadowMode = dto.shadowMode ?? false;

    // Persist evaluation
    await this.db.query(
      `INSERT INTO trust.risk_evaluations (
        id, order_id, buyer_id, risk_score, action, matched_rules, device_fingerprint, ip_address, shadow_mode, created_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        evaluationId,
        dto.orderId ?? null,
        dto.buyerId ?? null,
        riskScore,
        action,
        JSON.stringify(matchedRules),
        dto.deviceFingerprint ?? null,
        dto.ipAddress ?? null,
        shadowMode,
        evaluatedAt,
      ]
    );

    // If flagged and not safe, stage domain event
    if (action !== 'allow' || riskScore >= 50) {
      await this.outbox.stageEvent({
        id: crypto.randomUUID(),
        name: DomainEventNames.RISK_FLAGGED,
        aggregateType: 'risk',
        aggregateId: evaluationId,
        correlationId: crypto.randomUUID(),
        timestamp: evaluatedAt,
        payload: {
          evaluationId,
          orderId: dto.orderId,
          buyerId: dto.buyerId,
          riskScore,
          action,
          matchedRules,
          shadowMode,
        },
      });
    }

    return {
      evaluationId,
      action: shadowMode ? 'allow' : action, // If in shadow mode, allow passes through
      riskScore,
      matchedRules,
      shadowMode,
      evaluatedAt,
    };
  }
}
