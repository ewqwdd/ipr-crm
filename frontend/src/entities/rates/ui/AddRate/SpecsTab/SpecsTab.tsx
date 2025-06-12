import { useAppDispatch, useAppSelector } from '@/app';
import { TabType } from '../AddRate';
import { ratesActions } from '@/entities/rates/model/rateSlice';
import SelectSpecsForm from '../../SelectSpecsForm/SelectSpecsForm';
import { ChangeSpecsType, Rate } from '@/entities/rates/types/types';

interface SpecsTabbProps {
  setTab: (tab: TabType) => void;
  skillTypes: string[];
  setSkillTypes: (skills: string[]) => void;
  rateType: Rate['rateType'];
  setRateType: (rateType: Rate['rateType']) => void;
}

export default function SpecsTab({
  setTab,
  skillTypes,
  setSkillTypes,
  rateType,
  setRateType,
}: SpecsTabbProps) {
  const selectedSpecs = useAppSelector((state) => state.rates.selectedSpecs);
  const confirmCurator = useAppSelector((state) => state.rates.confirmCurator);
  const confirmUser = useAppSelector((state) => state.rates.confirmUser);
  const dispatch = useAppDispatch();

  const onChangeSpecs = (data: ChangeSpecsType | ChangeSpecsType[]) => {
    if (Array.isArray(data)) {
      dispatch(ratesActions.selectSpecs(data));
      return;
    } else {
      const { teamId, specId, userId } = data;
      dispatch(ratesActions.selectSpec({ teamId, specId, userId }));
    }
  };

  const onChangeConfirmCurator = (v: boolean) => {
    dispatch(ratesActions.setConfirmCurator(v));
  };

  const onChangeConfirmUser = (v: boolean) => {
    dispatch(ratesActions.setConfirmUser(v));
  };

  const onDeselect = (data: ChangeSpecsType[]) => {
    dispatch(ratesActions.selectSpecs(data));
  };

  return (
    <SelectSpecsForm
      onChangeSpecs={onChangeSpecs}
      onSubmit={() => setTab('evaluators')}
      selectedSpecs={selectedSpecs}
      setSkillTypes={setSkillTypes}
      skillTypes={skillTypes}
      confirmCurator={confirmCurator}
      confirmUser={confirmUser}
      onChangeConfirmCurator={onChangeConfirmCurator}
      onChageConfirmUser={onChangeConfirmUser}
      rateType={rateType}
      setRateType={setRateType}
      onDeselect={onDeselect}
    />
  );
}
