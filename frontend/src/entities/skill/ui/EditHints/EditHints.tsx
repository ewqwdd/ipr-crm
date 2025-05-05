import { TableBody } from '@/widgets/TableBody';
import { TableHeading } from '@/widgets/TableHeading';
import { TextArea } from '@/shared/ui/TextArea';
import React, { memo } from 'react';

interface EditHintsProps {
  hitnsData: string[];
  setHintsData: React.Dispatch<React.SetStateAction<string[]>>;
  valuesData: string[];
  setValuesData: React.Dispatch<React.SetStateAction<string[]>>;
}

export default memo(function EditHints({
  hitnsData,
  setHintsData,
  setValuesData,
  valuesData,
}: EditHintsProps) {
  return (
    <table className="w-full first:[&_tbody_tr]:bg-red-100">
      <TableHeading
        headings={[
          {
            label: 'Варианты ответа',
            className: 'text-left pl-8',
          },
          'Подсказка',
        ]}
      />
      <TableBody
        data={hitnsData}
        columnRender={[
          {
            render: (_, index) => (
              <TextArea
                value={valuesData?.[index] ?? ''}
                onChange={(e) => {
                  setValuesData((prev) => {
                    const newData = [...prev];
                    newData[index] = e.target.value;
                    return newData;
                  });
                }}
                rows={2}
              />
            ),
            className: 'text-left',
          },
          {
            render: (data, index) => (
              <TextArea
                value={data}
                onChange={(e) => {
                  setHintsData((prev) => {
                    const newData = [...prev];
                    newData[index] = e.target.value;
                    return newData;
                  });
                }}
                rows={2}
              />
            ),
          },
        ]}
      />
    </table>
  );
});
