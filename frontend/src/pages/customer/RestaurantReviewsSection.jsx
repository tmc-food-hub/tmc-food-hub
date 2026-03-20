import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, PenLine, Star, ThumbsUp, UploadCloud, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import styles from './RestaurantMenuPage.module.css';

const MAX_REVIEW_IMAGE_DIMENSION = 1600;
const REVIEW_IMAGE_QUALITY = 0.82;

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

function revokeObjectUrl(url) {
    if (url?.startsWith?.('blob:')) {
        URL.revokeObjectURL(url);
    }
}

function getFirstApiError(error, fallback) {
    const validationErrors = error?.response?.data?.errors;
    if (validationErrors && typeof validationErrors === 'object') {
        for (const value of Object.values(validationErrors)) {
            if (Array.isArray(value) && value[0]) return value[0];
            if (typeof value === 'string' && value) return value;
        }
    }

    return error?.response?.data?.message || fallback;
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
    });
}

async function optimizeReviewImageUpload(file) {
    if (!file.type?.startsWith('image/')) {
        return { uploadFile: file, previewUrl: URL.createObjectURL(file) };
    }

    const sourceUrl = URL.createObjectURL(file);

    try {
        const image = await loadImage(sourceUrl);
        const scale = Math.min(1, MAX_REVIEW_IMAGE_DIMENSION / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) throw new Error('Canvas unavailable');

        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, width, height);

        const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const blob = await new Promise((resolve, reject) => {
            canvas.toBlob((result) => {
                if (!result) {
                    reject(new Error('Unable to optimize image'));
                    return;
                }
                resolve(result);
            }, outputType, outputType === 'image/png' ? undefined : REVIEW_IMAGE_QUALITY);
        });

        const extension = outputType === 'image/png' ? 'png' : 'jpg';
        const baseName = (file.name || 'review-photo').replace(/\.[^.]+$/, '');

        return {
            uploadFile: new File([blob], `${baseName}.${extension}`, {
                type: outputType,
                lastModified: Date.now(),
            }),
            previewUrl: URL.createObjectURL(blob),
        };
    } catch {
        return { uploadFile: file, previewUrl: URL.createObjectURL(file) };
    } finally {
        URL.revokeObjectURL(sourceUrl);
    }
}

