import { matchPath, useLocation } from "react-router";

export function useIsOnPage(patterns: string[]): boolean {
  const { pathname } = useLocation();

  return patterns.some(
    (pattern) => !!matchPath({ path: pattern, end: true }, pathname),
  );
}
