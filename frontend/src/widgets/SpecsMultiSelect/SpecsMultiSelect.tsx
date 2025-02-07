import { universalApi } from '@/shared/api/universalApi';
import { cva } from '@/shared/lib/cva';
import { Option } from '@/shared/types/Option';
import Select, { ActionMeta, MultiValue } from 'react-select';

interface SpecsMultiSelectProps {
  value?: MultiValue<Option>;
  onChange?: (
    newValue: MultiValue<Option>,
    actionMeta: ActionMeta<Option>,
  ) => void;
  loading?: boolean;
}

export default function SpecsMultiSelect({
  onChange,
  value,
  loading,
}: SpecsMultiSelectProps) {
  const { data, isLoading } = universalApi.useGetSpecsQuery();

  const options =
    data?.map((spec) => ({ value: spec.id, label: spec.name })) ?? [];

  return (
    <Select
      placeholder="Выберите специализации"
      isMulti
      name="specs"
      onChange={onChange}
      options={options}
      value={value}
      className={cva('basic-multi-select', {
        'animate-pulse pointer-events-none': !!loading || isLoading,
      })}
      classNamePrefix="select"
    />
  );
}
