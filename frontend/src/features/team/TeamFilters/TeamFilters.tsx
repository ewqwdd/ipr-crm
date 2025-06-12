import { Option } from '@/shared/types/Option';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { SpecsMultiSelect } from '@/widgets/SpecsMultiSelect';
import { TeamsMultiSelect } from '@/widgets/TeamsMultiSelect';
import { useState } from 'react';
import { MultiValue } from 'react-select';

interface TeamFiltersProps {
  children: (filters: {
    teams: MultiValue<Option>;
    search?: string;
    specs: MultiValue<Option>;
  }) => React.ReactNode;
}

// TODO debounce rendering of children

export default function TeamFilters({ children }: TeamFiltersProps) {
  const [teams, setTeams] = useState<MultiValue<Option>>([]);
  const [specs, setSpecs] = useState<MultiValue<Option>>([]);
  const [search, setSearch] = useState('');

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <TeamsMultiSelect value={teams} onChange={(v) => setTeams(v)} />
        <InputWithLabelLight
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по ФИО"
          className="mt-0"
        />
        <SpecsMultiSelect value={specs} onChange={(v) => setSpecs(v)} />
      </div>
      {children({ teams, search, specs })}
    </>
  );
}
