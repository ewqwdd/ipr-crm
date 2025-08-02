import { useRatesCounter } from "@/shared/hooks/ratesCounter";

export default function RateNotifications() {
  const count = useRatesCounter();

  return count > 0 ? count : null;
}
