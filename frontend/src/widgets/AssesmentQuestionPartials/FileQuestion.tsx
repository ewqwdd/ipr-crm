import { SurveyQuestion } from '@/entities/survey';
import { Question } from '@/entities/test';
import { CloudUploadIcon } from '@heroicons/react/outline';
import { ChangeEvent } from 'react';

interface FileQuestionProps {
  question: Question | SurveyQuestion;
  answer: { fileAnswer?: File | true };
  onChange: (value?: File) => void;
  loading?: boolean;
}

export default function FileQuestion({ onChange, answer }: FileQuestionProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    } else {
      onChange(undefined);
    }
  };

  return (
    <div>
      <label
        htmlFor="cover-photo"
        className="block text-sm font-medium text-gray-700"
      >
        Загрузка файла
      </label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md relative">
        <div className="space-y-1 text-center">
          <CloudUploadIcon
            className="mx-auto h-12 w-12 text-gray-400"
            strokeWidth={1}
          />
          <div className="flex text-sm text-gray-600">
            <p className="cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
              <span>Загрузите файл</span>
            </p>

            <p className="pl-1">или перетащите</p>
          </div>
        </div>
        <input
          onChange={handleChange}
          id="file-upload"
          name="file-upload"
          type="file"
          className="w-full absolute h-full opacity-0 top-0 left-0 z-20"
        />
      </div>
      {answer?.fileAnswer && (
        <div className="mt-2 text-sm text-gray-500">
          <p>
            {answer.fileAnswer instanceof File
              ? answer.fileAnswer.name
              : 'Файл загружен'}
          </p>
        </div>
      )}
    </div>
  );
}
