"use client";
import Spinner from "@/app/components/spinner";
import { useEffect, useState } from "react";
import styles from "./../login/page.module.css";
import { authService } from "@/app/services/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/context/user-store";
import {
  EmailValidator,
  NameValidator,
  PasswordValidator,
  PhoneValidator,
} from "@/app/(auth)/login/validators";
import { ApiMessage } from "@/app/services/http";
import MessageComponent from "@/app/components/message";
import Logo from "@/app/components/logo";

export default function RegisterPage() {
  const [response, setResponse] = useState<ApiMessage | null>(null);
  const [requestSent, setRequestSent] = useState<boolean>(false);
  const router = useRouter();
  const user = useUserStore((state) => state);

  useEffect(() => {
    response && setRequestSent(false);
    if (user.user) router.push("/");
  }, [response, router, user]);

  return (
    <main style={{ height: "-webkit-fill-available", display: "flex", flexDirection: "column" }}>
      <h1 className={styles.title}>
        <Logo />
      </h1>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);

          setResponse(null);
          setRequestSent(true);
          authService.register(Object.fromEntries(formData), setResponse);
        }}
      >
        <label>
          Имя
          <br />
          <input type="text" name="firstName" required onInput={NameValidator} />
        </label>
        <label>
          Фамилия
          <br />
          <input type="text" name="lastName" required onInput={NameValidator} />
        </label>
        <label>
          Email
          <br />
          <input type="email" name="email" required autoComplete="email" onInput={EmailValidator} />
        </label>
        <label>
          Номер
          <br />
          <input type="tel" name="phone" onInput={PhoneValidator} />
        </label>
        <label>
          Пароль
          <br />
          <input
            type="password"
            name="password"
            required
            autoComplete="new-password"
            onInput={PasswordValidator}
            minLength={6}
          />
        </label>
        <MessageComponent message={response} />
        <button disabled={requestSent}>
          {requestSent && (
            <Spinner size={30} style={{ margin: "-11px 0 -11px -32px", paddingRight: "32px" }} />
          )}
          Зарегистрироваться
        </button>
        <Link href="/login" className={styles.register_link}>
          Уже есть аккаунт?
        </Link>
      </form>
    </main>
  );
}
