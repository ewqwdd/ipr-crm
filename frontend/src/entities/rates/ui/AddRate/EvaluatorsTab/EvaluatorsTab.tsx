import { useMemo, useState } from 'react';
import { TeamsMultiSelect } from '@/widgets/TeamsMultiSelect';
import { Option } from '@/shared/types/Option';
import { MultiValue } from 'react-select';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { SpecsMultiSelect } from '@/widgets/SpecsMultiSelect';
import { useAppSelector } from '@/app';
import SkillsFilter from '../SkillsFilter';
import TeamList from '../TeamList/TeamList';
import { TabType } from '../AddRate';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';

interface EvaluatorsTabProps {
  setTab: (tab: TabType) => void;
}

export default function EvaluatorsTab({ setTab }: EvaluatorsTabProps) {
  const [teams, setTeams] = useState<MultiValue<Option>>([]);
  const [specs, setSpecs] = useState<MultiValue<Option>>([]);
  const [skillTypes, setSkillTypes] = useState<string[]>([]);
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
            disabled={selectedCount === 0}
            onClick={() => setTab('evaluators')}
          >
            Далее
          </PrimaryButton>
        </div>
      </div>
      <h2 className="text-xl font-semibold">Выберите оцениваемых</h2>

      <div className="grid grid-cols-3 gap-4">
        <TeamsMultiSelect value={teams} onChange={(v) => setTeams(v)} />
        <InputWithLabelLight placeholder="Поиск по ФИО" className="mt-0" />
        <SpecsMultiSelect value={specs} onChange={(v) => setSpecs(v)} />
      </div>
      <div className="text-gray-500 text-sm">
        Выбрано специализаций: {selectedCount}
      </div>
      <div className="flex flex-col gap-2">
        <TeamList selectedSpecs={selectedSpecs} specs={specs} teams={teams} />
      </div>
    </>
  );
}
