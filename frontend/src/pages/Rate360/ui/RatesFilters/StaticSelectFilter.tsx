import { SelectLight } from '@/shared/ui/SelectLight';
import { ChangeEvent, memo } from 'react';
interface StaticSelectFilterProps<T extends string | number> {
  label: string;
  options: {
    label: string;
    value: T;
  }[];
  value: T;
  onChange: (value: T) => void;
}

const StaticSelectFilter = <T extends string | number>({
  label,
  options,
  onChange,
  value,
}: StaticSelectFilterProps<T>) => {
  const onChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as T);
  };

  return (
    <div>
      <SelectLight label={label} onChange={onChangeHandler} value={value}>
        <option value={'ALL'}>{'Все'}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </SelectLight>
    </div>
  );
};

export default memo(StaticSelectFilter);
