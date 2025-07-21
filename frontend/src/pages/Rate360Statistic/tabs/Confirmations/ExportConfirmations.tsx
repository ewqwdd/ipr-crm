import { RateFilters } from '@/features/rate/RatesFilters';
import { SoftButton } from '@/shared/ui/SoftButton';
import { transformFiltersToParams } from './confirmations.config';
import { memo } from 'react';

interface ExportConfirmationsProps {
  filters: RateFilters;
  status?: RateFilters['status'];
}

export default memo(function ExportConfirmations({
  filters,
  status,
}: ExportConfirmationsProps) {
  const handleExport = async () => {
    const url = new URL(
      import.meta.env.VITE_API_URL + '/rate360/export/confirm',
    );
    const params = transformFiltersToParams({
      ...filters,
      status: status ?? 'ALL',
    });
    params.limit = undefined;

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });

    window.open(url);
  };

  return <SoftButton onClick={handleExport}>Экспортировать </SoftButton>;
});
