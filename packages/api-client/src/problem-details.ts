/**
 * RFC 9457 Problem Details for HTTP APIs
 */
export interface ProblemDetails {
  readonly type?: string;
  readonly title: string;
  readonly status: number;
  readonly detail?: string;
  readonly instance?: string;
  readonly code: string;
  readonly traceId?: string;
  readonly invalidParams?: ReadonlyArray<{
    readonly name: string;
    readonly reason: string;
  }>;
}

export class MangaApiError extends Error {
  public readonly problem: ProblemDetails;

  constructor(problem: ProblemDetails) {
    super(problem.detail || problem.title);
    this.name = 'MangaApiError';
    this.problem = problem;
  }
}
