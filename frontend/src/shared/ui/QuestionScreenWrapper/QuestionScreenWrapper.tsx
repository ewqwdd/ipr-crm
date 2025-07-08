import { memo, ReactNode } from 'react';

interface QuestionScreenWrapperProps {
  handleBack?: () => void;
  handleForward?: () => void;
  required?: boolean;
  children?: ReactNode;
  questionNumber?: number;
}

export default memo(function QuestionScreenWrapper({
  handleBack,
  handleForward,
  children,
  questionNumber,
  required,
}: QuestionScreenWrapperProps) {
  return (
    <div className="flex flex-col gap-4 h-full flex-1">
      <div className="flex">
        <button
          onClick={handleBack}
          className="text-sm text-violet-700 flex-1 text-left"
        >
          Предыдущий вопрос
        </button>
        <h3 className="text text-center flex-1 font-medium text-gray-700">
          Вопрос {questionNumber}
          {required && (
            <span className="text-red-500 text-sm relative -top-0.5 left-px">
              *
            </span>
          )}
        </h3>
        <button
          onClick={handleForward}
          className="text-sm text-violet-700 flex-1 text-right"
        >
          Следующий вопрос
        </button>
      </div>
      {children}
    </div>
  );
});
