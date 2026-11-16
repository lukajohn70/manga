import { NotificationService } from './notifications/notification.service.js';
import { OutboxProcessorWorker } from './worker.service.js';

export async function bootstrapWorker(): Promise<void> {
  console.log('Starting Manga Platform Background Workers (Transactional Outbox & Notifications)...');
  const notificationService = new NotificationService();
  const worker = new OutboxProcessorWorker(notificationService);

  console.log('Notification Channels initialized: [Email, SMS, WhatsApp Business, Web Push].');
  console.log('Outbox Consumer Worker ready.');
}

if (process.env.NODE_ENV !== 'test') {
  bootstrapWorker().catch((err) => {
    console.error('Worker bootstrap failed:', err);
    process.exit(1);
  });
}
