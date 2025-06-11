"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface Review {
  id: string;
  created_at: string;
  song_id: string;
  content: string;
}

interface ReviewFormProps {
  songId: string;
  onAddReview: (review: Review) => void;
}

const ReviewForm = ({ songId, onAddReview }: ReviewFormProps) => {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ song_id: songId, content }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      const newReview = await response.json();
      onAddReview(newReview);
      setContent("");
    } catch (error) {
      console.error(error);
      alert("Error submitting review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <textarea
        className="w-full p-2 border border-gray-300 rounded mb-2"
        rows={4}
        placeholder="Write your review here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={submitting}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={submitting}
      >
        {submitting ? "Submitting..." : "Add Review"}
      </button>
    </form>
  );
};

export default function ReviewPage() {
  const searchParams = useSearchParams();
  const songId = searchParams.get("songId") || "";

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/reviews?song_id=${songId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await res.json();
        setReviews(data.reviews || []);
      } catch {
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    if (songId) {
      fetchReviews();
    }
  }, [songId]);

  const handleAddReview = (review: Review) => {
    setReviews((prev) => [review, ...prev]);
  };

  if (!songId) {
    return <div className="p-4">Invalid song ID.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Reviews</h1>
      <ReviewForm songId={songId} onAddReview={handleAddReview} />
      {loading ? (
        <p>Loading reviews...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : reviews.length === 0 ? (
        <p>No reviews yet. Be the first to add one!</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="border border-gray-300 rounded p-4">
              <p>{review.content}</p>
              <p className="text-sm text-gray-500 mt-2">
                Posted on {new Date(review.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
