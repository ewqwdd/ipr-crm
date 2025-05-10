import { memo } from 'react';

interface TextValueResultProps {
  values: string[];
  individual?: boolean;
}

export default memo(function TextValueResult({
  values,
  individual,
}: TextValueResultProps) {
  return (
    <ul className="flex flex-col gap-3 max-w-md">
      {Array.from(new Set(values))?.map((value, index) => {
        const countAnswers = values.filter((v) => v === value).length ?? 0;
        const percentage =
          values.length > 0
            ? Math.round((countAnswers / values.length) * 100)
            : 0;
        return (
          <li
            key={index}
            className="flex flex-col gap-1 text-sm font-medium text-gray-700"
          >
            <div className="flex gap-4">
              <p className="flex-1 truncate">{value}</p>
              {individual ? (
                <span className="text-indigo-600 size-5 rounded-full" />
              ) : (
                <p>
                  {countAnswers}{' '}
                  <span className="text-gray-500 font-normal min-w-10 inline-block text-right">
                    {percentage}%
                  </span>
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
});
