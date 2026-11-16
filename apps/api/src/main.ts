import { LedgerService } from './modules/ledger/ledger.service.js';
import { InventoryService } from './modules/inventory/inventory.service.js';
import { OutboxService } from './modules/outbox/outbox.service.js';

export async function bootstrap(): Promise<void> {
  console.log('Starting Manga Platform Modular Monolith API...');
  const ledgerService = new LedgerService();
  const inventoryService = new InventoryService();
  const outboxService = new OutboxService();

  console.log('Manga Core Services initialized successfully.');
}

if (process.env.NODE_ENV !== 'test') {
  bootstrap().catch((err) => {
    console.error('API bootstrap failed:', err);
    process.exit(1);
  });
}