export default function RestaurantReviewsSection({ storeId, storeName, fallbackRating = 0 }) {
    const navigate = useNavigate();
    const { isAuthenticated, loading: authLoading } = useAuth();

    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [reviewsData, setReviewsData] = useState({
        summary: { average_rating: 0, total_reviews: 0, distribution: [] },
        reviews: [],
    });
    const [reviewSort, setReviewSort] = useState('recent');
    const [reviewWithPhotosOnly, setReviewWithPhotosOnly] = useState(false);
    const [reviewVerifiedOnly, setReviewVerifiedOnly] = useState(false);
    const [reviewableOrders, setReviewableOrders] = useState([]);
    const [selectedReviewOrderId, setSelectedReviewOrderId] = useState('');
    const [isReviewModalOpen, setReviewModalOpen] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [reviewPhotos, setReviewPhotos] = useState([]);
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewModalError, setReviewModalError] = useState('');
    const [helpfulBusyId, setHelpfulBusyId] = useState(null);

    useEffect(() => {
        fetchReviews();
    }, [storeId, reviewSort, reviewWithPhotosOnly, reviewVerifiedOnly]);

    useEffect(() => {
        if (!authLoading) {
            fetchReviewableOrders();
        }
    }, [storeId, authLoading, isAuthenticated]);

    useEffect(() => {
        return () => {
            reviewPhotos.forEach((photo) => revokeObjectUrl(photo.preview));
        };
    }, [reviewPhotos]);

    async function fetchReviews() {
        setReviewsLoading(true);
        try {
            const res = await api.get(`/restaurants/${storeId}/reviews`, {
                params: {
                    sort: reviewSort,
                    with_photos: reviewWithPhotosOnly,
                    verified_only: reviewVerifiedOnly,
                },
            });
            setReviewsData(res.data);
        } finally {
            setReviewsLoading(false);
        }
    }

    async function fetchReviewableOrders() {
        if (!isAuthenticated || localStorage.getItem('user_type') !== 'customer') {
            setReviewableOrders([]);
            setSelectedReviewOrderId('');
            return;
        }

        try {
            const res = await api.get(`/restaurants/${storeId}/reviewable-orders`);
            const orders = res.data.orders || [];
            setReviewableOrders(orders);
            setSelectedReviewOrderId((current) => current || orders[0]?.id || '');
        } catch {
            setReviewableOrders([]);
            setSelectedReviewOrderId('');
        }
    }

    function resetReviewForm(closeModal = false) {
        reviewPhotos.forEach((photo) => revokeObjectUrl(photo.preview));
        setReviewRating(0);
        setReviewText('');
        setReviewPhotos([]);
        setReviewModalError('');
        setSelectedReviewOrderId(reviewableOrders[0]?.id || '');
        if (closeModal) setReviewModalOpen(false);
    }

    function openReviewModal() {
        if (!isAuthenticated || localStorage.getItem('user_type') !== 'customer') {
            navigate('/login');
            return;
        }

        if (!reviewableOrders.length) {
            setReviewModalError('You can only review this restaurant after you have a delivered order.');
            return;
        }

        setReviewModalError('');
        setSelectedReviewOrderId(reviewableOrders[0]?.id || '');
        setReviewModalOpen(true);
    }

    async function handleReviewPhotoChange(event) {
        const files = Array.from(event.target.files || []);
        const remainingSlots = Math.max(0, 3 - reviewPhotos.length);
        const optimized = await Promise.all(files.slice(0, remainingSlots).map(optimizeReviewImageUpload));

        setReviewPhotos((prev) => [
            ...prev,
            ...optimized.map((photo) => ({ file: photo.uploadFile, preview: photo.previewUrl })),
        ]);

        event.target.value = '';
    }

    function removeReviewPhoto(index) {
        setReviewPhotos((prev) => {
            const next = [...prev];
            const [removed] = next.splice(index, 1);
            if (removed) revokeObjectUrl(removed.preview);
            return next;
        });
    }

    async function submitReview() {
        if (!selectedReviewOrderId) {
            setReviewModalError('You need a delivered order from this restaurant before submitting a review.');
            return;
        }
        if (!reviewRating) {
            setReviewModalError('Please choose an overall rating.');
            return;
        }
        if (reviewText.trim().length < 10) {
            setReviewModalError('Please write at least 10 characters about your experience.');
            return;
        }

        setReviewSubmitting(true);
        setReviewModalError('');

        try {
            const formData = new FormData();
            formData.append('order_id', selectedReviewOrderId);
            formData.append('rating', reviewRating);
            formData.append('review', reviewText.trim());
            reviewPhotos.forEach((photo) => formData.append('photo_files[]', photo.file));

            await api.post(`/restaurants/${storeId}/reviews`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            await Promise.all([fetchReviews(), fetchReviewableOrders()]);
            resetReviewForm(true);
        } catch (error) {
            setReviewModalError(getFirstApiError(error, 'Failed to submit your review. Please try again.'));
        } finally {
            setReviewSubmitting(false);
        }
    }

    async function handleHelpful(reviewId) {
        if (!isAuthenticated || localStorage.getItem('user_type') !== 'customer') {
            navigate('/login');
            return;
        }

        setHelpfulBusyId(reviewId);
        try {
            const res = await api.post(`/reviews/${reviewId}/helpful`);
            setReviewsData((prev) => ({
                ...prev,
                reviews: prev.reviews.map((review) => (
                    review.id === reviewId
                        ? { ...review, helpful_count: res.data.helpful_count }
                        : review
                )),
            }));
        } finally {
            setHelpfulBusyId(null);
        }
    }

    const reviewSummary = reviewsData.summary;
    const displayedReviews = reviewsData.reviews;
    const selectedOrder = reviewableOrders.find((order) => String(order.id) === String(selectedReviewOrderId)) || reviewableOrders[0];
    const avgRating = reviewSummary.total_reviews ? reviewSummary.average_rating : fallbackRating;
    const isCustomer = localStorage.getItem('user_type') === 'customer';
    const canWriteReview = isAuthenticated && isCustomer && reviewableOrders.length > 0;
    const writeReviewLabel = canWriteReview ? 'Write a review' : 'Order first to review';

    return (
        <div className={styles.reviewsSection}>
            <div className={styles.sectionHeader}>
                <div>
                    <h2 className={styles.sectionTitle}>Reviews & Feedbacks</h2>
                    <p className={styles.reviewsSubtitle}><strong>{storeName}</strong> • {reviewSummary.total_reviews} verified reviews</p>
                </div>
                <button
                    className={styles.writeReviewBtn}
                    onClick={openReviewModal}
                    title={!isAuthenticated ? 'Log in to write a review' : !canWriteReview && isCustomer ? 'You need a delivered order from this restaurant first' : 'Write a review'}
                >
                    <PenLine size={16} /> {writeReviewLabel}
                </button>
            </div>

            {isAuthenticated && isCustomer && !reviewableOrders.length && !reviewsLoading && (
                <div style={{ marginBottom: '1rem', background: '#FFF7ED', border: '1px solid #FED7AA', color: '#9A3412', padding: '0.9rem 1rem', borderRadius: '14px', fontSize: '0.9rem' }}>
                    You can only leave a review after you have a delivered order from this restaurant.
                </div>
            )}

            <div className={styles.reviewsGrid}>
                <div className={styles.reviewSummaryCard}>
                    <div className={styles.reviewScore}>
                        <div className={styles.reviewScoreBig}>{Number(avgRating || 0).toFixed(1)}</div>
                        <div className={styles.reviewStars}><StarRow rating={avgRating} size={16} /></div>
                        <div className={styles.reviewBasedOn}>Based on {reviewSummary.total_reviews} reviews</div>
                    </div>
                    <div className={styles.reviewBars} style={{ width: '100%' }}>
                        {reviewSummary.distribution.map((bar) => (
                            <div key={bar.rating} className={styles.reviewBarRow}>
                                <span>{bar.rating}</span>
                                <div className={styles.reviewBarBg}>
                                    <div className={styles.reviewBarFill} style={{ width: `${bar.percentage}%` }}></div>
                                </div>
                                <span className={styles.reviewBarCount}>{bar.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.reviewsListColumn}>
                    <div className={styles.reviewFilters}>
                        <button className={`${styles.reviewFilterBtn} ${reviewSort === 'recent' ? styles.reviewFilterBtnActive : ''}`} onClick={() => setReviewSort('recent')}>Most Recent</button>
                        <button className={`${styles.reviewFilterBtn} ${reviewSort === 'highest_rated' ? styles.reviewFilterBtnActive : ''}`} onClick={() => setReviewSort('highest_rated')}>Highest Rated</button>
                        <button className={`${styles.reviewFilterBtn} ${reviewWithPhotosOnly ? styles.reviewFilterBtnActive : ''}`} onClick={() => setReviewWithPhotosOnly((prev) => !prev)}>With Photos</button>
                        <button className={`${styles.reviewFilterBtn} ${reviewVerifiedOnly ? styles.reviewFilterBtnActive : ''}`} onClick={() => setReviewVerifiedOnly((prev) => !prev)}>Verified Only</button>
                    </div>

                    <div className={styles.reviewCardsListVertical}>
                        {reviewsLoading ? (
                            <div className={styles.reviewCardItem}>Loading reviews...</div>
                        ) : displayedReviews.length === 0 ? (
                            <div className={styles.reviewCardItem}>No reviews match the current filters yet.</div>
                        ) : (
                            displayedReviews.map((review) => (
                                <div key={review.id} className={styles.reviewCardItem}>
                                    <div className={styles.reviewUserRow}>
                                        <div className={styles.reviewUser}>
                                            <div className={styles.reviewAvatar}>
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontWeight: 'bold' }}>{review.customer_initials}</div>
                                            </div>
                                            <div>
                                                <p className={styles.reviewUserName}>{review.customer_name}</p>
                                                <span className={styles.reviewTime}>{review.order_number ? `${review.order_number} • ` : ''}{review.created_at_human}</span>
                                            </div>
                                        </div>
                                        <div className={styles.reviewStars}><StarRow rating={review.rating} size={14} /></div>
                                    </div>

                                    {review.order_items?.length > 0 && (
                                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
                                            {review.order_items.slice(0, 3).map((item) => (
                                                <span key={`${review.id}-${item.name}`} style={{ background: '#FEF2F2', color: '#B42318', borderRadius: '999px', padding: '0.28rem 0.7rem', fontSize: '0.72rem', fontWeight: 600 }}>
                                                    {item.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <p className={styles.reviewText}>{review.review}</p>

                                    {review.photos?.length > 0 && (
                                        <div className={styles.reviewImages}>
                                            {review.photos.map((photo, index) => (
                                                <img key={photo + index} src={photo} alt="Review Photo" className={styles.reviewImg} />
                                            ))}
                                        </div>
                                    )}

                                    {review.owner_reply && (
                                        <div style={{ marginTop: '0.9rem', padding: '0.9rem 1rem', borderRadius: '14px', background: '#FFF7ED', border: '1px solid #FED7AA' }}>
                                            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#9A3412', marginBottom: '0.3rem' }}>Response from {storeName}</div>
                                            <div style={{ fontSize: '0.88rem', color: '#7C2D12', lineHeight: 1.6 }}>{review.owner_reply}</div>
                                        </div>
                                    )}

                                    <button className={styles.helpfulBtn} onClick={() => handleHelpful(review.id)} disabled={helpfulBusyId === review.id}>
                                        <ThumbsUp size={14} /> Helpful ({review.helpful_count || 0})
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {isReviewModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.reviewModal}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Write a Review</h3>
                            <button className={styles.closeModalBtn} onClick={() => resetReviewForm(true)}><X size={20} /></button>
                        </div>
                        <p className={styles.modalSubtitle}>For <strong>{storeName}</strong></p>
                        <div className={styles.verifiedOrderBadge}>
                            <CheckCircle2 size={12} />
                            {selectedOrder ? `Verified Order • ${selectedOrder.order_number}` : 'Verified Order Required'}
                        </div>

                        <div className={styles.modalBody}>
                            {reviewModalError && (
                                <div style={{ marginBottom: '1rem', background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', padding: '0.8rem 1rem', borderRadius: '12px', fontSize: '0.88rem' }}>
                                    {reviewModalError}
                                </div>
                            )}

                            {reviewableOrders.length > 1 && (
                                <div className={styles.formGroup}>
                                    <label>Select Delivered Order</label>
                                    <select className={styles.reviewTextarea} style={{ minHeight: 'unset', height: '48px', paddingTop: '0.8rem' }} value={selectedReviewOrderId} onChange={(e) => setSelectedReviewOrderId(e.target.value)}>
                                        {reviewableOrders.map((order) => (
                                            <option key={order.id} value={order.id}>{order.order_number}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className={styles.formGroup}>
                                <label>Overall Rating</label>
                                <div className={styles.ratingStarsInput}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} size={24} fill={star <= reviewRating ? '#8B1F1C' : 'none'} color={star <= reviewRating ? '#8B1F1C' : '#D1D5DB'} onClick={() => setReviewRating(star)} style={{ cursor: 'pointer' }} />
                                    ))}
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Your Review</label>
                                <textarea className={styles.reviewTextarea} placeholder="Share your experience with the food and delivery..." value={reviewText} onChange={(e) => setReviewText(e.target.value)}></textarea>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Add Photos</label>
                                <label className={styles.photoUploadArea}>
                                    <UploadCloud size={24} color="#888" className="mb-2" />
                                    <span>{reviewPhotos.length >= 3 ? 'Maximum 3 photos added' : 'Add Photos'}</span>
                                    <input type="file" accept="image/*" multiple hidden onChange={handleReviewPhotoChange} disabled={reviewPhotos.length >= 3} />
                                </label>
                                {reviewPhotos.length > 0 && (
                                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.85rem', flexWrap: 'wrap' }}>
                                        {reviewPhotos.map((photo, index) => (
                                            <div key={photo.preview} style={{ position: 'relative' }}>
                                                <img src={photo.preview} alt="Review preview" style={{ width: '74px', height: '74px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #E5E7EB' }} />
                                                <button type="button" onClick={() => removeReviewPhoto(index)} style={{ position: 'absolute', top: '-6px', right: '-6px', width: '22px', height: '22px', borderRadius: '999px', border: 'none', background: '#7F1D1D', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <button className={styles.btnCancel} onClick={() => resetReviewForm(true)}>Cancel</button>
                            <button className={styles.btnSubmit} onClick={submitReview} disabled={reviewSubmitting || !selectedOrder}>
                                {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
