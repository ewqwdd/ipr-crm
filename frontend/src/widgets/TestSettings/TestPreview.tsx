import { $deleteFile, $uploadFile } from '@/shared/lib/$api';
import { cva } from '@/shared/lib/cva';
import { generalService } from '@/shared/lib/generalService';
import { SecondaryButton } from '@/shared/ui/SecondaryButton';
import { SoftButton } from '@/shared/ui/SoftButton';
import { memo, useRef, useState } from 'react';

interface TestPreviewProps {
  previewImage?: string;
  onChangePreviewImage?: (string?: string) => void;
}

export default memo(function TestPreview({
  previewImage,
  onChangePreviewImage,
}: TestPreviewProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const file = e.target.files?.[0];
    if (previewImage) {
      await $deleteFile(previewImage);
    }
    if (file) {
      const fileName = await $uploadFile(file);
      onChangePreviewImage?.(fileName);
    } else {
      onChangePreviewImage?.(undefined);
    }
    setLoading(false);
  };

  const deleteFile = async () => {
    if (previewImage) {
      await $deleteFile(previewImage);
      onChangePreviewImage?.(undefined);
    }
    inputRef.current!.value = '';
  };

  return (
    <div
      className={cva('flex flex-col gap-2 items-start', {
        'animate-pulse pointer-events-none': loading,
      })}
    >
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        onChange={handleChange}
        accept="image/*"
      />
      <SecondaryButton onClick={() => inputRef.current?.click()}>
        Загрузить
      </SecondaryButton>
      {previewImage && (
        <>
          <img
            src={generalService.transformFileUrl(previewImage)}
            alt="preview"
            className="size-56 object-cover"
          />
          <SoftButton onClick={deleteFile}>Удалить</SoftButton>
        </>
      )}
    </div>
  );
});
