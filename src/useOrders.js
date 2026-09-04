import { useEffect, useState } from 'react';
import { supabase } from './supabase.js';

export async function createOrder({ customer, items, paymentMethod, subtotalHT, tva, deliveryFee, total }) {
  const { data, error } = await supabase.rpc('create_order', {
    customer,
    items,
    payment_method: paymentMethod,
    subtotal_ht: subtotalHT,
    tva,
    delivery_fee: deliveryFee,
    total
  });
  if (error) throw error;
  return data;
}

export function useOrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const { data, error: err } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (cancelled) return;
      if (err) setError(err); else setOrders(data);
      setLoading(false);
    };

    load();
    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, load)
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  return { orders, loading, error };
}

export function useOrderLookup() {
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('idle');

  const lookup = async (orderId) => {
    setStatus('loading');
    try {
      const { data, error } = await supabase.rpc('get_order_by_id', { order_id: orderId.trim() });
      if (error) throw error;
      if (!data || data.length === 0) {
        setOrder(null);
        setStatus('not-found');
        return;
      }
      setOrder(data[0]);
      setStatus('found');
    } catch {
      setOrder(null);
      setStatus('not-found');
    }
  };

  return { order, status, lookup };
}

export function updateOrderStatus(orderId, status) {
  return supabase.from('orders').update({ status }).eq('id', orderId);
}
