import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function getSnapshot() {
  return window.innerWidth;
}

export const useScreenWidth = () =>
  useSyncExternalStore(subscribe, getSnapshot);

export const useIsMobile = () => useScreenWidth() <= 1024;
