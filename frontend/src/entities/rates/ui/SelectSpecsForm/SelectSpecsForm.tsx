import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import TeamFilters from './partials/TeamFilters';
import TeamList from './partials/TeamList/TeamList';
import SkillsFilter from './partials/SkillsFilter';
import { useMemo } from 'react';
import { MultiValue } from 'react-select';
import { Option } from '@/shared/types/Option';
import { AddRateDto } from '../../types/types';

interface SelectSpecsFormProps {
  skillTypes: string[];
  setSkillTypes?: (skills: string[]) => void;
  onSubmit: () => void;
  selectedSpecs: AddRateDto[];
  teams: MultiValue<Option>;
  specs: MultiValue<Option>;
  search: string;
  setTeams: React.Dispatch<React.SetStateAction<MultiValue<Option>>>;
  setSpecs: React.Dispatch<React.SetStateAction<MultiValue<Option>>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  onChangeSpecs: (teamId: number, specId: number, userId: number) => void;
}

export default function SelectSpecsForm({
  onSubmit,
  setSkillTypes,
  skillTypes,
  selectedSpecs,
  search,
  setSearch,
  setSpecs,
  setTeams,
  specs,
  teams,
  onChangeSpecs,
}: SelectSpecsFormProps) {
  const selectedCount = useMemo(
    () => selectedSpecs.reduce((acc, s) => acc + s.specs.length, 0),
    [selectedSpecs],
  );

  return (
    <>
      <div className="grid grid-cols-3 gap-4 my-4">
        {setSkillTypes && (
          <>
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
                onClick={onSubmit}
              >
                Далее
              </PrimaryButton>
            </div>
          </>
        )}
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
          onChangeSpecs={onChangeSpecs}
          selectedSpecs={selectedSpecs}
          search={search}
          specs={specs}
          teams={teams}
        />
      </div>
    </>
  );
}
