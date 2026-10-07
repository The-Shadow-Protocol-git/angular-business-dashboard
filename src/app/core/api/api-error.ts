import { HttpErrorResponse } from '@angular/common/http';

export function apiErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof HttpErrorResponse)) return fallback;
  if (error.status === 0) return 'Unable to connect to the service. Check your connection and try again.';
  if (error.status === 404) return 'The requested record could not be found.';
  if (error.status >= 500) return 'The service is temporarily unavailable. Please try again.';
  return fallback;
}
