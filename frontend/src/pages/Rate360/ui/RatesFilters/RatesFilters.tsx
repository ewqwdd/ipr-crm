import { SoftButton } from '@/shared/ui/SoftButton';
import { FC, useState } from 'react';
import PeriodSelector from '../../../../shared/ui/PeriodSelector/PeriodSelector';
import TeamSelector from './TeamSelector';
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
import { Filters } from './types';
import { StaticSelectFilter } from '@/shared/ui/StaticSelectFilter';
import { UsersSelect } from '@/shared/ui/UsersSelect';
import { User } from '@/entities/user';
import { Checkbox } from '@/shared/ui/Checkbox';

type OnChange = (value: string | number) => void;

interface RatesFiltersProps {
  teamsOptions: Option[];
  specsOptions: Option[];
  users: User[];
  filters: Filters;
  resetFilters: () => void;
  onChangeSkillType: OnChange;
  onChangeProgress: OnChange;
  onChangeTeams: (teams: MultiValue<Option>) => void;
  onChangeSpec: OnChange;
  onChangeUser: (value?: number) => void;
  onChangePeriod: (value?: DateObject | DateObject[]) => void;
  onChangeHidden: (value: boolean) => void;
}

const RatesFilters: FC<RatesFiltersProps> = ({
  teamsOptions,
  specsOptions,
  users,
  filters,
  resetFilters,
  onChangeSkillType,
  onChangeProgress,
  onChangeTeams,
  onChangeSpec,
  onChangeUser,
  onChangePeriod,
  onChangeHidden,
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ФИО
            </label>
            <UsersSelect
              users={users}
              value={filters.userId === 'ALL' ? undefined : filters.userId}
              setValue={onChangeUser}
            />
          </div>
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
            value={filters.status}
          />
          <PeriodSelector value={filters.period} onChange={onChangePeriod} />
          <div className="flex xl:mt-5 max-xl:my-3 lg:col-span-3 xl:col-span-2 sm:col-span-2">
            <Checkbox
              title={'Архивные'}
              checked={!!filters.hidden}
              onChange={() => onChangeHidden(!filters.hidden)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RatesFilters;
