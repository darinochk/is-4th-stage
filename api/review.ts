import {api, DefaultErrorHandler, Message} from "@/api/api";

export interface Review {
    id: number;
    userName: string;
    rating: number;
    reviewText: string;
    reviewDate: Date;
}

export async function GetReviews() {
    try {
        const res = await api.get('/reviews/');
        res.data = (res.data as Review[]).map((review: Review) => (review.reviewDate = new Date(review.reviewDate), review));
        return res.data;
    } catch (err: any) {
        DefaultErrorHandler(() => {})(err);
        return [];
    }
}

export async function GetReviewsByUser(id: number) {
    try {
        const res = await api.get('/reviews/user/' + id);
        res.data = (res.data as Review[]).map((review: Review) => (review.reviewDate = new Date(review.reviewDate), review));
        return res.data;
    } catch (err: any) {
        DefaultErrorHandler(() => {})(err);
        return [];
    }
}

export async function CreateReview(payload: any, setMessage: (message: Message) => void): Promise<Review | null> {
    try {
        const res = await api.post('/reviews/create', payload);
        setMessage({isError: false, message: "Отзыв создан"});
        return res.data;
    } catch (err: any) {
        DefaultErrorHandler(setMessage)(err);
        return null;
    }
}

export async function DeleteReview(id: number) {
    try {
        const res = await api.delete('/reviews/delete/' + id);
    } catch (err: any) {
        DefaultErrorHandler(() => {})(err);
    }
}

export async function ModerateReview(id: number, text: string): Promise<Review | null>{
    try {
        const res = await api.put('/admin/moderateReview/' + id + '?newText=' + text);
        return res.data;
    } catch (err: any) {
        DefaultErrorHandler(() => {})(err);
        return null;
    }
}