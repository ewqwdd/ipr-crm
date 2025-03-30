import { $api } from '@/shared/lib/$api';
import { Answer } from '../../types/types';
import toast from 'react-hot-toast';
import debounce from 'lodash.debounce';

interface AnswerQuestion extends Omit<Answer, 'numberAnswer'> {
  numberAnswer?: number;
}

const request = (
  testId: number,
  questionId: number,
  answer: AnswerQuestion,
) => {
  $api
    .post(`/test/assigned/${testId}/answer`, {
      questionId,
      ...answer,
    })
    .catch((e) => {
      toast.error('Ошибка сохранения ответа');
      console.error(e);
    });
};

export const answerQuestion = debounce(request, 1000);
