import { useMemo, useState } from 'react';
import { Option } from '@/shared/types/Option';
import { MultiValue } from 'react-select';
import { useAppSelector } from '@/app';
import SkillsFilter from '../SkillsFilter';
import TeamList from '../TeamList/TeamList';
import { TabType } from '../AddRate';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import TeamFilters from '../TeamFilters/TeamFilters';

interface SpecsTabbProps {
  setTab: (tab: TabType) => void;
  skillTypes: string[];
  setSkillTypes: (skills: string[]) => void;
}

export default function SpecsTab({
  setTab,
  skillTypes,
  setSkillTypes,
}: SpecsTabbProps) {
  const [teams, setTeams] = useState<MultiValue<Option>>([]);
  const [specs, setSpecs] = useState<MultiValue<Option>>([]);
  const [search, setSearch] = useState('');
  const selectedSpecs = useAppSelector((state) => state.rates.selectedSpecs);

  const selectedCount = useMemo(
    () => selectedSpecs.reduce((acc, s) => acc + s.specs.length, 0),
    [selectedSpecs],
  );

  return (
    <>
      <div className="grid grid-cols-3 gap-4 my-4">
        <div className="flex gap-3 flex-col">
          <h3 className="text-lg font-medium text-gray-600">Вид оценки</h3>
          <div className="flex gap-2">
            <SkillsFilter skills={skillTypes} setSkills={setSkillTypes} />
          </div>
        </div>
        <div className="col-span-2 flex justify-end">
          <PrimaryButton
            className="self-start"
            disabled={selectedCount === 0 || !skillTypes.length}
            onClick={() => setTab('evaluators')}
          >
            Далее
          </PrimaryButton>
        </div>
      </div>
      <h2 className="text-xl font-semibold">Выберите оцениваемых</h2>

      <TeamFilters
        search={search}
        setSearch={setSearch}
        specs={specs}
        setSpecs={setSpecs}
        teams={teams}
        setTeams={setTeams}
      />

      <div className="text-gray-500 text-sm">
        Выбрано специализаций: {selectedCount}
      </div>
      <div className="flex flex-col gap-2">
        <TeamList
          selectedSpecs={selectedSpecs}
          search={search}
          specs={specs}
          teams={teams}
        />
      </div>
    </>
  );
}
