import { RateEvaluatorResponse } from '@/entities/rates';
import { usersService } from '@/shared/lib/usersService';
import { Modal } from '@/shared/ui/Modal';
import EvaluatorRateItem from './EvaluatorRateItem';
import { UsersSelect } from '@/shared/ui/UsersSelect';
import { useState } from 'react';
import { TeamsSelect } from '../TeamSelect';
import { SoftButton } from '@/shared/ui/SoftButton';
import { exportToExcel } from '@/features/exportToExcel';
import { countRateProgress } from '@/entities/rates/model/countRateProgress';

interface EvaluatorStatisticModalProps {
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
}

export default function EvaluatorStatistic({
  closeModal,
  isOpen,
  modalData,
}: EvaluatorStatisticModalProps) {
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [teamId, setTeamId] = useState<number>();
  const { data } = modalData as { data: RateEvaluatorResponse };

  const options = data.ratesToEvaluate.map((rate) => rate.rate360.user);
  const teamOptions = Array.from(
    new Set(data.ratesToEvaluate.map((rate) => rate.rate360.team.id)),
  );

  const filteredTeamRates = teamId
    ? data.ratesToEvaluate.filter((rate) => rate.rate360.team.id === teamId)
    : data.ratesToEvaluate;

  const filteredUserRates = userId
    ? filteredTeamRates.filter((rate) => rate.rate360.user.id === userId)
    : filteredTeamRates;

  const handleExport = () => {
    const columns = [
      'Сотрудник',
      'Команда',
      'Специализация',
      'Тип',
      'Прогресс',
      'Процент',
      'Тип оценивающего',
    ];

    exportToExcel(
      columns,
      filteredUserRates.map((rate) => {
        const { percent, userRatesCount, indicatorsCount } = countRateProgress(
          rate.rate360.competencyBlocks,
          rate.rate360.userRates,
        );

        return {
          Сотрудник: usersService.displayName(rate.rate360.user),
          Команда: rate.rate360.team.name,
          Специализация: rate.rate360.spec.name,
          Тип: rate.rate360.type,
          Прогресс: `${userRatesCount} из ${indicatorsCount}`,
          Процент: (percent * 100).toFixed(0) + '%',
          'Тип оценивающего':
            rate.type === 'CURATOR'
              ? 'Руководитель'
              : rate.type === 'TEAM_MEMBER'
                ? 'Коллега'
                : 'Подчиненный',
        };
      }),
      `${usersService.displayName(data)} - статистика оценивающего.xlsx`,
    );
  };

  return (
    <Modal
      open={!!isOpen}
      setOpen={closeModal}
      title={usersService.displayName(data)}
      footer={false}
    >
      <div className="flex flex-col gap-2 py-3">
        <UsersSelect setValue={setUserId} users={options} value={userId} />
        {teamOptions.length > 1 && (
          <TeamsSelect
            setTeam={(v) => setTeamId(v?.id)}
            team={teamId}
            enabledTeams={teamOptions}
          />
        )}
        <SoftButton onClick={handleExport}>Экспорт в Excel</SoftButton>
        {filteredUserRates.map((rate) => (
          <EvaluatorRateItem
            userId={data.id}
            rate={rate}
            key={rate.rate360.id}
          />
        ))}
      </div>
    </Modal>
  );
}
