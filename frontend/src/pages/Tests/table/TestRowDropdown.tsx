import { Dropdown } from '@/shared/ui/Dropdown';
import { DotsVerticalIcon } from '@heroicons/react/outline';
import { FC } from 'react';

export const TestRowDropdown: FC = () => {
  return (
    <Dropdown
      button={<DotsVerticalIcon className="w-5 h-5" />}
      btnClassName="text-indigo-500 transition-all duration-100 p-1"
    >
      <div></div>
    </Dropdown>
  );
};
