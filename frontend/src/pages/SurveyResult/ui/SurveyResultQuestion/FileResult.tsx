import { Survey } from '@/entities/survey';
import { cva } from '@/shared/lib/cva';
import { generalService } from '@/shared/lib/generalService';
import { DocumentIcon } from '@heroicons/react/outline';
import { useState } from 'react';

interface FileResultProps {
  question: Survey['surveyQuestions'][number];
}

interface FileElementProps {
  fileUrl: string;
}

const FileElement = ({ fileUrl }: FileElementProps) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await fetch(fileUrl, {
        credentials: 'include',
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = decodeURI(fileUrl.split('/').pop() ?? 'file');
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Ошибка при загрузке файла:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <li
      onClick={handleDownload}
      className={cva(
        'flex cursor-pointer gap-1 text-sm font-medium text-violet-600 hover:text-violet-800 transition-colors duration-200',
        {
          'animate-pulse pointer-events-none': loading,
        },
      )}
    >
      <DocumentIcon className="size-4" />
      {decodeURI(fileUrl.split('/').pop() ?? '')}
    </li>
  );
};

export default function FileResult({ question }: FileResultProps) {
  return (
    <ul className="flex flex-col gap-3 max-w-md">
      {question.answeredQuestions
        .filter((q) => !!q.fileAnswer)
        .map((q, index) => (
          <FileElement key={index} fileUrl={generalService.transformFileUrl(q.fileAnswer)!} />
        ))}
    </ul>
  );
}
