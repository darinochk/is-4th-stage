import {api, DefaultErrorHandler, Message} from "@/api/api";
import {useUserStore} from "@/context/user-store";
import {EffectCallback, useEffect} from "react";


export async function Register(payload: any, setMessage: (message: Message) => void) {
	try {
		const res = await api.post("/account/register/", payload);
		useUserStore.getState().Login(res.data.user, res.data.token);
		setMessage({isError: false, message: "Ваш аккаунт создан!"});
	} catch (err: any) {
		DefaultErrorHandler(setMessage)(err);
	}
}


export async function Login(email: string, password: string, setMessage: (message: Message) => void) {
	try {
		const res = await api.post("/account/login/", {email, password});
		useUserStore.getState().Login(res.data.user, res.data.token);
		setMessage({isError: false, message: "Вы вошли в аккаунт!"});
	} catch (err: any) {
		DefaultErrorHandler(setMessage)(err);
	}
}

export function useAuthEffect(effect: EffectCallback, deps?: React.DependencyList) {
	const state = useUserStore();

	useEffect(() => {
		if (state.inited && state.user) {
			effect();
		}
	}, (deps || []).concat(state));
}