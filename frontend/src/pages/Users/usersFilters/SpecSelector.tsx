import { Option } from '@/shared/types/Option';
import { FC } from 'react';
import { MultiValue } from 'react-select';
import Select from 'react-select';

type SpecSelectorProps = {
  options: Option[];
  value: MultiValue<Option>;
  onChange: (newValue: MultiValue<Option>) => void;
};

const SpecSelector: FC<SpecSelectorProps> = ({ options, value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Специализация
      </label>
      <Select
        placeholder="Выберите специализации"
        isMulti
        name="teams"
        onChange={onChange}
        options={options}
        value={value}
        classNamePrefix="select"
      />
    </div>
  );
};

export default SpecSelector;
