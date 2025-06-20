import { Rate } from '@/entities/rates/types/types';
import { Checkbox } from '@/shared/ui/Checkbox';
import { useEffect } from 'react';

interface ConfirmCheckboxProps {
  confirmCurator?: boolean;
  confirmUser?: boolean;
  rateType: Rate['rateType'];

  onChangeConfirmCurator: (v: boolean) => void;
  onChageConfirmUser: (v: boolean) => void;
}
export default function ConfirmCheckbox({
  confirmCurator,
  confirmUser,
  onChageConfirmUser,
  onChangeConfirmCurator,
  rateType,
}: ConfirmCheckboxProps) {
  useEffect(() => {
    if (rateType === 'Rate180') {
      onChageConfirmUser(false);
    }
  }, [rateType]);

  return (
    <div className="flex flex-col gap-4 mt-8 max-sm:text-left">
      <Checkbox
        name="confirm"
        checked={confirmCurator}
        onChange={() => {
          if (!confirmCurator) {
            onChangeConfirmCurator(true);
          } else {
            onChangeConfirmCurator(false);
            onChageConfirmUser(false);
          }
        }}
        title={'Подтверждение руководителем в оценке 360'}
      />
      {rateType !== 'Rate180' && (
        <Checkbox
          name="confirm"
          checked={confirmUser}
          onChange={() => {
            if (!confirmUser) {
              onChangeConfirmCurator(true);
              onChageConfirmUser(true);
            } else {
              onChageConfirmUser(false);
            }
          }}
          title={'Согласовать с оцениваемым сотрудником'}
        />
      )}
    </div>
  );
}
