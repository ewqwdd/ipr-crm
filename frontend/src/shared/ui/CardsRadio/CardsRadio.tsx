import { RadioGroup } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { cva } from '@/shared/lib/cva';

interface RadioElement {
  title: string;
  description?: string;
  key: string;
}

interface CardsRadioProps {
  selected: string;
  elements: RadioElement[];
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export default function CardsRadio({
  selected,
  elements,
  onChange,
  label,
  className,
}: CardsRadioProps) {
  return (
    <RadioGroup value={selected} onChange={onChange}>
      {label && (
        <RadioGroup.Label className="text-base font-medium text-gray-900">
          {label}
        </RadioGroup.Label>
      )}

      <div
        className={cva(
          'mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4',
          className,
        )}
      >
        {elements.map((elem) => (
          <RadioGroup.Option
            key={elem.key}
            value={elem.key}
            className={({ checked, active }) =>
              cva(
                'relative bg-white border rounded-lg shadow-sm p-4 flex cursor-pointer focus:outline-none border-gray-300',
                {
                  'border-transparent': checked,
                  'border-indigo-500 ring-2 ring-indigo-500': active,
                },
              )
            }
          >
            {({ checked, active }) => (
              <>
                <div className="flex-1 flex">
                  <div className="flex flex-col">
                    <RadioGroup.Label
                      as="span"
                      className="block text-sm font-medium text-gray-900"
                    >
                      {elem.title}
                    </RadioGroup.Label>
                    <RadioGroup.Description
                      as="span"
                      className="mt-1 flex items-center text-sm text-gray-500"
                    >
                      {elem.description}
                    </RadioGroup.Description>
                  </div>
                </div>
                <CheckCircleIcon
                  className={cva('h-5 w-5 text-indigo-600', {
                    invisible: !checked,
                  })}
                  aria-hidden="true"
                />
                <div
                  className={cva(
                    'absolute -inset-px rounded-lg pointer-events-none border-transparent border-2',
                    {
                      border: active,
                      'border-indigo-500': checked,
                    },
                  )}
                  aria-hidden="true"
                />
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}
