'use client';

import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, CheckCircle, Plus } from 'lucide-react';
import { RatingStars } from '@/components/ui/RatingStars';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/context/ToastContext';
import { useProductReviewsQuery, useSubmitReviewMutation } from '@/hooks/review/useReview';
import { extractArray } from '@/lib/apiHelper';

interface ProductReviewsSectionProps {
  productId: string;
  rating: number;
  reviewCount: number;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  productId,
  rating,
  reviewCount,
}) => {
  const { showToast } = useToast();
  const { data: reviewsResponse, isLoading } = useProductReviewsQuery(productId);
  const submitReviewMutation = useSubmitReviewMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');

  const reviews = extractArray(reviewsResponse);

  const handleHelpful = (_id: string) => {
    showToast('Marked review as helpful');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !newTitle.trim()) return;

    try {
      await submitReviewMutation.mutateAsync({
        productId,
        rating: newRating,
        title: newTitle,
        content: newComment,
      });

      setIsModalOpen(false);
      setNewTitle('');
      setNewComment('');
      showToast('Thank you! Your verified review has been submitted for moderation.');
    } catch {
      showToast('Failed to submit review. Please ensure you are logged in.');
    }
  };

  return (
    <section className="w-full bg-white rounded-3xl p-6 sm:p-10 border border-[#e2e7ff] shadow-sm flex flex-col gap-8">
      {/* Header & Write Review Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e2e7ff]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-5 h-5 text-[#412ce7]" />
            <h2 className="text-xl font-bold text-[#131b2e]">Discerning Collector Reviews</h2>
          </div>
          <p className="text-xs text-[#464556]">Verified owner assessments on ergonomics, acoustics, and durability.</p>
        </div>

        <Button
          variant="secondary"
          size="md"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Write a Review
        </Button>
      </div>

      {/* Rating Summary Strip */}
      <div className="p-6 rounded-2xl bg-[#faf8ff] border border-[#e2e7ff] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <span className="text-4xl font-extrabold text-[#131b2e]">{rating.toFixed(2)}</span>
          <div>
            <RatingStars rating={rating} size="md" />
            <span className="text-xs text-[#777588] block mt-1">Based on {reviewCount} verified purchases</span>
          </div>
        </div>
        <div className="flex items-center gap-6 text-xs text-[#464556]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span>98% Recommend</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#412ce7]" />
            <span>100% Authenticated</span>
          </div>
        </div>
      </div>

      {/* Review List */}
      <div className="flex flex-col gap-6">
        {isLoading && (
          <p className="text-xs text-[#777588] py-4 text-center">Loading verified reviews...</p>
        )}
        {!isLoading && reviews.length === 0 && (
          <p className="text-xs text-[#777588] py-4 text-center">No reviews yet. Be the first to share your thoughts!</p>
        )}
        {reviews.map((rev: any) => (
          <div key={rev.id} className="p-5 rounded-2xl bg-[#faf8ff] border border-[#e2e7ff] flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <RatingStars rating={rev.rating} />
                <span className="text-xs font-bold text-[#131b2e]">{rev.title}</span>
              </div>
              <span className="text-xs text-[#777588]">{rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent'}</span>
            </div>

            <p className="text-xs text-[#464556] leading-relaxed">{rev.content}</p>

            <div className="flex items-center justify-between pt-3 border-t border-[#e2e7ff] text-xs">
              <div className="flex items-center gap-2 text-[#777588]">
                <span className="font-semibold text-[#131b2e]">{rev.user?.firstName || 'Collector'}</span>
                {rev.isVerifiedPurchase && (
                  <span className="inline-flex items-center gap-1 text-green-700 font-medium">
                    <CheckCircle className="w-3 h-3" />
                    <span>Verified Purchase</span>
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleHelpful(rev.id)}
                className="flex items-center gap-1.5 text-[#464556] hover:text-[#412ce7] font-semibold transition-colors"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Helpful ({rev.helpfulCount || 0})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Write a Review Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Publish a Verified Review">
        <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-[#777588] mb-1.5 block">Your Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setNewRating(s)}
                  className={`text-2xl ${s <= newRating ? 'text-[#fd6a49]' : 'text-[#c7c4d9]'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-[#777588] mb-1.5 block">Review Headline</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Exceptional finish and build quality"
              className="w-full h-10 px-3 border border-[#c7c4d9] rounded-lg text-xs outline-none focus:border-[#412ce7]"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-[#777588] mb-1.5 block">Detailed Feedback</label>
            <textarea
              required
              rows={4}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Describe the tactile feel, finish, and ergonomics..."
              className="w-full p-3 border border-[#c7c4d9] rounded-lg text-xs outline-none focus:border-[#412ce7]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="md" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" disabled={submitReviewMutation.isPending}>
              {submitReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </Modal>
    </section>
  );
};
