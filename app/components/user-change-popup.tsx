import {Message} from "@/api/api";
import {EmailValidator, NameValidator, PhoneValidator} from "@/app/(auth)/login/validators";
import {IntUser} from "@/context/user-store";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import MessageComponent from "@/app/components/message";
import styles from "@/app/(auth)/login/page.module.css";
import Spinner from "@/app/components/spinner";


export default forwardRef(function UserChangePopup(
    { user, setUser }: {
        user: IntUser,
        setUser: (user: IntUser) => Promise<Message>
    },
    ref: React.Ref<HTMLDialogElement | null>
) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    // @ts-ignore
    useImperativeHandle(ref, () => dialogRef.current);

    const [userInternal, setUserInternal] = useState(user);
    const [response, setResponse] = useState<Message | null>(null)
    const [requestSent, setRequestSent] = useState<boolean>(false);

    useEffect(() => {
        setUserInternal(user);
    }, [user]);

    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (userInternal)
            setUserInternal({
                ...userInternal,
                [e.currentTarget.name]: e.currentTarget.value
            });
    }

    return (
        <dialog ref={dialogRef} onClick={e => {
            if ((e.target as HTMLElement).tagName === 'DIALOG' && e.target === e.currentTarget) dialogRef.current?.close()
        }}>
            <form method='dialog' className={styles.form} style={{marginTop: '10px'}}
                  onSubmit={e => {
                      e.preventDefault();
                      setRequestSent(true);
                      setResponse(null);
                      setUser(userInternal)
                          .then(resp => {
                              if (!resp.isError) {
                                  dialogRef.current?.close();
                              } else {
                                  setResponse(resp);
                              }
                              setRequestSent(false);
                          })
                  }}>
                <h3>Изменение данных</h3>
                <label>
                    Имя<br/>
                    <input type="text" name="firstName" value={userInternal?.firstName || ''}
                           onChange={handleUserChange}
                           required onInput={NameValidator}/>
                </label>
                <label>
                    Фамилия<br/>
                    <input type="text" name="lastName" value={userInternal?.lastName || ''}
                           onChange={handleUserChange} required onInput={NameValidator}/>
                </label>
                <label>
                    Email<br/>
                    <input type="email" name="email" required value={userInternal?.email || ''}
                           onChange={handleUserChange} autoComplete="email" onInput={EmailValidator}/>
                </label>
                <label>
                    Номер<br/>
                    <input type="tel" name="phone" value={userInternal?.phone || ''}
                           onChange={handleUserChange} onInput={PhoneValidator}/>
                </label>
                {/*<label>*/}
                {/*    Пароль<br/>*/}
                {/*    <input type="password" name="password" required autoComplete="new-password"*/}
                {/*           onInput={PasswordValidator} minLength={6}/>*/}
                {/*</label>*/}
                <MessageComponent message={response}/>
                <div className={styles.buttons} style={{marginBottom: '15px'}}>
                    <button disabled={requestSent}>{requestSent &&
                        <Spinner size={30} style={{margin: "-11px 0 -11px -32px", paddingRight: "32px"}}/>}Сохранить
                    </button>
                </div>
            </form>
        </dialog>
    )
})