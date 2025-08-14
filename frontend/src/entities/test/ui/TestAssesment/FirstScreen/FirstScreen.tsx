import { useAppDispatch } from '@/app';
import { testAssesmentActions } from '@/entities/test/testAssesmentSlice';
import { Test } from '@/entities/test/types/types';
import { generalService } from '@/shared/lib/generalService';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';

interface FirstScreenProps {
  test: Test;
}

export default function FirstScreen({ test }: FirstScreenProps) {
  const dispatch = useAppDispatch();

  const onButtonClick = () => {
    dispatch(testAssesmentActions.setScreen(0));
  };

  return (
    <div className="flex flex-col gap-2 flex-1">
      <h2 className="text-lg font-semibold text-gray-900">{test.name}</h2>
      {test.previewImage && (
        <img
          src={generalService.transformFileUrl(test.previewImage)}
          alt="preview"
          className="size-56 object-cover self-center rounded-sm select-none pointer-events-none"
        />
      )}
      <PrimaryButton className="self-end mt-auto" onClick={onButtonClick}>
        Начать
      </PrimaryButton>
    </div>
  );
}
