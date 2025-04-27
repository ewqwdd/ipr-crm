import { useAppDispatch } from '@/app';
import { Rate } from '@/entities/rates';
import { iprApi } from '@/shared/api/iprApi';
import { rate360Api } from '@/shared/api/rate360Api';
import { cva } from '@/shared/lib/cva';
import { Link } from 'react-router';

interface IprButtonProps {
  rate: Rate;
}

export default function IprButton({ rate }: IprButtonProps) {
  const [mutate, { isLoading }] = iprApi.useCreateIprMutation();
  const dispatch = useAppDispatch();

  const handleClick = async () => {
    await mutate(rate.id);
    dispatch(rate360Api.util.invalidateTags(['Rate360', 'UserRates']));
  };

  if (!rate.plan) {
    return (
      <button
        onClick={handleClick}
        className={cva('text-indigo-600 font-medium text-sm', {
          'pointer-events-none animate-pulse': isLoading,
        })}
      >
        Сформировать ИПР
      </button>
    );
  }

  return (
    <Link
      to={`/ipr/360/${rate.plan.id}`}
      className="font-medium text-indigo-600 text-sm hover:text-violet-600 transition-all"
    >
      ИПР
    </Link>
  );
}
