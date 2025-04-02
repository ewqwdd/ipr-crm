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
  console.log(questionsWithCorrectAnswers);

  const score = assignedTest.answeredQUestions.reduce((acc, question) => {
    const foundQuestion = questionsWithCorrectAnswers.find(
      (q) => q.id === question.questionId,
    );
    if (!foundQuestion) return acc;
    if (['MULTIPLE', 'SINGLE'].includes(foundQuestion.type)) {
      const allCorrect = foundQuestion.options
        ?.filter((option) => option.isCorrect)
        .map((option) => option.id);
      const allSelected = question.options?.map((option) => option.optionId);
      const allSelectedCorrect = allSelected?.every((option) =>
        allCorrect?.includes(option),
      );
      if (allSelectedCorrect) {
        return acc + 1;
      }
    } else if (foundQuestion.type === 'TEXT') {
      if (question.textAnswer === foundQuestion.textCorrectValue) {
        return acc + 1;
      }
    } else if (foundQuestion.type === 'NUMBER') {
      if (question.numberAnswer === foundQuestion.numberCorrectValue) {
        return acc + 1;
      }
    }
    return acc;
  }, 0);

  return { score, questionsCount: questionsWithCorrectAnswers.length };
};
