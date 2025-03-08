import { FC } from 'react';
import { Competency, Indicator } from '@/entities/skill';
import Select, { SingleValue } from 'react-select';

type SelectMaterialWrapperProps = {
  data: Competency[] | Indicator[];
  selected: number;
  select: (wrapperId: number) => void;
};

interface OptionType {
  value: number;
  label: string;
}

const SelectMaterialWrapper: FC<SelectMaterialWrapperProps> = ({
  data,
  selected,
  select,
}) => {
  const options = data?.length
    ? [
        ...data.map((item) => ({
          value: item.id,
          label: item.name,
        })),
        { value: -1, label: 'Не выбрано' },
      ]
    : [];

  const selectHendler = (newValue: SingleValue<OptionType>) => {
    if (newValue) {
      select(newValue.value);
    }
  };

  return (
    <Select
      name="colors"
      onChange={selectHendler}
      options={options}
      value={
        options.find((option) => option.value === selected) ?? {
          value: -1,
          label: 'Не выбрано',
        }
      }
      // TODO: ADD LOADING
      classNamePrefix="select"
    />
  );
};

export default SelectMaterialWrapper;
