import { $api } from "@/shared/lib/$api";
import { cva } from "@/shared/lib/cva";
import AnimationWrapper from "@/shared/ui/AnimationWrapper";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import Title from "@/shared/ui/Title";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router";

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const passwordRef = useRef<HTMLInputElement>(null);
  const authCodeRef = useRef<string>("");
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      sessionStorage.setItem("authCode", code || "");
      authCodeRef.current = code;
      setSearchParams("");
    }
  }, [searchParams, setSearchParams]);

  const onSubmit = async () => {
    const password = passwordRef.current?.value;
    const passwordConfirm = passwordConfirmRef.current?.value;

    if (!password || password.length < 6) {
      setError("Пароль должен быть не менее 6 символов");
      return;
    }

    if (password !== passwordConfirm) {
      setError("Пароли не совпадают");
      return;
    }
    const code = authCodeRef.current ?? sessionStorage.getItem("authCode");
    if (!code) {
      toast.error("Код не найден");
      return;
    }
    setLoading(true);

    try {
      await $api.post("/users/invite-accept", {
        password,
        code,
      });
      toast.success("Пароль успешно создан");
      navigate("/login");
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(
          err.response?.data?.message || "Ошибка при создании пароля",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const onChange = () => setError("");

  return (
    <AnimationWrapper.Opacity className="flex-1">
      <main
        className={cva(
          "min-h-screen flex items-center justify-center font-extrabold px-5",
          {
            "animate-pulse pointer-events-none": loading,
          },
        )}
      >
        <div className="flex flex-col gap-3 lg:max-w-80 max-w-96 w-full">
          <Title title="Skills." subtitle="Welcome to" size="xl" />
          <Input
            label="Придумайте пароль"
            placeholder="Ваш пароль"
            onChange={onChange}
            ref={passwordRef}
          />
          <Input
            label="Повторите пароль"
            placeholder="Ваш пароль"
            error={error}
            onChange={onChange}
            ref={passwordConfirmRef}
          />
          <Button variant="secondary" className="mt-2" onClick={onSubmit}>
            Сохранить пароль
          </Button>
        </div>
      </main>
    </AnimationWrapper.Opacity>
  );
}
