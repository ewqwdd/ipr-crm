import { Option } from '@/shared/types/Option';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { SpecsMultiSelect } from '@/widgets/SpecsMultiSelect';
import { TeamsMultiSelect } from '@/widgets/TeamsMultiSelect';
import { MultiValue } from 'react-select';

interface TeamFiltersProps {
  teams: MultiValue<Option>;
  setTeams: React.Dispatch<React.SetStateAction<MultiValue<Option>>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  specs: MultiValue<Option>;
  setSpecs: React.Dispatch<React.SetStateAction<MultiValue<Option>>>;
}

export default function TeamFilters({
  teams,
  setTeams,
  search,
  setSearch,
  specs,
  setSpecs,
}: TeamFiltersProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <TeamsMultiSelect value={teams} onChange={(v) => setTeams(v)} />
      <InputWithLabelLight
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Поиск по ФИО"
        className="mt-0"
      />
      <SpecsMultiSelect value={specs} onChange={(v) => setSpecs(v)} />
    </div>
  );
}
