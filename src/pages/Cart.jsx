import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

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
            setMessage('Ошибка при изменении количества.');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const removeItem = async (itemId) => {
        try {
            await api.delete(`/cart/items/${itemId}/`);
            fetchCart();
        } catch {
            setMessage('Ошибка при удалении товара.');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const createOrder = async () => {
        try {
            await api.post('/orders/');
            setMessage('Заказ успешно оформлен!');
            setTimeout(() => {
                navigate('/orders');
            }, 1500);
        } catch {
            setMessage('Ошибка при оформлении заказа.');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    if (loading) return <div style={styles.loading}>Загрузка...</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Корзина</h1>

            {message && <div style={styles.message}>{message}</div>}

            {!cart || cart.items.length === 0 ? (
                <div style={styles.empty}>Корзина пуста.</div>
            ) : (
                <>
                    <div style={styles.items}>
                        {cart.items.map((item) => (
                            <div key={item.id} style={styles.item}>
                                <div style={styles.itemInfo}>
                                    <div style={styles.itemTitle}>{item.product.title}</div>
                                    <div style={styles.itemCategory}>{item.product.category_name}</div>
                                    <div style={styles.itemPrice}>{item.product.price} ₽</div>
                                </div>
                                <div style={styles.itemControls}>
                                    <button
                                        style={styles.qtyButton}
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        −
                                    </button>
                                    <span style={styles.qty}>{item.quantity}</span>
                                    <button
                                        style={styles.qtyButton}
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                                <div style={styles.itemSubtotal}>{item.subtotal} ₽</div>
                                <button
                                    style={styles.removeButton}
                                    onClick={() => removeItem(item.id)}
                                >
                                    Удалить
                                </button>
                            </div>
                        ))}
                    </div>

                    <div style={styles.footer}>
                        <div style={styles.total}>
                            Итого: <span style={styles.totalAmount}>{cart.total} ₽</span>
                        </div>
                        <button style={styles.orderButton} onClick={createOrder}>
                            Оформить заказ
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '2rem',
        backgroundColor: '#0f0f1a',
        minHeight: 'calc(100vh - 60px)',
    },
    title: {
        color: '#fff',
        marginBottom: '1.5rem',
    },
    message: {
        backgroundColor: '#e9456020',
        color: '#e94560',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '1rem',
        fontSize: '14px',
    },
    empty: {
        color: '#aaa',
        textAlign: 'center',
        marginTop: '3rem',
        fontSize: '16px',
    },
    loading: {
        color: '#aaa',
        textAlign: 'center',
        marginTop: '3rem',
        fontSize: '16px',
    },
    items: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    item: {
        backgroundColor: '#1a1a2e',
        borderRadius: '8px',
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
    },
    itemInfo: {
        flex: 1,
    },
    itemTitle: {
        color: '#fff',
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '4px',
    },
    itemCategory: {
        color: '#e94560',
        fontSize: '12px',
        marginBottom: '4px',
    },
    itemPrice: {
        color: '#aaa',
        fontSize: '14px',
    },
    itemControls: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
    },
    qtyButton: {
        width: '30px',
        height: '30px',
        backgroundColor: '#0f0f1a',
        color: '#fff',
        border: '1px solid #333',
        borderRadius: '4px',
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
    },
    itemSubtotal: {
        color: '#fff',
        fontSize: '16px',
        fontWeight: 'bold',
        minWidth: '80px',
        textAlign: 'right',
    },
    removeButton: {
        backgroundColor: 'transparent',
        color: '#e94560',
        border: '1px solid #e94560',
        borderRadius: '4px',
        padding: '6px 12px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: '#1a1a2e',
        borderRadius: '8px',
    },
    total: {
        color: '#aaa',
        fontSize: '18px',
    },
    totalAmount: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '24px',
    },
    orderButton: {
        padding: '12px 2rem',
        backgroundColor: '#e94560',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
    },
};

export default Cart;