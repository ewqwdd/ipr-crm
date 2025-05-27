export function isFetchBaseQueryError(
  error: unknown,
): error is { status: number; data?: { message?: string } } {
  return typeof error === 'object' && error !== null && 'data' in error;
}
