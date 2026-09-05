import { useEffect, useState } from 'react';
import { supabase } from './supabase.js';

export async function submitReview({ productId, customerName, rating, comment }) {
  const { error } = await supabase.rpc('submit_review', {
    product_id: productId,
    customer_name: customerName,
    rating,
    comment
  });
  if (error) throw error;
}

export function useProductReviews(productId) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (cancelled) return;
        setReviews(data || []);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [productId]);

  const count = reviews.length;
  const average = count ? reviews.reduce((a, r) => a + r.rating, 0) / count : 0;

  return { reviews, loading, average, count };
}

export function useAllRatings() {
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('reviews')
      .select('product_id, rating')
      .eq('approved', true)
      .then(({ data }) => {
        if (cancelled || !data) return;
        const byProduct = {};
        for (const r of data) {
          if (!byProduct[r.product_id]) byProduct[r.product_id] = { sum: 0, count: 0 };
          byProduct[r.product_id].sum += r.rating;
          byProduct[r.product_id].count += 1;
        }
        const result = {};
        for (const id in byProduct) {
          result[id] = { average: byProduct[id].sum / byProduct[id].count, count: byProduct[id].count };
        }
        setRatings(result);
      });
    return () => { cancelled = true; };
  }, []);

  return ratings;
}

export function useReviewsModeration() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (cancelled) return;
      setReviews(data || []);
      setLoading(false);
    };

    load();
    const channel = supabase
      .channel('reviews-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, load)
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  return { reviews, loading };
}

export function approveReview(id) {
  return supabase.from('reviews').update({ approved: true }).eq('id', id);
}

export function deleteReview(id) {
  return supabase.from('reviews').delete().eq('id', id);
}
