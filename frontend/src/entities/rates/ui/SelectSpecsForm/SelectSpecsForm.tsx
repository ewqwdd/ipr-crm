import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import TeamFilters from '../../../../features/team/TeamFilters/TeamFilters';
import TeamList from './partials/TeamList/TeamList';
import SkillsFilter from './partials/SkillsFilter';
import { useMemo } from 'react';
import { AddRateDto, ChangeSpecsType, Rate } from '../../types/types';
import ConfirmCheckbox from '../AddRate/ConfirmCheckbox/ConfirmCheckbox';
import RateTypeRadio from './partials/RateTypeRadio';

interface SelectSpecsFormProps {
  skillTypes: string[];
  setSkillTypes?: (skills: string[]) => void;
  onSubmit: () => void;
  selectedSpecs: AddRateDto[];
  confirmCurator?: boolean;
  confirmUser?: boolean;
  rateType?: Rate['rateType'];

  setRateType?: (rateType: Rate['rateType']) => void;

  onChangeConfirmCurator?: (v: boolean) => void;
  onChageConfirmUser?: (v: boolean) => void;
  onChangeSpecs: (data: ChangeSpecsType | ChangeSpecsType[]) => void;
  onDeselect: (data: ChangeSpecsType[]) => void;
}

export default function SelectSpecsForm({
  onSubmit,
  setSkillTypes,
  skillTypes,
  selectedSpecs,
  onChangeSpecs,
  confirmCurator,
  confirmUser,
  onChageConfirmUser,
  onChangeConfirmCurator,
  rateType,
  setRateType,
  onDeselect,
}: SelectSpecsFormProps) {
  const selectedCount = useMemo(
    () => selectedSpecs.reduce((acc, s) => acc + s.specs.length, 0),
    [selectedSpecs],
  );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
        {setSkillTypes && (
          <>
            <div className="flex gap-3 flex-col">
              <h3 className="max-sm:text-left sm:text-lg font-medium text-gray-600">
                Навыки
              </h3>
              <div className="flex gap-2">
                <SkillsFilter skills={skillTypes} setSkills={setSkillTypes} />
              </div>
            </div>
            <div className="flex gap-3 flex-col">
              <h3 className="max-sm:text-left sm:text-lg font-medium text-gray-600">
                Вид оценки
              </h3>
              <div className="flex gap-2">
                {rateType && setRateType && (
                  <RateTypeRadio
                    rateType={rateType}
                    setRateType={setRateType}
                  />
                )}
              </div>
            </div>
            <div className="col-span-1 flex justify-end">
              <PrimaryButton
                className="sm:self-start max-sm:w-full"
                disabled={selectedCount === 0 || !skillTypes.length}
                onClick={onSubmit}
              >
                Далее
              </PrimaryButton>
            </div>
          </>
        )}
        {onChageConfirmUser && onChangeConfirmCurator && (
          <ConfirmCheckbox
            rateType={rateType ?? 'Rate360'}
            onChageConfirmUser={onChageConfirmUser}
            onChangeConfirmCurator={onChangeConfirmCurator}
            confirmCurator={confirmCurator}
            confirmUser={confirmUser}
          />
        )}
      </div>
      <h2 className="text-xl font-semibold">Выберите оцениваемых</h2>

      <TeamFilters>
        {(filters) => (
          <>
            <div className="text-gray-500 text-sm max-sm:text-left">
              Выбрано специализаций: {selectedCount}
            </div>
            <div className="flex flex-col gap-2 max-sm:text-left">
              <TeamList
                onChangeSpecs={onChangeSpecs}
                onDeselect={onDeselect}
                selectedSpecs={selectedSpecs}
                {...filters}
              />
            </div>
          </>
        )}
      </TeamFilters>
    </>
  );
}
