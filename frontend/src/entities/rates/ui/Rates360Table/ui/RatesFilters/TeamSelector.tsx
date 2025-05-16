import { Option } from '@/shared/types/Option';
import { FC, memo } from 'react';
import { MultiValue } from 'react-select';
import Select from 'react-select';
interface TeamSelectorProps {
  options: Option[];
  value: MultiValue<Option>;
  onChange: (newValue: MultiValue<Option>) => void;
}

const TeamSelector: FC<TeamSelectorProps> = ({ options, value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Команда
      </label>
      <Select
        placeholder="Выберите команды"
        isMulti
        name="teams"
        onChange={onChange}
        options={options}
        value={value}
        classNamePrefix="select"
        classNames={{
          menu: () => '!z-20',
        }}
      />
    </div>
  );
};

export default memo(TeamSelector);
