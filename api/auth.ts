import {api, DefaultErrorHandler, Message} from "@/api/api";
import {useUserStore} from "@/context/user-store";


export async function Register(email: string, password: string, setMessage: (message: Message) => void) {
	const setError = (err: string) => setMessage({isError: true, message: err});
	try {
		const res = await api.post("/account/register/", {email, password});
		useUserStore.getState().Login(res.data.user, res.data.token);
		setMessage({isError: false, message: "Ваш аккаунт создан!"});
	} catch (err: any) {
		DefaultErrorHandler(setError)(err);
	}
}


export async function Login(email: string, password: string, setMessage: (message: Message) => void) {
	const setError = (err: string) => setMessage({isError: true, message: err});
	try {
		const res = await api.post("/account/login/", {email, password});
		useUserStore.getState().Login(res.data.user, res.data.token);
		setMessage({isError: false, message: "Вы вошли в аккаунт!"});
	} catch (err: any) {
		DefaultErrorHandler(setError)(err);
	}
}
