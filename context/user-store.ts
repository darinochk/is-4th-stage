import {create} from "zustand";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

export enum Role {
	USER = "USER",
	WAITER = "WAITER",
	ADMIN = "ADMIN"
}

export interface IntUser {
	"id": number;
	"firstName": string;
	"lastName": string;
	"email": string;
	"role": Role;
	"phone": string;
	locked: boolean;
}

interface User {
	inited: boolean;
	user: IntUser | null;
	token: string | null;
	Login: (user: IntUser, token: string) => void;
	Logout: () => void;
	init: (router: AppRouterInstance, pathname: string) => void;
}

export const useUserStore = create<User>((set) => ({
    inited: false,
	user: null,
	token: null,
	Login: function (user, token,) {
		localStorage.setItem("user", JSON.stringify(user));
		localStorage.setItem("token", token);
		set({user, token});
	},
	Logout: function () {
		console.log('logout')
		localStorage.removeItem("user");
		localStorage.removeItem("token");
		set({user: null, token: null});
	},
	init: function(router, pathname) {
		try {
			const user: IntUser = JSON.parse(localStorage.getItem("user") || "");
			const token = localStorage.getItem("token");
			set({token: token, inited: true, user});
			if(!user && pathname !== "/login" && pathname !== "/register") router.push("/login");
		} catch (e) {
			console.warn(e);
			set({inited: true});
			if(pathname !== "/login" && pathname !== "/register") router.push("/login");
		}
	}
}));
