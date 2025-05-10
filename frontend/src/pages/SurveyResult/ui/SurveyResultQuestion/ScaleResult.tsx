import { Progress } from '@/shared/ui/Progress';

interface ScaleResultProps {
  values: number[];
  scaleDots: number;
  individual?: boolean;
}

export default function ScaleResult({
  scaleDots,
  values,
  individual,
}: ScaleResultProps) {
  return (
    <ul className="flex flex-col gap-3 max-w-md">
      {new Array(scaleDots).fill(0).map((_, index) => {
        const countAnswers = values.filter((v) => v === index + 1).length ?? 0;
        const percentage = values.length > 0 ? countAnswers / values.length : 0;
        return (
          <li
            key={index}
            className="flex flex-col gap-1 text-sm font-medium text-gray-700"
          >
            <div className="flex gap-4">
              <p className="flex-1 truncate">{index + 1}</p>
              {individual ? (
                <span className="text-indigo-600 size-5 rounded-full" />
              ) : (
                <p>
                  {countAnswers}{' '}
                  <span className="text-gray-500 font-normal min-w-10 inline-block text-right">
                    {Math.round(percentage * 100)}%
                  </span>
                </p>
              )}
            </div>
            {!individual && (
              <Progress
                percent={percentage}
                className="h-2 [&>figure]:bg-indigo-500 bg-gray-200 rounded-full"
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}
