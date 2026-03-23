import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, MessageSquareText, Send, Star } from 'lucide-react';
import styles from '../OwnerDashboard.module.css';
import api from '../../../api/axios';

function StarRow({ rating, size = 14 }) {
    return (
        <span style={{ display: 'inline-flex', gap: '2px', color: '#F5A623' }}>
            {[1, 2, 3, 4, 5].map((n) => (
                <Star
                    key={n}
                    size={size}
                    fill={n <= Math.round(Number(rating) || 0) ? '#F5A623' : 'none'}
                    color={n <= Math.round(Number(rating) || 0) ? '#F5A623' : '#D1D5DB'}
                />
            ))}
        </span>
    );
}

export default function ReviewsSection() {
    const [loading, setLoading] = useState(true);
    const [ratingFilter, setRatingFilter] = useState('all');
    const [summary, setSummary] = useState({
        average_rating: 0,
        total_reviews: 0,
        five_star_reviews: 0,
        awaiting_reply: 0,
        distribution: [],
    });
    const [reviews, setReviews] = useState([]);
    const [replyDrafts, setReplyDrafts] = useState({});
    const [replyingId, setReplyingId] = useState(null);

    useEffect(() => {
        fetchReviews();
    }, []);

    async function fetchReviews() {
        setLoading(true);
        try {
            const res = await api.get('/owner/reviews');
            setSummary(res.data.summary);
            setReviews(res.data.reviews);
        } catch (error) {
            console.error('Failed to fetch owner reviews:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleReply(reviewId) {
        const ownerReply = (replyDrafts[reviewId] || '').trim();
        if (!ownerReply) return;

        setReplyingId(reviewId);
        try {
            const res = await api.post(`/owner/reviews/${reviewId}/reply`, { owner_reply: ownerReply });
            setReviews((prev) => prev.map((review) => review.id === reviewId ? res.data.review : review));
            setSummary((prev) => ({
                ...prev,
                awaiting_reply: Math.max(0, prev.awaiting_reply - 1),
            }));
            setReplyDrafts((prev) => ({ ...prev, [reviewId]: '' }));
        } catch (error) {
            console.error('Failed to reply to review:', error);
        } finally {
            setReplyingId(null);
        }
    }

    const filteredReviews = useMemo(() => {
        if (ratingFilter === 'all') return reviews;
        if (ratingFilter === 'awaiting') return reviews.filter((review) => !review.owner_reply);
        return reviews.filter((review) => String(review.rating) === ratingFilter);
    }, [reviews, ratingFilter]);

    return (
        <div className={styles.overviewContainer}>
            <div className={styles.sectionHeader}>
                <div>
                    <h2 className={styles.sectionTitle}>Reviews</h2>
                    <p className={styles.topSub}>Read and respond to customer feedback to maintain your restaurant&apos;s reputation.</p>
                </div>
                <select className={styles.chartSelect} value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
                    <option value="all">All Ratings</option>
                    <option value="awaiting">Awaiting Reply</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                </select>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCardNew}>
                    <div className={styles.statLabelNew}>Average Rating</div>
                    <div className={styles.statValueNew}>{Number(summary.average_rating || 0).toFixed(1)}</div>
                    <StarRow rating={summary.average_rating} />
                </div>
                <div className={styles.statCardNew}>
                    <div className={styles.statLabelNew}>Total Reviews</div>
                    <div className={styles.statValueNew}>{summary.total_reviews}</div>
                    <div className={styles.topSub}>Live customer feedback</div>
                </div>
                <div className={styles.statCardNew}>
                    <div className={styles.statLabelNew}>5 Star Reviews</div>
                    <div className={styles.statValueNew}>{summary.five_star_reviews}</div>
                    <div className={styles.topSub}>Strong positive sentiment</div>
                </div>
                <div className={styles.statCardNew}>
                    <div className={styles.statLabelNew}>Awaiting Reply</div>
                    <div className={styles.statValueNew}>{summary.awaiting_reply}</div>
                    <div className={styles.topSub}>Needs restaurant response</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.4fr', gap: '1.5rem' }}>
                <div className={styles.infoCardDesktop}>
                    <div style={{ display: 'grid', placeItems: 'center', minHeight: '220px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div className={styles.reviewScoreBig} style={{ fontSize: '3rem' }}>{Number(summary.average_rating || 0).toFixed(1)}</div>
                            <div style={{ margin: '0.5rem 0' }}><StarRow rating={summary.average_rating} size={18} /></div>
                            <div className={styles.topSub}>Based on {summary.total_reviews} reviews</div>
                        </div>
                    </div>
                </div>

                <div className={styles.infoCardDesktop}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', justifyContent: 'center', minHeight: '220px' }}>
                        {summary.distribution.map((bar) => (
                            <div key={bar.rating} style={{ display: 'grid', gridTemplateColumns: '18px 1fr 44px', gap: '0.85rem', alignItems: 'center' }}>
                                <span style={{ fontWeight: 700, color: '#6B7280' }}>{bar.rating}</span>
                                <div style={{ height: '8px', borderRadius: '999px', background: '#F3F4F6', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${bar.percentage}%`, background: 'linear-gradient(90deg, #991B1B, #B42318)', borderRadius: '999px' }}></div>
                                </div>
                                <span style={{ color: '#6B7280', fontSize: '0.84rem' }}>{bar.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.infoCardDesktop}>
                {loading ? (
                    <div className={styles.topSub}>Loading reviews...</div>
                ) : filteredReviews.length === 0 ? (
                    <div style={{ padding: '2rem 0', textAlign: 'center', color: '#6B7280' }}>
                        No reviews found for this filter yet.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {filteredReviews.map((review) => (
                            <div key={review.id} style={{ border: '1px solid #E5E7EB', borderRadius: '18px', padding: '1.25rem 1.35rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start' }}>
                                    <div style={{ display: 'flex', gap: '0.85rem' }}>
                                        <div style={{ width: '42px', height: '42px', borderRadius: '999px', background: '#F3F4F6', display: 'grid', placeItems: 'center', fontWeight: 700, color: '#6B7280' }}>
                                            {review.customer_initials}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, color: '#111827' }}>{review.customer_name}</div>
                                            <div style={{ fontSize: '0.82rem', color: '#9CA3AF', marginTop: '0.1rem' }}>
                                                {review.order_number ? `${review.order_number} • ` : ''}
                                                {review.created_at_human}
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginTop: '0.65rem' }}>
                                                {review.order_items?.slice(0, 3).map((item) => (
                                                    <span key={`${review.id}-${item.name}`} style={{ background: '#FEF2F2', color: '#B42318', borderRadius: '999px', padding: '0.28rem 0.7rem', fontSize: '0.72rem', fontWeight: 600 }}>
                                                        {item.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <StarRow rating={review.rating} />
                                        {review.owner_reply ? (
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#ECFDF5', color: '#047857', borderRadius: '999px', padding: '0.28rem 0.7rem', fontSize: '0.72rem', fontWeight: 700 }}>
                                                <CheckCircle2 size={12} /> Replied
                                            </span>
                                        ) : (
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#FFF7ED', color: '#B45309', borderRadius: '999px', padding: '0.28rem 0.7rem', fontSize: '0.72rem', fontWeight: 700 }}>
                                                <AlertCircle size={12} /> Awaiting Reply
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <p style={{ margin: '1rem 0 0', color: '#374151', lineHeight: 1.7 }}>{review.review}</p>

                                {review.photos?.length > 0 && (
                                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.95rem' }}>
                                        {review.photos.map((photo, index) => (
                                            <img key={photo + index} src={photo} alt="Review" style={{ width: '84px', height: '84px', objectFit: 'cover', borderRadius: '14px', border: '1px solid #E5E7EB' }} />
                                        ))}
                                    </div>
                                )}

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', fontSize: '0.8rem', color: '#6B7280' }}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                        <MessageSquareText size={14} /> Helpful ({review.helpful_count || 0})
                                    </span>
                                </div>

                                {review.owner_reply ? (
                                    <div style={{ marginTop: '1rem', padding: '0.95rem 1rem', borderRadius: '14px', background: '#FFF7ED', border: '1px solid #FED7AA' }}>
                                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#9A3412', marginBottom: '0.35rem' }}>Your Reply</div>
                                        <div style={{ fontSize: '0.88rem', color: '#7C2D12', lineHeight: 1.65 }}>{review.owner_reply}</div>
                                    </div>
                                ) : (
                                    <div style={{ marginTop: '1rem' }}>
                                        <textarea
                                            value={replyDrafts[review.id] || ''}
                                            onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [review.id]: e.target.value }))}
                                            placeholder={`Respond to ${review.customer_name}'s feedback...`}
                                            style={{
                                                width: '100%',
                                                minHeight: '108px',
                                                borderRadius: '14px',
                                                border: '1px solid #E5E7EB',
                                                padding: '0.95rem 1rem',
                                                resize: 'vertical',
                                                outline: 'none',
                                            }}
                                        />
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                                            <button
                                                onClick={() => handleReply(review.id)}
                                                disabled={replyingId === review.id || !(replyDrafts[review.id] || '').trim()}
                                                style={{
                                                    background: '#991B1B',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '10px',
                                                    padding: '0.7rem 1rem',
                                                    fontWeight: 700,
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.45rem',
                                                }}
                                            >
                                                <Send size={14} />
                                                {replyingId === review.id ? 'Posting...' : 'Post Reply'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
