import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('error');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const showMessage = (text, type = 'error') => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => setMessage(''), 3000);
    };

    const fetchCart = async () => {
        try {
            const response = await api.get('/cart/');
            setCart(response.data);
        } catch {
            console.error('Ошибка загрузки корзины');
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        try {
            await api.patch(`/cart/items/${itemId}/`, { quantity });
            fetchCart();
        } catch {
            showMessage('Ошибка при изменении количества.');
        }
    };

    const removeItem = async (itemId) => {
        try {
            await api.delete(`/cart/items/${itemId}/`);
            fetchCart();
        } catch {
            showMessage('Ошибка при удалении товара.');
        }
    };

    const createOrder = async () => {
        try {
            await api.post('/orders/');
            showMessage('Заказ успешно оформлен!', 'success');
            setTimeout(() => navigate('/orders'), 1500);
        } catch {
            showMessage('Ошибка при оформлении заказа.');
        }
    };

    if (loading) return <div style={styles.empty}>Загрузка...</div>;

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <h1 style={styles.title}>Корзина</h1>

                {message && (
                    <div style={{
                        ...styles.message,
                        backgroundColor: messageType === 'success' ? '#4caf5015' : '#e9456015',
                        color: messageType === 'success' ? '#4caf50' : '#e94560',
                        borderColor: messageType === 'success' ? '#4caf5040' : '#e9456040',
                    }}>
                        {message}
                    </div>
                )}

                {!cart || cart.items.length === 0 ? (
                    <div style={styles.emptyCart}>
                        <span style={styles.emptyIcon}>🛒</span>
                        <p style={styles.emptyText}>Корзина пуста</p>
                        <p style={styles.emptySubtext}>Добавьте товары из каталога</p>
                    </div>
                ) : (
                    <div style={styles.layout}>
                        <div style={styles.items}>
                            {cart.items.map((item) => (
                                <div key={item.id} style={styles.item}>
                                    <div style={styles.itemInfo}>
                                        <span style={styles.itemCategory}>
                                            {item.product.category_name}
                                        </span>
                                        <div style={styles.itemTitle}>{item.product.title}</div>
                                        <div style={styles.itemPrice}>
                                            {item.product.price} ₽ за штуку
                                        </div>
                                    </div>
                                    <div style={styles.itemControls}>
                                        <button
                                            style={styles.qtyBtn}
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            −
                                        </button>
                                        <span style={styles.qty}>{item.quantity}</span>
                                        <button
                                            style={styles.qtyBtn}
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div style={styles.itemSubtotal}>
                                        {item.subtotal} ₽
                                    </div>
                                    <button
                                        style={styles.removeBtn}
                                        onClick={() => removeItem(item.id)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div style={styles.summary}>
                            <h3 style={styles.summaryTitle}>Итого</h3>
                            <div style={styles.summaryRow}>
                                <span style={styles.summaryLabel}>Товаров</span>
                                <span style={styles.summaryValue}>
                                    {cart.items.reduce((a, b) => a + b.quantity, 0)} шт.
                                </span>
                            </div>
                            <div style={styles.summaryDivider} />
                            <div style={styles.summaryRow}>
                                <span style={styles.summaryLabel}>К оплате</span>
                                <span style={styles.summaryTotal}>{cart.total} ₽</span>
                            </div>
                            <button style={styles.orderBtn} onClick={createOrder}>
                                Оформить заказ
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    page: {
        backgroundColor: '#0d0d0d',
        flex: 1,
    },
    container: {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2.5rem 2rem',
    },
    title: {
        color: '#fff',
        fontSize: '28px',
        fontWeight: '700',
        marginBottom: '2rem',
    },
    message: {
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid',
        marginBottom: '1.5rem',
        fontSize: '14px',
    },
    emptyCart: {
        textAlign: 'center',
        padding: '5rem 0',
    },
    emptyIcon: {
        fontSize: '48px',
        display: 'block',
        marginBottom: '1rem',
    },
    emptyText: {
        color: '#fff',
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '8px',
    },
    emptySubtext: {
        color: '#555',
        fontSize: '14px',
    },
    empty: {
        color: '#555',
        textAlign: 'center',
        marginTop: '4rem',
        fontSize: '16px',
    },
    layout: {
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: '2rem',
        alignItems: 'start',
    },
    items: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    item: {
        backgroundColor: '#111',
        border: '1px solid #1e1e1e',
        borderRadius: '12px',
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
    },
    itemInfo: {
        flex: 1,
    },
    itemCategory: {
        color: '#e94560',
        fontSize: '11px',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        display: 'block',
        marginBottom: '4px',
    },
    itemTitle: {
        color: '#fff',
        fontSize: '16px',
        fontWeight: '600',
        marginBottom: '4px',
    },
    itemPrice: {
        color: '#555',
        fontSize: '13px',
    },
    itemControls: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    qtyBtn: {
        width: '32px',
        height: '32px',
        backgroundColor: '#1e1e1e',
        color: '#fff',
        border: '1px solid #2e2e2e',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    qty: {
        color: '#fff',
        fontSize: '16px',
        minWidth: '24px',
        textAlign: 'center',
        fontWeight: '600',
    },
    itemSubtotal: {
        color: '#fff',
        fontSize: '18px',
        fontWeight: '700',
        minWidth: '90px',
        textAlign: 'right',
    },
    removeBtn: {
        background: 'none',
        border: 'none',
        color: '#444',
        fontSize: '18px',
        cursor: 'pointer',
        padding: '4px',
    },
    summary: {
        backgroundColor: '#111',
        border: '1px solid #1e1e1e',
        borderRadius: '12px',
        padding: '1.5rem',
        position: 'sticky',
        top: '84px',
    },
    summaryTitle: {
        color: '#fff',
        fontSize: '18px',
        fontWeight: '700',
        marginBottom: '1.25rem',
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.75rem',
    },
    summaryLabel: {
        color: '#666',
        fontSize: '14px',
    },
    summaryValue: {
        color: '#fff',
        fontSize: '14px',
    },
    summaryDivider: {
        height: '1px',
        backgroundColor: '#1e1e1e',
        margin: '1rem 0',
    },
    summaryTotal: {
        color: '#fff',
        fontSize: '24px',
        fontWeight: '700',
    },
    orderBtn: {
        width: '100%',
        padding: '13px',
        backgroundColor: '#e94560',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '1.25rem',
    },
};

export default Cart;