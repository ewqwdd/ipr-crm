import { validationService } from "@/shared/lib/services/validationService";
import type { User, UserFormData } from "@/shared/types/User";
import AvatarUpload from "@/shared/ui/AvatarUpload";
import Button from "@/shared/ui/Button";
import Divider from "@/shared/ui/Divider";
import Input from "@/shared/ui/Input";
import Title from "@/shared/ui/Title";
import { useState } from "react";

interface UserEditProps {
  user?: User | null;
  onSubmit: (user: UserFormData) => void;
  onCancel?: () => void;
  loading?: boolean;
}

type UserFormErrors = Omit<UserFormData, "avatar"> & {
  avatar?: string;
};

export default function UserEdit({
  onSubmit,
  user,
  loading,
  onCancel,
}: UserEditProps) {
  const [photo, setPhoto] = useState<string | undefined | ArrayBuffer>(
    user?.avatar,
  );
  const [data, setData] = useState<UserFormData>({
    username: user?.username,
    email: user?.email,
    firstName: user?.firstName,
    lastName: user?.lastName,
    phone: user?.phone,
  });
  const [errors, setErrors] = useState<UserFormErrors>({
    email: "",
    phone: "",
    username: "",
  });

  const setDataField = <T,>(field: keyof UserFormData, value: T) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    let valid = true;
    const newErrors: UserFormErrors = {
      email: "",
      phone: "",
      username: "",
    };

    if (!data.email || !validationService.validateEmail(data.email)) {
      newErrors.email = "Введите корректный email";
      valid = false;
    }

    if (data.phone && data.phone.length < 2) {
      newErrors.phone = "Некорректный Телеграм";
      valid = false;
    }

    if (!data.username || data.username.trim().length <= 1) {
      newErrors.username = "Введите имя пользователя";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...data, avatar: data.avatar });
  };

  return (
    <div className={loading ? "animate-pulse pointer-events-none" : ""}>
      <form className="font-extrabold flex flex-col" onSubmit={handleSubmit}>
        <Title
          title="Профиль"
          description="Эта информация будет видна другим пользователям"
        />

        <div className="flex flex-col gap-1 mt-3">
          <label htmlFor="avatar" className="text-secondary text-sm">
            Фото
          </label>
          <AvatarUpload
            photo={photo}
            onPhotoChange={(file, preview) => {
              setData((prev) => ({ ...prev, avatar: file }));
              setPhoto(preview);
              setErrors((prev) => ({ ...prev, avatar: "" }));
            }}
          />
        </div>

        <Input
          className="sm:self-start mt-2"
          label="Имя пользователя"
          error={errors.username}
          value={data.username}
          onChange={(e) => setDataField("username", e.target.value)}
        />

        <Divider />

        <Title
          title="Личная информация"
          description="Укажите действительные данные, по которым с вами можно связаться"
        />

        <div className="mt-3 grid sm:grid-cols-2 gap-2">
          <Input
            placeholder="Необязательно"
            label="Имя"
            value={data.firstName}
            onChange={(e) => setDataField("firstName", e.target.value)}
          />
          <Input
            placeholder="Необязательно"
            label="Фамилия"
            value={data.lastName}
            onChange={(e) => setDataField("lastName", e.target.value)}
          />
          <Input
            placeholder="Введите почту"
            label="Email"
            error={errors.email}
            value={data.email}
            onChange={(e) => setDataField("email", e.target.value)}
          />
          <Input
            placeholder="Необязательно"
            label="Telegram"
            error={errors.phone}
            value={data.phone}
            onChange={(e) => setDataField("phone", e.target.value)}
          />
        </div>

        <div className="mt-5 flex gap-3 justify-end max-sm:flex-col-reverse">
          <Button type="button" variant="teritary" onClick={onCancel}>
            Отменить
          </Button>
          <Button type="submit">Сохранить</Button>
        </div>
      </form>
    </div>
  );
}
