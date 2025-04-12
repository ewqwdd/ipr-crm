import { AssignedTest, Test } from '@/entities/test';

export const testScoreCount = (assignedTest: AssignedTest, test: Test) => {
  const questionsWithCorrectAnswers = test.testQuestions.filter((question) => {
    if (!question) return false;
    if (['MULTIPLE', 'SINGLE'].includes(question.type)) {
      return question.options?.some((option) => option.isCorrect);
    } else if (question.type === 'TEXT') {
      return !!question.textCorrectValue;
    } else if (question.type === 'NUMBER') {
      return !!question.numberCorrectValue || question.numberCorrectValue === 0;
    }
    return false;
  });

  const maxScore = questionsWithCorrectAnswers.reduce((acc, question) => {
    if (question.type === 'MULTIPLE' && question.options) {
      return (
        acc +
        question.options
          .filter((option) => option.isCorrect)
          .reduce((a, op) => a + (op.score ?? 1), 0)
      );
    } else if (question.type === 'SINGLE' && question.options) {
      return (
        acc +
        Math.max(
          ...question.options
            .filter((option) => option.isCorrect)
            .map((op) => op.score ?? 1),
        )
      );
    } else if (question.type === 'TEXT') {
      return acc + (question.score ?? 1);
    } else if (question.type === 'NUMBER') {
      return acc + (question.score ?? 1);
    }
    return acc;
  }, 0);

  const score = assignedTest.answeredQUestions.reduce((acc, question) => {
    const foundQuestion = questionsWithCorrectAnswers.find(
      (q) => q.id === question.questionId,
    );
    if (!foundQuestion) return acc;
    if (['MULTIPLE', 'SINGLE'].includes(foundQuestion.type)) {
      const score = question.options.reduce((a, op) => {
        const foundOption = foundQuestion.options?.find(
          (o) => o.id === op.optionId,
        );
        if (foundOption?.isCorrect) {
          return a + (foundOption.score ?? 1);
        }
        return a;
      }, 0);
      return acc + score;
    } else if (foundQuestion.type === 'TEXT') {
      if (question.textAnswer === foundQuestion.textCorrectValue) {
        return acc + (foundQuestion.score ?? 1);
      }
    } else if (foundQuestion.type === 'NUMBER') {
      if (question.numberAnswer === foundQuestion.numberCorrectValue) {
        return acc + (foundQuestion.score ?? 1);
      }
    }
    return acc;
  }, 0);

  return {
    score,
    questionsCount: questionsWithCorrectAnswers.length,
    maxScore,
  };
};
