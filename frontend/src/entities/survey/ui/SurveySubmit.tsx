import { useAppDispatch, useAppSelector } from '@/app';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { SecondaryButton } from '@/shared/ui/SecondaryButton';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { SurveyCreate, SurveyCreateStoreSchema } from '../types/types';
import { surveyCreateActions } from '../surveyCreateSlice';

interface SurveySubmitProps {
  handleSubmit: (test: SurveyCreate) => void;
  state: {
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
  };
  errorMessage: string | null;
  successMessage: string | null;
}

export default function SurveySubmit({
  errorMessage,
  handleSubmit,
  state,
  successMessage,
}: SurveySubmitProps) {
  const survey = useAppSelector((state) => state.surveyCreate);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const validate = () => {
    const errors: SurveyCreateStoreSchema['errors'] = {};

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    if (!survey.name) {
      errors.name = 'Введите название опроса';
    }
    if (!survey.surveyQuestions.length) {
      errors.surveyQuestions = 'Добавьте вопросы';
    } else if (!survey.startDate) {
      errors.startDate = 'Введите дату начала опроса';
    }
    if (survey.endDate && survey.endDate < todayStart) {
      errors.endDate = 'Дата окончания опроса не может быть в прошлом';
    }
    if (
      survey.startDate &&
      survey.endDate &&
      survey.endDate < survey.startDate
    ) {
      errors.endDate = 'Дата окончания опроса не может быть раньше даты начала';
    }
    let invalid = false;
    survey.surveyQuestions.forEach((question, index) => {
      if (!question.label) {
        invalid = true;
        dispatch(
          surveyCreateActions.setQuestionError({
            index,
            error: 'Введите название вопроса',
          }),
        );
        toast.error('Введите название вопроса ' + (index + 1));
      }
      if (['SINGLE', 'MULTIPLE'].includes(question.type)) {
        if (!question.options?.length || question.options?.length < 1) {
          invalid = true;
          dispatch(
            surveyCreateActions.setQuestionError({
              index,
              error: 'Добавьте варианты ответов',
            }),
          );
          toast.error('Добавьте варианты ответов к вопросу ' + (index + 1));
        } else if (question.options.find((option) => !option.value)) {
          invalid = true;
          dispatch(
            surveyCreateActions.setQuestionError({
              index,
              error: 'Введите название варианта ответа',
            }),
          );
          toast.error(
            'Введите название варианта ответа к вопросу ' + (index + 1),
          );
        }
      }
    });

    dispatch(surveyCreateActions.setErrors(errors));
    Object.values(errors).forEach((error) => {
      if (error) {
        toast.error(error);
      }
    });
    return !Object.keys(errors).length && !invalid;
  };

  const onSubmit = () => {
    const isValid = validate();
    if (!isValid) {
      return;
    }
    const surveyQuestions = survey.surveyQuestions.map((q, index) => {
      const question = { ...q, order: index };
      if (question.type === 'NUMBER') {
        return {
          ...question,
          maxNumber: question.maxNumber
            ? Number(question.maxNumber)
            : undefined,
          minNumber: question.minNumber
            ? Number(question.minNumber)
            : undefined,
          options: undefined,
          textCorrectValue: undefined,
          maxLength: undefined,
          correctRequired: undefined,
          maxMinToggle: undefined,
          scaleDots: undefined,
          scaleStart: undefined,
          scaleEnd: undefined,
        };
      } else if (question.type === 'TEXT') {
        return {
          ...question,
          maxLength: question.maxLength
            ? Number(question.maxLength)
            : undefined,
          options: undefined,
          numberCorrectValue: undefined,
          maxNumber: undefined,
          minNumber: undefined,
          allowDecimal: undefined,
          correctRequired: undefined,
          maxMinToggle: undefined,
          scaleDots: undefined,
          scaleStart: undefined,
          scaleEnd: undefined,
        };
      } else if (question.type === 'SCALE') {
        return {
          ...question,
          scaleDots: question.scaleDots,
          scaleStart: question.scaleStart,
          scaleEnd: question.scaleEnd,
          options: undefined,
          numberCorrectValue: undefined,
          maxNumber: undefined,
          minNumber: undefined,
          allowDecimal: undefined,
          correctRequired: undefined,
          maxMinToggle: undefined,
        };
      } else {
        return {
          ...question,
          numberCorrectValue: undefined,
          maxNumber: undefined,
          minNumber: undefined,
          allowDecimal: undefined,
          textCorrectValue: undefined,
          maxLength: undefined,
          correctRequired: undefined,
          maxMinToggle: undefined,
          scaleDots: undefined,
          scaleStart: undefined,
          scaleEnd: undefined,
        };
      }
    });

    handleSubmit({
      ...survey,
      surveyQuestions,
    });
  };

  useEffect(() => {
    if (state.isSuccess) {
      toast.success(successMessage);
      dispatch(surveyCreateActions.clear());
      navigate('/surveys');
    }
  }, [state.isSuccess, navigate, dispatch, successMessage]);

  useEffect(() => {
    if (state.isError) {
      toast.error(errorMessage);
    }
  }, [state.isError, errorMessage]);

  return (
    <div className="flex gap-4 py-10">
      <PrimaryButton onClick={onSubmit}>Сохранить</PrimaryButton>
      <SecondaryButton onClick={() => navigate('/surveys')}>
        Отменить
      </SecondaryButton>
    </div>
  );
}
