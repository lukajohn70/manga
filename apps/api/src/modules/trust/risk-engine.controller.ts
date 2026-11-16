import { Controller, Post, Body } from '@nestjs/common';
import { RiskEngineService, RiskEvaluationResult, RiskAction } from './risk-engine.service.js';

export class EvaluateRiskBodyDto {
  orderId?: string;
  buyerId?: string;
  orderAmountMinor!: string; // string representation of bigint
  currency!: string;
  deviceFingerprint?: string;
  ipAddress?: string;
  cardAttemptsLast10Min?: number;
  ordersFromIpLastHour?: number;
  buyerCompletedOrdersCount?: number;
  buyerReturnRatePercent?: number;
  shadowMode?: boolean;
}

@Controller('trust/risk')
export class RiskEngineController {
  constructor(private readonly riskEngine: RiskEngineService) {}

  @Post('evaluate')
  public async evaluateRisk(@Body() body: EvaluateRiskBodyDto): Promise<RiskEvaluationResult> {
    return await this.riskEngine.evaluateCheckoutRisk({
      orderId: body.orderId,
      buyerId: body.buyerId,
      orderAmountMinor: BigInt(body.orderAmountMinor),
      currency: body.currency,
      deviceFingerprint: body.deviceFingerprint,
      ipAddress: body.ipAddress,
      cardAttemptsLast10Min: body.cardAttemptsLast10Min,
      ordersFromIpLastHour: body.ordersFromIpLastHour,
      buyerCompletedOrdersCount: body.buyerCompletedOrdersCount,
      buyerReturnRatePercent: body.buyerReturnRatePercent,
      shadowMode: body.shadowMode,
    });
  }
}
