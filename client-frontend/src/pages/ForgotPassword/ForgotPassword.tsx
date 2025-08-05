import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import Title from "@/shared/ui/Title";
import { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import { $api } from "@/shared/lib/$api";
import { validationService } from "@/shared/lib/services/validationService";
import { cva } from "@/shared/lib/cva";
import { AxiosError } from "axios";
import AnimationWrapper from "@/shared/ui/AnimationWrapper";

export default function ForgotPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { email?: string } | null;
  const [email, setEmail] = useState(state?.email || "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
      if (error) setError(null);
    },
    [error],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validationService.validateEmail(email)) {
        setError("Введите корректный email");
        return;
      }
      setSubmitting(true);
      setError(null);
      try {
        await $api.post("/auth/reset-password", { email });
        navigate("/link-sent", {
          state: { email },
        });
      } catch (err) {
        if (err instanceof AxiosError) {
          setError(err.response?.data.message);
          return;
        }
        setError("Не удалось отправить ссылку. Попробуйте позже.");
      } finally {
        setSubmitting(false);
      }
    },
    [email, navigate],
  );

  return (
    <AnimationWrapper.Opacity className="flex-1">
      <main
        className={cva(
          "min-h-screen flex items-center justify-center font-extrabold px-5",
          {
            "animate-pulse pointer-events-none": submitting,
          },
        )}
      >
        <form
          className="flex flex-col gap-3 w-full lg:max-w-80 max-w-96"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <Title
            size="xl"
            title="Skills."
            subtitle="Забыли пароль"
            description="Мы отправим вам ссылку для восстановления пароля на указанный вами Email"
          />
          <Input
            label="Почта"
            placeholder="Введите почту"
            value={email}
            onChange={handleChange}
            error={error}
            autoFocus
          />
          <Button
            variant="secondary"
            className="mt-2"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Отправляем..." : "Восстановить пароль"}
          </Button>
          <Button
            variant="teritary"
            type="button"
            onClick={() => navigate("/login")}
          >
            Вернуться назад
          </Button>
        </form>
      </main>
    </AnimationWrapper.Opacity>
  );
}
