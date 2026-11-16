import * as React from 'react';
import { Button, Badge } from '@manga/ui';

export function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h2>Manga Admin Console</h2>
      <Badge variant="warning">MFA Enforced</Badge>
      <p>Marketplace oversight: vendor tiers, ledger audit, commission rules, repair tools.</p>
      <Button variant="primary">Audit Log</Button>
    </div>
  );
}
