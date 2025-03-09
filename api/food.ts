import {api, DefaultErrorHandler} from "@/api/api";


export interface Food {
    id: number;
    name: string;
    price: number;
    foodType: string;
}


export async function GetFood(): Promise<Food[]> {
    try {
        const res = await api.get('/food/');
        return res.data;
    } catch (err: any) {
        DefaultErrorHandler(() => {})(err);
        return [];
    }
}