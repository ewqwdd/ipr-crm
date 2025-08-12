import { useModal } from '@/app/hooks/useModal';
import { caseApi } from '@/shared/api/caseApi';
import { cva } from '@/shared/lib/cva';
import { Checkbox } from '@/shared/ui/Checkbox';
import { Heading } from '@/shared/ui/Heading';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { SoftButton } from '@/shared/ui/SoftButton';
import { ActionBar } from '@/widgets/ActionBar';
import { TableBody } from '@/widgets/TableBody';
import { TableHeading } from '@/widgets/TableHeading';
import { DocumentIcon, TrashIcon } from '@heroicons/react/outline';
import { useState } from 'react';

export default function Cases() {
  const { data, isLoading, isFetching } = caseApi.useGetCasesQuery();
  const { openModal } = useModal();
  const [checked, setChecked] = useState<number[]>([]);
  const [deleteCases, { isLoading: deleteLoading }] =
    caseApi.useDeleteCasesMutation();

  return (
    <LoadingOverlay active={isLoading}>
      <div
        className={cva('sm:px-8 sm:py-10 px-4 py-6 flex flex-col sm:h-full', {
          'animate-pulse pointer-events-none': isFetching || deleteLoading,
        })}
      >
        <div className="flex max-sm:flex-col-reverse max-sm:gap-2 items-start">
          <Heading title="Кейсы" description={'Список кейсов'} />
          <PrimaryButton onClick={() => openModal('CREATE_CASE')}>
            Создать кейс
          </PrimaryButton>
        </div>
        <div className="max-sm:max-w-full overflow-x-auto">
          <table className="sm:w-full divide-y divide-gray-300 mt-2">
            <TableHeading
              headings={['', 'Название', 'Описание', 'Варианты ответа', '']}
            />
            <TableBody
              data={data || []}
              columnRender={[
                {
                  render: ({ id }, i) => (
                    <div className="flex items-center gap-3">
                      <Checkbox
                        title={i + 1}
                        checked={checked.includes(id)}
                        onChange={() => {
                          if (checked.includes(id)) {
                            setChecked(checked.filter((item) => item !== id));
                          } else {
                            setChecked([...checked, id]);
                          }
                        }}
                      />
                    </div>
                  ),
                },
                {
                  render: (item) => (
                    <span className="text-gray-600 font-medium block max-w-72 sm:max-w-[28vw] text-center overflow-hidden whitespace-nowrap text-ellipsis">
                      {item.name}
                    </span>
                  ),
                },
                {
                  render: (item) => (
                    <span className="text-gray-600 font-medium block max-w-56 sm:max-w-[20vw] text-center overflow-hidden whitespace-nowrap text-ellipsis">
                      {item.description}
                    </span>
                  ),
                },
                {
                  render: (item) => (
                    <div className="flex items-center gap-4 justify-center text-base text-gray-900">
                      {item.variants.length}
                      <SoftButton
                        className="size-10 p-0 rounded-full"
                        onClick={() => openModal('EDIT_CASE', { data: item })}
                      >
                        <DocumentIcon className="size-6" />
                      </SoftButton>
                    </div>
                  ),
                },
                {
                  render: (item) => (
                    <button
                      className="text-indigo-600 font-medium"
                      onClick={() => openModal('EDIT_CASE', { data: item })}
                    >
                      Изменить
                    </button>
                  ),
                },
              ]}
            />
          </table>
        </div>
        {checked.length > 0 && (
          <ActionBar
            clearSelected={() => setChecked([])}
            selected={checked}
            buttonsConfig={[
              {
                danger: true,
                icon: <TrashIcon />,
                label: 'Удалить',
                onClick: () => {
                  setChecked([]);
                  deleteCases(checked);
                },
              },
            ]}
          />
        )}
      </div>
    </LoadingOverlay>
  );
}
