import { useState } from 'react';
import { Option } from '@/shared/types/Option';
import { MultiValue } from 'react-select';
import { useAppDispatch, useAppSelector } from '@/app';
import { TabType } from '../AddRate';
import { ratesActions } from '@/entities/rates/model/rateSlice';
import SelectSpecsForm from '../../SelectSpecsForm/SelectSpecsForm';

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
  const confirmCurator = useAppSelector((state) => state.rates.confirmCurator);
  const confirmUser = useAppSelector((state) => state.rates.confirmUser);
  const dispatch = useAppDispatch();

  const onChangeSpecs = (teamId: number, specId: number, userId: number) => {
    dispatch(ratesActions.selectSpec({ teamId, specId, userId }));
  };

  const onChangeConfirmCurator = (v: boolean) => {
    dispatch(ratesActions.setConfirmCurator(v));
  };

  const onChangeConfirmUser = (v: boolean) => {
    dispatch(ratesActions.setConfirmUser(v));
  };

  return (
    <SelectSpecsForm
      onChangeSpecs={onChangeSpecs}
      onSubmit={() => setTab('evaluators')}
      search={search}
      setSearch={setSearch}
      selectedSpecs={selectedSpecs}
      setSkillTypes={setSkillTypes}
      setSpecs={setSpecs}
      setTeams={setTeams}
      skillTypes={skillTypes}
      specs={specs}
      teams={teams}
      confirmCurator={confirmCurator}
      confirmUser={confirmUser}
      onChangeConfirmCurator={onChangeConfirmCurator}
      onChageConfirmUser={onChangeConfirmUser}
    />
  );
}
