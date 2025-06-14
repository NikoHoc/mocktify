"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabaseClient";

interface Review {
  id: string;
  created_at: string;
  song_id: string;
  content: string;
  user_id?: string;
  isEditing?: boolean;
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
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
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

interface ReviewPageProps {
  params: Promise<{
    songId: string;
  }>;
}

export default function ReviewPage({ params }: ReviewPageProps) {
  const unwrappedParams = React.use(params);
  const songId = unwrappedParams.songId;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    const fetchUserAndReviews = async () => {
      try {
        setLoading(true);
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const res = await fetch(`/api/reviews?song_id=${songId}`, {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await res.json();
        setReviews(data.reviews || []);

        if (session?.user.id) {
          const userReview = data.reviews?.find(
            (review: Review) => review.user_id === session.user.id
          );
          setHasReviewed(!!userReview);
          setUserId(session.user.id);
        }
      } catch {
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    if (songId) {
      fetchUserAndReviews();
    }
  }, [songId]);

  const handleAddReview = (review: Review) => {
    setReviews((prev) => [review, ...prev]);
    setHasReviewed(true);
  };

  if (!songId) {
    return <div className="p-4">Invalid song ID.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Reviews</h1>
      {hasReviewed ? (
        <p className="mb-6 text-green-600">You have already reviewed this song.</p>
      ) : (
        <ReviewForm songId={songId} onAddReview={handleAddReview} />
      )}
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
                {userId === review.user_id && review.isEditing ? (
                  <>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded mb-2"
                      rows={4}
                      defaultValue={review.content}
                      onChange={(e) => {
                        const updatedContent = e.target.value;
                        setReviews((prev) =>
                          prev.map((r) =>
                            r.id === review.id ? { ...r, content: updatedContent } : r
                          )
                        );
                      }}
                    />
                    <button
                      className="mr-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      onClick={async () => {
                        try {
                          const {
                            data: { session },
                          } = await supabase.auth.getSession();

                          const response = await fetch("/api/reviews", {
                            method: "PATCH",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${session?.access_token}`,
                            },
                            body: JSON.stringify({ review_id: review.id, content: review.content }),
                          });
                          if (!response.ok) {
                            throw new Error("Failed to update review");
                          }
                          const updatedReview = await response.json();
                          setReviews((prev) =>
                            prev.map((r) => (r.id === review.id ? updatedReview : r))
                          );
                          setReviews((prev) =>
                            prev.map((r) =>
                              r.id === review.id ? { ...r, isEditing: false } : r
                            )
                          );
                        } catch (error) {
                          alert("Error updating review");
                        }
                      }}
                    >
                      Save
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      onClick={() => {
                        setReviews((prev) =>
                          prev.map((r) => (r.id === review.id ? { ...r, isEditing: false } : r))
                        );
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <p>{review.content}</p>
                    {userId === review.user_id && (
                      <>
                        <button
                          className="mt-2 mr-2 px-2 py-1 text-sm text-blue-600 underline"
                          onClick={() => {
                            setReviews((prev) =>
                              prev.map((r) =>
                                r.id === review.id ? { ...r, isEditing: true } : r
                              )
                            );
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="mt-2 px-2 py-1 text-sm text-red-600 underline"
                          onClick={async () => {
                            if (!confirm("Are you sure you want to delete this review?")) return;
                            try {
                              const {
                                data: { session },
                              } = await supabase.auth.getSession();

                              const response = await fetch(`/api/reviews?review_id=${review.id}`, {
                                method: "DELETE",
                                headers: {
                                  Authorization: `Bearer ${session?.access_token}`,
                                },
                              });

                              if (!response.ok) {
                                throw new Error("Failed to delete review");
                              }

                              setReviews((prev) => prev.filter((r) => r.id !== review.id));
                              setHasReviewed(false);
                            } catch {
                              alert("Error deleting review");
                            }
                          }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      Posted on {new Date(review.created_at).toLocaleString()}
                    </p>
                  </>
                )}
              </li>
            ))}
          </ul>
      )}
    </div>
  );
}
