import { useState } from 'react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { Combobox } from '@headlessui/react';
import { cva } from '@/shared/lib/cva';
import { Badge } from '../Badge';

type SelectValue = { id: number; name: string };

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

interface SearchSelectMultipleProps {
  value?: SelectValue[];
  setValue: (value: SelectValue[]) => void;
  options: SelectValue[];
  loading?: boolean;
  label?: string;
}

export default function SearchSelectMultiple({
  setValue,
  value = [],
  options,
  loading,
  label,
}: SearchSelectMultipleProps) {
  const [query, setQuery] = useState('');

  const filteredData =
    query === ''
      ? options
      : options.filter((option) =>
          option.name.toLowerCase().includes(query.toLowerCase()),
        );

  const handleSelect = (selected: SelectValue) => {
    console.log(selected);
    const index = value.findIndex((item) => item.id === selected.id);
    if (index === -1) {
      setValue([...value, selected]);
    } else {
      setValue(value.filter((item) => item.id !== selected.id));
    }
  };

  return (
    // @ts-ignore asdasdasdas
    <Combobox
      as="div"
      value={value}
      onChange={handleSelect}
      className={cva({ 'animate-pulse': !!loading })}
    >
      <Combobox.Label className="block text-sm font-medium text-gray-700">
        {label}
      </Combobox.Label>
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Поиск..."
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none h-[38px]">
          <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {/* Выбранные элементы */}
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((item) => (
            <Badge key={item.id} color="gray" size="sm">
              {item.name}
            </Badge>
          ))}
        </div>

        {filteredData.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredData.map((option) => (
              <Combobox.Option
                key={option.id}
                value={option}
                className={({ active }) =>
                  classNames(
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                  )
                }
              >
                {({ active }) => (
                  <>
                    <span
                      className={classNames(
                        'block truncate',
                        value.some((item) => item.id === option.id) &&
                          'font-semibold',
                      )}
                    >
                      {option.name}
                    </span>
                    {value.some((item) => item.id === option.id) && (
                      <span
                        className={classNames(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          active ? 'text-white' : 'text-indigo-600',
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
