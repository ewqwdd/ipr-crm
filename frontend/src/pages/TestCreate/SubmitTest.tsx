import { useAppDispatch, useAppSelector } from '@/app';
import { testCreateActions } from '@/entities/test/testCreateSlice';
import { TestCreateStoreSchema } from '@/entities/test/types/types';
import { testsApi } from '@/shared/api/testsApi';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { SecondaryButton } from '@/shared/ui/SecondaryButton';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

export default function SubmitTest() {
  const test = useAppSelector((state) => state.testCreate);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [mutate, state] = testsApi.useCreateTestMutation();

  const validate = () => {
    const errors: TestCreateStoreSchema['errors'] = {};

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    if (!test.name) {
      errors.name = 'Введите название теста';
    }
    if (!test.questions.length) {
      errors.questions = 'Добавьте вопросы';
    }
    if (test.startDate && test.startDate < todayStart) {
      errors.startDate = 'Дата начала теста не может быть в прошлом';
    } else if (!test.startDate) {
      errors.startDate = 'Введите дату начала теста';
    }
    if (test.endDate && test.endDate < todayStart) {
      errors.endDate = 'Дата окончания теста не может быть в прошлом';
    }
    if (test.startDate && test.endDate && test.endDate < test.startDate) {
      errors.endDate = 'Дата окончания теста не может быть раньше даты начала';
    }
    let invalid = false;
    test.questions.forEach((question, index) => {
      if (!question.label) {
        invalid = true;
        dispatch(
          testCreateActions.setQuestionError({
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
            testCreateActions.setQuestionError({
              index,
              error: 'Добавьте варианты ответов',
            }),
          );
          toast.error('Добавьте варианты ответов к вопросу ' + (index + 1));
        } else if (question.options.find((option) => !option.value)) {
          invalid = true;
          dispatch(
            testCreateActions.setQuestionError({
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

    dispatch(testCreateActions.setErrors(errors));
    Object.values(errors).forEach((error) => {
      if (error) {
        toast.error(error);
      }
    });
    return !Object.keys(errors).length || invalid;
  };

  const onSubmit = () => {
    const isValid = validate();
    if (!isValid) {
      return;
    }
    const questions = test.questions.map((question) => {
      if (question.type === 'NUMBER') {
        return {
          ...question,
          options: undefined,
          textCorrectValue: undefined,
          maxLength: undefined,
        };
      } else if (question.type === 'TEXT') {
        return {
          ...question,
          options: undefined,
          numberCorrectValue: undefined,
          maxNumber: undefined,
          minNumber: undefined,
          allowDecimal: undefined,
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
        };
      }
    });

    mutate({
      ...test,
      questions,
    });
  };

  useEffect(() => {
    if (state.isSuccess) {
      toast.success('Тест успешно создан');
      dispatch(testCreateActions.clear());
      navigate('/tests');
    }
  }, [state.isSuccess, navigate, dispatch]);

  useEffect(() => {
    if (state.isError) {
      toast.error('Ошибка при создании теста');
    }
  }, [state.isError]);

  return (
    <div className="mt-4 flex gap-4">
      <PrimaryButton onClick={onSubmit}>Сохранить</PrimaryButton>
      <SecondaryButton onClick={() => navigate('/tests')}>
        Отменить
      </SecondaryButton>
    </div>
  );
}
