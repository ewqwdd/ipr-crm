import { closeModalAtom } from "@/atoms/modalAtom";
import ConditionalModalDrawer from "@/features/ConditionalModalDrawer";
import { useAddSupportTicket } from "@/shared/hooks/support";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import Textarea from "@/shared/ui/Textarea";
import { useSetAtom } from "jotai";
import { useRef, useState, type FormEvent } from "react";

interface ErrorType {
  title?: string;
}

export default function SupportModal() {
  const [errors, setErrors] = useState<ErrorType>({});
  const closeModal = useSetAtom(closeModalAtom);
  const { mutateAsync, isPending } = useAddSupportTicket();

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const validate = () => {
    if (!titleRef.current?.value) {
      setErrors((prev) => ({ ...prev, title: "Введите заголовок" }));
      return false;
    }
    return true;
  };

  const handleSeumbit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await mutateAsync({
      title: titleRef.current!.value,
      description: descriptionRef.current!.value,
    });
    closeModal();
  };

  return (
    <ConditionalModalDrawer
      title="Новый запрос в техподдержку"
      open
      onClose={closeModal}
      loading={isPending}
    >
      <form className="flex flex-col gap-3" onSubmit={handleSeumbit}>
        <Input
          onChange={() => setErrors({ title: undefined })}
          label="Заголовок"
          placeholder="Что случилось?"
          error={errors.title}
          ref={titleRef}
        />
        <Textarea
          label="Описание"
          placeholder="Опишите проблему"
          ref={descriptionRef}
        />
        <Button>Отправить</Button>
      </form>
    </ConditionalModalDrawer>
  );
}
