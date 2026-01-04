"use client";
import styles from "./page.module.css";
import MessageComponent from "@/app/components/message";
import Spinner from "@/app/components/spinner";
import { FocusEventHandler, useEffect, useState } from "react";
import { Message } from "@/api/api";
import { CreateReview, GetReviews, ModerateReview, Review } from "@/api/review";
import { useUserStore } from "@/context/user-store";
import edit from "@/public/edit.svg";
import save from "@/public/save.svg";
import no_photo from "@/public/no_photo.png";
import { useAuthEffect } from "@/api/auth";

const DATE_FORMATTER = new Intl.DateTimeFormat("ru-RU", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function Page() {
  const [reviews, setReviews] = useState<Review[]>([]);

  const [writing, setWriting] = useState(false);
  const [closingTimeout, setClosingTimeout] = useState<NodeJS.Timeout>(setTimeout(() => {}, 0));

  const [response, setResponse] = useState<Message | null>(null);
  const [requestSent, setRequestSent] = useState<boolean>(false);

  useAuthEffect(() => {
    GetReviews().then(setReviews);
  }, []);

  const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    if (!e.currentTarget.value) setClosingTimeout(setTimeout(() => setWriting(false), 100));
  };

  const handleFocus = () => {
    setWriting(true);
    clearTimeout(closingTimeout);
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Отзывы</h1>
      <form
        className={styles.write_desk + " " + (writing ? "" : styles.collapsed)}
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const form = e.currentTarget;
          CreateReview(Object.fromEntries(formData), setResponse).then((post) => {
            if (post) {
              setReviews([...reviews, post]);
              form.reset();
              setWriting(false);
              setResponse(null);
            }
          });
        }}
      >
        <input
          type="text"
          className={styles.text}
          name="reviewText"
          maxLength={256}
          required
          placeholder="Что вы думаете о нас?"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <input type="hidden" value={new Date().toISOString()} name="reviewDate" />
        <div>
          Ваша оценка:
          <div className={styles.rating__chooser}>
            <input
              type="radio"
              id="rating1"
              name="rating"
              value="1"
              required
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <label htmlFor="rating1">1</label>

            <input
              type="radio"
              id="rating2"
              name="rating"
              value="2"
              required
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <label htmlFor="rating2">2</label>

            <input
              type="radio"
              id="rating3"
              name="rating"
              value="3"
              required
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <label htmlFor="rating3">3</label>

            <input
              type="radio"
              id="rating4"
              name="rating"
              value="4"
              required
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <label htmlFor="rating4">4</label>

            <input
              type="radio"
              id="rating5"
              name="rating"
              value="5"
              required
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <label htmlFor="rating5">5</label>
          </div>
        </div>
        <MessageComponent message={response} />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className={styles.publish} disabled={requestSent}>
            {requestSent && (
              <Spinner size={30} style={{ margin: "-11px 0 -11px -32px", paddingRight: "32px" }} />
            )}
            Опубликовать отзыв
          </button>
        </div>
      </form>
      <div className={styles.reviews_container}>
        {reviews.map((e) => (
          <ReviewCard key={e.id} review={e} />
        ))}
      </div>
    </main>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const [editing, setEditing] = useState(false);
  const [editedReview, setEditedReview] = useState(review);
  const isAdmin = useUserStore((state) => state.user?.role === "ADMIN");

  return (
    <div className={styles.review + " " + (editing ? styles.editing : "")}>
      {isAdmin && (
        <img
          src={editing ? save.src : edit.src}
          className={styles.edit_review}
          alt="Редактировать"
          onClick={() => {
            setEditing(!editing);
            if (editing) {
              ModerateReview(review.id, editedReview.reviewText).then((review) => {
                if (review) setEditedReview(review);
              });
            }
          }}
        />
      )}
      <a className={styles.review_author}>
        <img
          src={no_photo.src}
          alt=""
          width={50}
          height={50}
          style={{ objectFit: "cover", borderRadius: "100%" }}
        />
        <div className={styles.author_info}>
          <p className={styles.author_name}>{review.userName}</p>
          <p className={styles.author_position}></p>
        </div>
      </a>
      {/*<p className={styles.review_title} contentEditable={editing} onInput={(e) => {*/}
      {/*    setEditedReview({...editedReview, title: e.currentTarget.innerText});*/}
      {/*}}>{editedReview.reviewText}</p>*/}
      <pre
        contentEditable={editing}
        onInput={(e) => {
          setEditedReview({ ...editedReview, reviewText: e.currentTarget.innerText });
        }}
        suppressContentEditableWarning
        className={styles.review_text + " " + styles.opened}
      >
        {editedReview.reviewText}
      </pre>
      <div className={styles.review_info}>
        <p className={styles.review_date}>{DATE_FORMATTER.format(review.reviewDate.getTime())}</p>
      </div>
    </div>
  );
}
