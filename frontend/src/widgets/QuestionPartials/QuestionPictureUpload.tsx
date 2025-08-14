import { $deleteFile, $uploadFile } from '@/shared/lib/$api';
import { SoftButton } from '@/shared/ui/SoftButton';
import { TrashIcon } from '@heroicons/react/outline';
import React, { useRef } from 'react';

interface QuestionPictureUploadProps {
  onChange?: (string: string) => void;
  value?: string;
}

export default function QuestionPictureUpload({
  onChange,
  value,
}: QuestionPictureUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (value !== '' && !!value) {
      $deleteFile(value);
    }
    const fileName = await $uploadFile(file);
    onChange?.(fileName);
  };

  const handleRemove = () => {
    $deleteFile(value);
    if (onChange) onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="flex justify-center min-h-14 items-center">
      {!value ? (
        <SoftButton type="button" onClick={() => inputRef.current?.click()}>
          Загрузить картинку
        </SoftButton>
      ) : (
        <div className="relative inline-block">
          <img
            src={import.meta.env.VITE_FILES_URL + '/uploads/' + value}
            alt="Загруженное изображение"
            className="h-40 object-cover rounded shadow"
          />
          <SoftButton
            type="button"
            onClick={handleRemove}
            className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1"
            aria-label="Удалить"
            danger
          >
            <TrashIcon className="w-5 h-5" />
          </SoftButton>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
