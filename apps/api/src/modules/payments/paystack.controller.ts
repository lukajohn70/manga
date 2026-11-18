import {
  Controller,
  Post,
  Headers,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { PaystackPaymentProvider } from './paystack.provider.js';
import { DatabaseService } from '../../database/database.service.js';
import { LedgerService } from '../ledger/ledger.service.js';
import { OutboxService } from '../outbox/outbox.service.js';
import { DomainEventNames } from '@manga/domain';
import * as crypto from 'crypto';

@Controller('v1/payments')
export class PaystackController {
  private readonly paystackProvider: PaystackPaymentProvider;

  constructor(
    private readonly db: DatabaseService,
    private readonly ledger: LedgerService,
    private readonly outbox: OutboxService
  ) {
    this.paystackProvider = new PaystackPaymentProvider();
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  public async handleWebhook(
    @Headers('x-paystack-signature') signature: string,
    @Body() payload: any
  ) {
    if (this.paystackProvider.isLiveConfigured) {
      const rawString = typeof payload === 'string' ? payload : JSON.stringify(payload);
      if (!signature || !this.paystackProvider.verifyWebhookSignature(rawString, signature)) {
        throw new BadRequestException('Invalid Paystack HMAC signature');
      }
    }

    const event = payload?.event;
    const data = payload?.data;

    if (event === 'charge.success' && data) {
      const pspRef = data.reference;
      const amountMinor = BigInt(data.amount || 0);
      const currency = data.currency || 'NGN';
      const orderId = data.metadata?.orderId;

      if (orderId) {
        // Verify order exists and is not already processed
        const orderRes = await this.db.query(
          `SELECT * FROM orders.orders WHERE id = $1`,
          [orderId]
        );

        if (orderRes.rows.length > 0) {
          const order = orderRes.rows[0];

          if (order.status !== 'confirmed') {
            await this.db.query(
              `UPDATE orders.orders SET status = 'confirmed', updated_at = NOW() WHERE id = $1`,
              [orderId]
            );

            // Record payment capture
            await this.db.query(
              `INSERT INTO payments.payments (order_id, method, psp, psp_ref, status, amount_minor, currency, captured_at)
               VALUES ($1, 'paystack', 'paystack', $2, 'captured', $3, $4, NOW())
               ON CONFLICT DO NOTHING`,
              [orderId, pspRef, amountMinor.toString(), currency]
            );

            // Double-entry ledger escrow funding
            const pspAccountId = await this.ledger.getOrCreateAccount('psp_clearing', 'system', 'paystack', currency);
            const buyerFundsHeldAccountId = await this.ledger.getOrCreateAccount('buyer_funds_held', 'buyer', order.buyer_id, currency);

            await this.ledger.postPaymentCapture({
              orderId,
              grossAmountMinor: amountMinor,
              currency,
              idempotencyKey: `PSTK-WEBHOOK-${pspRef}`,
              pspAccountId,
              buyerFundsHeldAccountId,
            });

            // Stage outbox event for notifications and vendor dispatch
            await this.outbox.stageEvent({
              id: crypto.randomUUID(),
              name: DomainEventNames.ORDER_CONFIRMED,
              aggregateType: 'order',
              aggregateId: orderId,
              correlationId: crypto.randomUUID(),
              timestamp: new Date(),
              payload: {
                orderId,
                orderNumber: order.order_number,
                pspRef,
                amountMinor: amountMinor.toString(),
                currency,
              },
            });

            console.log(`[PaystackController] Order ${order.order_number} confirmed via webhook. Reference: ${pspRef}`);
          }
        }
      }
    }

    return { received: true };
  }
}
