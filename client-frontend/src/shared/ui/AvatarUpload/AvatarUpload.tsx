import { type ChangeEvent, useRef } from "react";
import toast from "react-hot-toast";
import SoftButton from "../SoftButton";

interface AvatarUploadProps {
  photo?: string | ArrayBuffer;
  onPhotoChange: (file: File, preview?: string | ArrayBuffer) => void;
  error?: string;
}

export default function AvatarUpload({
  photo,
  onPhotoChange,
  error,
}: AvatarUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Можно загружать только JPG/PNG изображения.");
      e.preventDefault();
      return;
    }

    if (file.size / 1024 / 1024 >= 2) {
      toast.error("Размер изображения должен быть меньше 2MB.");
      e.preventDefault();
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onPhotoChange(file, reader.result ? reader.result : undefined);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-3">
      {photo ? (
        <img
          src={photo.toString()}
          className="size-14 rounded-full overflow-hidden bg-foreground-1 object-cover"
          alt="avatar"
        />
      ) : (
        <span className="size-14 rounded-full overflow-hidden bg-foreground-1">
          <svg
            className="h-full w-full text-gray-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </span>
      )}
      <SoftButton onClick={() => fileRef.current?.click()}>Изменить</SoftButton>
      <input
        type="file"
        ref={fileRef}
        onChange={onFileChange}
        className="hidden"
      />
      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </div>
  );
}
