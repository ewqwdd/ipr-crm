import { useAppDispatch } from '@/app';
import { Spec } from '@/entities/user';
import { teamsApi } from '@/shared/api/teamsApi';
import { $api } from '@/shared/lib/$api';
import { Checkbox } from '@/shared/ui/Checkbox';
import { SoftButton } from '@/shared/ui/SoftButton';
import { MinusCircleIcon, PencilIcon } from '@heroicons/react/outline';
import { useState } from 'react';

interface SpecializationTableItemProps {
  row: Spec;
  selectedSpec: number | null;
  selectSpecialization: (row: SpecializationTableItemProps['row']) => void;
  deleteFn: (id: number) => void;
  openModal: (modalType: string, data: unknown) => void;
}

export default function SpecializationTableItem({
  deleteFn,
  openModal,
  row,
  selectSpecialization,
  selectedSpec,
}: SpecializationTableItemProps) {
  const [active, setActive] = useState(!!row.active);
  const dispatch = useAppDispatch();

  const onChangeActive = () => {
    setActive(!active);
    $api
      .put('/universal/specs/' + row.id + '/active', {
        active: !active,
      })
      .then(() => {
        dispatch(teamsApi.util.invalidateTags(['Team']));
      })
      .catch((e) => {
        console.log(e);
        setActive(active);
      });
  };

  return (
    <tr
      key={row.id}
      className={`hover:bg-gray-200 cursor-pointer border-b border-gray-300 ${selectedSpec === row.id ? 'bg-gray-200' : ''}`}
      onClick={() => selectSpecialization(row)}
    >
      <td className=" p-2">
        <div
          className={`hover:text-indigo-600 ${selectedSpec === row.id ? 'text-indigo-600' : ''}`}
        >
          {row.name}
        </div>
      </td>
      <td className=" p-2 text-center">
        <Checkbox
          className="justify-center"
          checked={active}
          onClick={(e) => e.stopPropagation()}
          onChange={onChangeActive}
        />
      </td>
      <td className=" p-2 text-center"></td>

      <td className=" p-2 text-center">
        <div className="flex gap-2">
          <SoftButton
            className="rounded-full p-2"
            size="xs"
            onClick={(e) => {
              e.stopPropagation();
              openModal('EDIT_SPECIALIZATION', {
                id: row.id,
                name: row.name,
                description: row?.description,
              });
            }}
          >
            <PencilIcon className="h-5 w-5" />
          </SoftButton>
          <SoftButton
            size="xs"
            className="rounded-full text-red p-2"
            onClick={(e) => {
              e.stopPropagation();
              openModal('CONFIRM', {
                onSubmit: () => deleteFn(row.id),
              });
            }}
          >
            <MinusCircleIcon className="stroke-red-500 h-5 w-5" />
          </SoftButton>
        </div>
      </td>
    </tr>
  );
}
