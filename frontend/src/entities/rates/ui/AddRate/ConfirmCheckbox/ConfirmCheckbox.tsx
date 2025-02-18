import { Checkbox } from '@/shared/ui/Checkbox';

interface ConfirmCheckboxProps {
  confirmCurator?: boolean;
  confirmUser?: boolean;

  onChangeConfirmCurator: (v: boolean) => void;
  onChageConfirmUser: (v: boolean) => void;
}
export default function ConfirmCheckbox({
  confirmCurator,
  confirmUser,
  onChageConfirmUser,
  onChangeConfirmCurator,
}: ConfirmCheckboxProps) {
  return (
    <div className="flex flex-col gap-4 mt-8">
      <Checkbox
        name="confirm"
        checked={confirmCurator}
        onChange={() => {
          if (!confirmCurator) {
            onChangeConfirmCurator(true);
          } else {
            onChangeConfirmCurator(false);
          }
        }}
        title={'Подтверждение руководителем в оценке 360'}
      />
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
    </div>
  );
}
