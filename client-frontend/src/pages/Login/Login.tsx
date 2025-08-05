import { useRef, useState, useCallback } from "react";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import Title from "@/shared/ui/Title";
import { Link, Navigate } from "react-router";
import { $api } from "@/shared/lib/$api";
import { useAtomValue, useSetAtom } from "jotai";
import { userAtom } from "@/atoms/userAtom";
import { validationService } from "@/shared/lib/services/validationService";
import { cva } from "@/shared/lib/cva";
import AnimationWrapper from "@/shared/ui/AnimationWrapper";

interface FormErrors {
  email?: string;
  password?: string;
}

export default function Login() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const setUser = useSetAtom(userAtom);
  const user = useAtomValue(userAtom);

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  const clearError = useCallback((field: keyof FormErrors) => {
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const email = emailRef.current?.value.trim() || "";
      const password = passwordRef.current?.value || "";

      const newErrors: FormErrors = {};

      if (!validationService.validateEmail(email)) {
        newErrors.email = "Введите корректный email";
      }
      if (!password) {
        newErrors.password = "Введите пароль";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) return;

      setSubmitting(true);
      try {
        const response = await $api.post("/auth/sign-in", {
          email,
          password,
        });
        setUser(response.data);
      } catch {
        setErrors({ password: "Неверный email или пароль" });
      } finally {
        setSubmitting(false);
      }
    },
    [],
  );

  if (user) return <Navigate to="/" />;

  return (
    <AnimationWrapper.Opacity className="flex-1">
      <main
        className={cva(
          "min-h-screen flex items-center justify-center font-extrabold px-5",
          {
            "pointer-events-none animate-pulse": submitting,
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
            subtitle="Войдите в aya"
            description="Введите данные для входа"
          />
          <Input
            label="Email"
            type="email"
            ref={emailRef}
            error={errors.email}
            autoComplete="email"
            onChange={() => clearError("email")}
          />
          <Input
            label="Пароль"
            type="password"
            ref={passwordRef}
            error={errors.password}
            autoComplete="current-password"
            onChange={() => clearError("password")}
            right={
              <Link
                to="/forgot-password"
                state={{ email: emailRef.current?.value }}
                className="text-sm text-accent cursor-pointer"
              >
                Забыли пароль?
              </Link>
            }
          />
          <Button
            variant="secondary"
            className="mt-2"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Вход..." : "Войти"}
          </Button>
          <p className="text-sm text-secondary text-center">
            Данные для входа вы можете узнать у своего руководителя или HR
          </p>
        </form>
      </main>
    </AnimationWrapper.Opacity>
  );
}
