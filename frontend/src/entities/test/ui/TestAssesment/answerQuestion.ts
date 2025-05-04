import { $api } from '@/shared/lib/$api';
import { Answer } from '../../types/types';
import toast from 'react-hot-toast';
import debounce from 'lodash.debounce';
import { AppDispatch } from '@/app/store/store';
import { testAssesmentActions } from '../../testAssesmentSlice';

interface AnswerQuestion extends Omit<Answer, 'numberAnswer'> {
  numberAnswer?: number;
}

const request = (
  testId: number,
  questionId: number,
  answer: AnswerQuestion,
  dispatch: AppDispatch,
) => {
  dispatch(testAssesmentActions.addAnswerLoading(testId));
  $api
    .post(`/test/assigned/${testId}/answer`, {
      questionId,
      ...answer,
    })
    .catch((e) => {
      toast.error('Ошибка сохранения ответа');
      console.error(e);
    })
    .finally(() => {
      dispatch(testAssesmentActions.removeAnswerLoading(testId));
    });
};

export const answerQuestion = debounce(request, 1000);
