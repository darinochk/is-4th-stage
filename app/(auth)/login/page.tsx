"use client";
import Spinner from "@/app/components/spinner";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { authService } from "@/app/services/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/context/user-store";
import MessageComponent from "@/app/components/message";
import { ApiMessage } from "@/app/services/http";
import Logo from "@/app/components/logo";

export default function LoginPage() {
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
          authService.login(
            formData.get("email") as string,
            formData.get("password") as string,
            setResponse
          );
        }}
      >
        <label>
          Email
          <br />
          <input type="text" name="email" required minLength={2} autoComplete="email" />
        </label>
        <label>
          Пароль
          <br />
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            minLength={6}
          />
        </label>
        <MessageComponent message={response} />
        <div className={styles.buttons}>
          <button disabled={requestSent}>
            {requestSent && (
              <Spinner size={30} style={{ margin: "-11px 0 -11px -32px", paddingRight: "32px" }} />
            )}
            Войти
          </button>
        </div>
        <Link href="/register" className={styles.register_link}>
          Регистрация
        </Link>
      </form>
    </main>
  );
}
