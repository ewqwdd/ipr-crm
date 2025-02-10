export type Assesment = Record<
  number,
  Record<number, Record<number, { rate?: number; comment?: string }>>
>;
