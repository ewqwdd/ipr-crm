import { RateEvaluatorResponse } from '@/entities/rates';
import { countRateProgress } from '@/entities/rates/model/countRateProgress';
import { $api } from '@/shared/lib/$api';
import { cva } from '@/shared/lib/cva';
import { usersService } from '@/shared/lib/usersService';
import { Badge } from '@/shared/ui/Badge';
import CircularProgress from '@/shared/ui/CircularProgress';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface EvaluatorRateItemProps {
  rate: RateEvaluatorResponse['ratesToEvaluate'][number];
  userId: number;
}

export default function EvaluatorRateItem({
  rate,
  userId,
}: EvaluatorRateItemProps) {
  const [loading, setLoading] = useState(false);

  const { percent, userRatesCount, indicatorsCount } = countRateProgress(
    rate.rate360.competencyBlocks,
    rate.rate360.userRates,
  );

  let colorBadge: keyof typeof Badge.colors;
  let textBadge: string;

  switch (rate.type) {
    case 'CURATOR':
      colorBadge = 'pink';
      textBadge = 'Руководитель';
      break;
    case 'TEAM_MEMBER':
      colorBadge = 'purple';
      textBadge = 'Коллега';
      break;
    case 'SUBORDINATE':
      colorBadge = 'indigo';
      textBadge = 'Подчиненный';
      break;
  }

  const handleNotify = async () => {
    setLoading(true);
    try {
      await $api.post(`/rate360/${rate.rate360.id}/remind-evaluator/${userId}`);
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast.error('Не удалось отправить напоминание');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-indigo-50 px-4 py-2 rounded-sm">
      <div className="flex gap-1 items-center pb-2 border-b border-gray-900/10 mb-2">
        <h4 className="text-gray-900 font-semibold">
          {usersService.displayName(rate.rate360.user)}
        </h4>
        ·
        <span className="text-gray-600 text-sm font-medium ml-1">
          {rate.rate360.team?.name}
        </span>
        <span className="text-gray-500 ml-auto">
          {(percent * 100).toFixed(0)}%
        </span>
        <CircularProgress
          className="ml-2"
          size={32}
          thickness={5}
          reverse
          centerColor="rgb(238 242 255)"
          percent={percent * 100}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-600 font-medium text-sm">
          {rate.rate360.spec.name} · {rate.rate360.type}
        </span>
        <span className="text-gray-600 font-medium text-sm">
          {userRatesCount} из {indicatorsCount}
        </span>
      </div>
      <div className="flex items-center justify-between mt-3">
        <Badge color={colorBadge}>{textBadge}</Badge>
        {percent < 1 && (
          <button
            disabled={loading}
            className={cva(
              'text-sm text-indigo-600 hover:text-indigo-800 transition-all font-medium',
              {
                'animate-pulse': loading,
              },
            )}
            onClick={handleNotify}
          >
            Напомнить
          </button>
        )}
      </div>
    </div>
  );
}
