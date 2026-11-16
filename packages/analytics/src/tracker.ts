import { AnalyticsEvent } from './taxonomy.js';

export interface AnalyticsDestination {
  send(event: AnalyticsEvent): Promise<void> | void;
}

export class AnalyticsTracker {
  private destinations: AnalyticsDestination[] = [];

  public addDestination(destination: AnalyticsDestination): void {
    this.destinations.push(destination);
  }

  public async track(event: AnalyticsEvent): Promise<void> {
    await Promise.allSettled(this.destinations.map((d) => d.send(event)));
  }
}

export * from './taxonomy.js';
