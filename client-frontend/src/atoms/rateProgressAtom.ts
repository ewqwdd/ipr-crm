import { atom } from "jotai";

export interface RateProgresItem {
  indicatorId: number;
  rate?: number;
}

const rateProgressAtom = atom<RateProgresItem[]>([]);
const rateProgressErrorsAtom = atom<number[]>([]);

const setRatesProgress = atom(null, (_, set, rates: RateProgresItem[]) => {
  set(rateProgressAtom, rates);
});

const setRateProgress = atom(null, (get, set, rate: RateProgresItem) => {
  const prevRates = get(rateProgressAtom);
  if (!prevRates.find((r) => r.indicatorId === rate.indicatorId)) {
    set(rateProgressAtom, [...prevRates, rate]);
    return;
  } else {
    set(rateProgressAtom, (prev) =>
      prev.map((r) => (r.indicatorId === rate.indicatorId ? rate : r)),
    );
  }
});

export {
  setRatesProgress,
  setRateProgress,
  rateProgressAtom,
  rateProgressErrorsAtom,
};
