import { SoftButton } from '@/shared/ui/SoftButton';
import { FC, useState } from 'react';
import PeriodSelector from './PeriodSelector';
import { Filters } from './RatesFiltersWrapper';
import TeamSelector from './TeamSelector';
import StaticSelectFilter from './StaticSelectFilter';
import {
  initialFilters,
  progressOptions,
  skillTypeOptions,
} from './constatnts';
import { getChangedFilters } from './helpers';
import { Option } from '@/shared/types/Option';
import { MultiValue } from 'react-select';
import { DateObject } from 'react-multi-date-picker';
import { PingCircle } from '@/shared/ui/PingCircle';

type OnChange = (value: string | number) => void;

interface RatesFiltersProps {
  teamsOptions: Option[];
  specsOptions: Option[];
  usersOptions: Option[];
  filters: Filters;
  resetFilters: () => void;
  onChangeSkillType: OnChange;
  onChangeProgress: OnChange;
  onChangeTeams: (teams: MultiValue<Option>) => void;
  onChangeSpec: OnChange;
  onChangeUser: OnChange;
  onChangePeriod: (value?: DateObject | DateObject[]) => void;
}

const RatesFilters: FC<RatesFiltersProps> = ({
  teamsOptions,
  specsOptions,
  usersOptions,
  filters,
  resetFilters,
  onChangeSkillType,
  onChangeProgress,
  onChangeTeams,
  onChangeSpec,
  onChangeUser,
  onChangePeriod,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { changedFiltersCount } = getChangedFilters(initialFilters, filters);

  return (
    <div className="max-sm:px-4">
      <div className="flex gap-4 mb-4">
        <SoftButton className="relative" onClick={() => setIsOpen((s) => !s)}>
          Фильтры
          {changedFiltersCount !== 0 && (
            <PingCircle>{changedFiltersCount}</PingCircle>
          )}
        </SoftButton>
        {changedFiltersCount !== 0 && (
          <SoftButton
            onClick={() => {
              resetFilters();
              setIsOpen(false);
            }}
          >
            Сбросить
          </SoftButton>
        )}
      </div>
      {isOpen && (
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          <TeamSelector
            options={teamsOptions}
            value={filters.teams}
            onChange={onChangeTeams}
          />
          <StaticSelectFilter
            label="ФИО"
            options={usersOptions}
            onChange={onChangeUser}
            value={filters.userId}
          />
          <StaticSelectFilter
            label="Специализации"
            options={specsOptions}
            onChange={onChangeSpec}
            value={filters.specId}
          />
          <StaticSelectFilter
            label="Навыки"
            options={skillTypeOptions}
            onChange={onChangeSkillType}
            value={filters.skillType}
          />
          <StaticSelectFilter
            label="Прогресс"
            options={progressOptions}
            onChange={onChangeProgress}
            value={filters.progress}
          />
          <PeriodSelector value={filters.period} onChange={onChangePeriod} />
        </div>
      )}
    </div>
  );
};

export default RatesFilters;
