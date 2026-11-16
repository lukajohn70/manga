import * as React from 'react';
import { Button } from '@manga/ui';

export function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h2>Manga Vendor Console</h2>
      <p>Manage orders, SLA timers, stock levels, and fulfillment.</p>
      <Button variant="primary">View Pending Orders</Button>
    </div>
  );
}
