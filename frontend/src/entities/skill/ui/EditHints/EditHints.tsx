import { TableBody } from '@/widgets/TableBody';
import { TableHeading } from '@/widgets/TableHeading';
import { hintsTitle } from '../../config/hints';
import { TextArea } from '@/shared/ui/TextArea';
import React, { memo } from 'react';

interface EditHintsProps {
  data: string[];
  setData: React.Dispatch<React.SetStateAction<string[]>>;
}

export default memo(function EditHints({ data, setData }: EditHintsProps) {
  return (
    <table className="w-full">
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
        data={data}
        columnRender={[
          {
            render: (_, index) => (
              <span className="whitespace-normal text-left">
                {hintsTitle[(index + 1) as keyof typeof hintsTitle]}
              </span>
            ),
            className: 'text-left pl-8 max-w-40',
          },
          {
            render: (data, index) => (
              <TextArea
                value={data}
                onChange={(e) => {
                  setData((prev) => {
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
