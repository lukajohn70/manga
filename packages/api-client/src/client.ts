import { MangaApiError, ProblemDetails } from './problem-details.js';

export interface MangaClientConfig {
  baseUrl: string;
  getAuthToken?: () => Promise<string | null> | string | null;
  getCorrelationId?: () => string;
}

export class MangaApiClient {
  private baseUrl: string;
  private getAuthToken?: () => Promise<string | null> | string | null;
  private getCorrelationId?: () => string;

  constructor(config: MangaClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.getAuthToken = config.getAuthToken;
    this.getCorrelationId = config.getCorrelationId;
  }

  public async request<TResponse>(
    path: string,
    options: RequestInit & { idempotencyKey?: string } = {}
  ): Promise<TResponse> {
    const url = `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
    const headers = new Headers(options.headers);

    headers.set('Accept', 'application/json');
    if (!headers.has('Content-Type') && options.body) {
      headers.set('Content-Type', 'application/json');
    }

    if (options.idempotencyKey) {
      headers.set('Idempotency-Key', options.idempotencyKey);
    }

    if (this.getCorrelationId) {
      headers.set('X-Correlation-Id', this.getCorrelationId());
    }

    if (this.getAuthToken) {
      const token = await this.getAuthToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let problem: ProblemDetails;
      try {
        problem = (await response.json()) as ProblemDetails;
      } catch {
        problem = {
          title: response.statusText || 'HTTP Error',
          status: response.status,
          code: `HTTP_${response.status}`,
        };
      }
      throw new MangaApiError(problem);
    }

    if (response.status === 204) {
      return undefined as TResponse;
    }

    return (await response.json()) as TResponse;
  }
}
