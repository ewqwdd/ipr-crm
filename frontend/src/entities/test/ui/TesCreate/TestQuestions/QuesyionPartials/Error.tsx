import { useAppSelector } from '@/app';

interface ErrorProps {
  index: number;
}

export default function Error({ index }: ErrorProps) {
  const error = useAppSelector(
    (state) => state.testCreate.questions[index].error,
  );
  return error && <span className="font-medium text-red-500">{error}</span>;
}
