import { useAppDispatch } from '@/app';
import { testAssesmentActions } from '@/entities/test/testAssesmentSlice';
import { Test } from '@/entities/test/types/types';
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
    <div className="flex flex-col gap-20 flex-1">
      <h2 className="text-xl font-semibold text-gray-900">{test.name}</h2>
      <PrimaryButton className="self-end mt-auto" onClick={onButtonClick}>
        Начать
      </PrimaryButton>
    </div>
  );
}
