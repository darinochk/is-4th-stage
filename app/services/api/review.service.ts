import { httpClient, ApiMessage } from "../http";
import { Review } from "./types";

export class ReviewService {
  async getReviews(): Promise<Review[]> {
    try {
      const reviews = await httpClient.get<Review[]>("/reviews/");
      return this.mapReviewDates(reviews);
    } catch (err: any) {
      httpClient.handleError(err);
      return [];
    }
  }

  async getReviewsByUser(id: number): Promise<Review[]> {
    try {
      const reviews = await httpClient.get<Review[]>(`/reviews/user/${id}`);
      return this.mapReviewDates(reviews);
    } catch (err: any) {
      httpClient.handleError(err);
      return [];
    }
  }

  async createReview(
    payload: any,
    setMessage: (message: ApiMessage) => void
  ): Promise<Review | null> {
    try {
      const data = await httpClient.post<Review>("/reviews/create", payload);
      data.reviewDate = new Date(data.reviewDate);
      setMessage({ isError: false, message: "Отзыв создан" });
      return data;
    } catch (err: any) {
      httpClient.handleError(err, setMessage);
      return null;
    }
  }

  async deleteReview(id: number): Promise<void> {
    try {
      await httpClient.delete(`/reviews/delete/${id}`);
    } catch (err: any) {
      httpClient.handleError(err);
    }
  }

  async moderateReview(id: number, text: string): Promise<Review | null> {
    try {
      return await httpClient.put<Review>(`/admin/moderateReview/${id}?newText=${text}`);
    } catch (err: any) {
      httpClient.handleError(err);
      return null;
    }
  }

  private mapReviewDates(reviews: Review[]): Review[] {
    return reviews.map((review) => ({
      ...review,
      reviewDate: new Date(review.reviewDate),
    }));
  }
}

export const reviewService = new ReviewService();
