import { Rate } from '@/entities/rates';
import { CompetencyBlock } from '@/entities/skill';
import { Team } from '@/entities/team';
import { AssignedTest, Test } from '@/entities/test';
import { Assesment } from '@/pages/Rate360Assesment/types/types';

export const generalService = {
  /**
   * Преобразует относительный путь к файлу в полный URL,
   */
  transformFileUrl: (url?: string): string | undefined => {
    if (!url) {
      return undefined;
    }
    return import.meta.env.VITE_FILES_URL + url;
  },

  /**
   * Рекурсивно находит ID текущей команды и всех вложенных подкоманд.
   */
  findDisabledTeams: (team: Team): number[] => {
    const subTeams =
      team.subTeams?.flatMap((e) => generalService.findDisabledTeams(e)) || [];
    return [...subTeams, team.id];
  },

  /**
   * Проверяет, активна ли ссылка на основе текущего `pathname`.
   */
  checkActiveLink: (href: string, pathname: string) =>
    new RegExp(`^${href}(?:/|$)`).test(pathname),

  /**
   * Пример структуры ошибки:
   * ```ts
   * {
   *   status: 400,
   *   data: { message: "Invalid credentials" }
   * }
   * ```
   */
  isFetchBaseQueryError: (
    error: unknown,
  ): error is { status: number; data?: { message?: string } } => {
    return typeof error === 'object' && error !== null && 'data' in error;
  },

  /**
   * @returns {Assesment} - Объект, в котором данные организованы по иерархии:
   *
   *   Assesment[blockId][competencyId][indicatorId] = { rate, comment }
   */
  tranformAssesment: (blocks: CompetencyBlock[], data: Rate) => {
    const assesmentData: Assesment = {};
    blocks.forEach((block) => {
      assesmentData[block.id] = block.competencies.reduce<Assesment[0]>(
        (acc, competency) => {
          acc[competency.id] = competency.indicators.reduce<Assesment[0][0]>(
            (acc, indicator) => {
              const foundRate = data?.userRates.find(
                (rate) => rate.indicatorId === indicator.id,
              );
              acc[indicator.id] = {
                rate: foundRate?.rate,
              };
              return acc;
            },
            {},
          );
          return acc;
        },
        {},
      );
    });

    return assesmentData;
  },

  /**
   * Подсчитывает результат теста на основе правильных ответов и ответов пользователя.
   */
  testScoreCount: (assignedTest: AssignedTest, test: Test) => {
    const questionsWithCorrectAnswers = test.testQuestions.filter(
      (question) => {
        if (!question) return false;
        if (['MULTIPLE', 'SINGLE'].includes(question.type)) {
          return question.options?.some((option) => option.isCorrect);
        } else if (question.type === 'TEXT') {
          return !!question.textCorrectValue;
        } else if (question.type === 'NUMBER') {
          return (
            !!question.numberCorrectValue || question.numberCorrectValue === 0
          );
        }
        return false;
      },
    );

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
  },
};
