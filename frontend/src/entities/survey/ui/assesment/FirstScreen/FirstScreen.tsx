import { useAppDispatch } from '@/app';
import { surveyAssesmentActions } from '@/entities/survey/surveyAssesmentSlice';
import { Survey } from '@/entities/survey/types/types';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';

interface FirstScreenProps {
  survey: Survey;
}

export default function FirstScreen({ survey }: FirstScreenProps) {
  const dispatch = useAppDispatch();

  const onButtonClick = () => {
    dispatch(surveyAssesmentActions.setScreen(0));
  };

  return (
    <div className="flex flex-col gap-20 flex-1">
      <h2 className="text-xl font-semibold text-gray-900">{survey.name}</h2>
      <PrimaryButton className="self-end mt-auto" onClick={onButtonClick}>
        Начать
      </PrimaryButton>
    </div>
  );
}
