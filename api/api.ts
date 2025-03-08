import axios from "axios";
import {useUserStore} from "@/context/user-store";


const BACK_URL = 'http://localhost:8080/';

export interface Message {
    message: string;
    isError: boolean;
}

export const api = axios.create({
    baseURL: BACK_URL
})

api.interceptors.request.use(function (config: any) {
    if(useUserStore.getState().token) {
        config.headers.Authorization = 'Bearer ' + useUserStore.getState().token
    }
    return config;
}, function (error: any) {
    return Promise.reject(error);
});

export interface Page<T> {
    content: T[];
    totalPages: number
}

export async function loadAllPages<T>(
    fetchFunc: (page: number, arg: number) => Promise<Page<T[]>>,
    arg: number
): Promise<T[]> {
    const getPage = async (page: number, content: T[]): Promise<T[]> => {
        const data = await fetchFunc(page, arg);
        // @ts-ignore
        content.push(...data.content);
        return page < data.totalPages ? getPage(page + 1, content) : content;
    };
    return await getPage(0, []);
}

export function DefaultErrorHandler(setError: (err: Message) => void) {
    return (err: any) => {
        if (err.code == 403)
            useUserStore.getState().Logout();
        const message = err.response.data;
        setError({isError: true, message: JSON.stringify(message)});
    }
}