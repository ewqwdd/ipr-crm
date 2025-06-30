import { $api } from '@/shared/lib/$api';
import toast from 'react-hot-toast';
import debounce from 'lodash.debounce';
import { SurveyAnswer } from '../types/types';

interface AnswerQuestion
  extends Omit<SurveyAnswer, 'numberAnswer' | 'fileAnswer'> {
  numberAnswer?: number;
  fileAnswer?: File;
}

const request = (
  testId: number,
  questionId: number,
  answer: AnswerQuestion,
  callback?: () => void,
) => {
  const { fileAnswer, dateAnswer, optionAnswer, ...rest } = answer;

  const formData = new FormData();
  formData.append('questionId', String(questionId));

  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  if (dateAnswer) {
    formData.append('dateAnswer', dateAnswer);
  }

  if (fileAnswer) {
    formData.append('fileAnswer', fileAnswer);
  }

  if (optionAnswer && optionAnswer.length > 0) {
    optionAnswer.forEach((val) => {
      formData.append('optionAnswer', String(val));
    });
  }

  $api
    .post(`/survey/assigned/${testId}/answer`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .catch((e) => {
      toast.error('Ошибка сохранения ответа');
      console.error(e);
    })
    .finally(() => {
      callback?.();
    });
};

export const answerSurveyQuestion = debounce(request, 1000);
