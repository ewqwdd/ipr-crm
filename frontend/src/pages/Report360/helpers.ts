export const calculateAverage = (values: number[]): number => {
  if (!values.length) return 0;
  return (
    Math.round((values.reduce((sum, v) => sum + v, 0) / values.length) * 100) /
    100
  );
};

export const dateFormatter = (date: string | null | undefined) => {
  if (!date) return '';
  const d = new Date(date);
  const options = {
    year: 'numeric' as const,
    month: 'numeric' as const,
    day: 'numeric' as const,
  };
  return d.toLocaleDateString(undefined, options);
};
