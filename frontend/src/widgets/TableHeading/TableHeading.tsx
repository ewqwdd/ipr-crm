import { cva } from '@/shared/lib/cva';

interface TableHeadingProps {
  headings: (
    | string
    | {
        label: string;
        className?: string;
      }
  )[];
}

export default function TableHeading({ headings }: TableHeadingProps) {
  return (
    <thead className="bg-gray-50">
      <tr>
        {headings.map((heading, index) => (
          <th
            scope="col"
            key={index}
            className={cva(
              'px-3 py-3.5 text-sm font-semibold text-gray-900 text-center',
              typeof heading !== 'string' ? heading?.className : '',
            )}
          >
            {typeof heading === 'string' ? heading : heading.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}
