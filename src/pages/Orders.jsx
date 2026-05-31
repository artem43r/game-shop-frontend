import { useState, useEffect } from 'react';
import api from '../services/api';

const statusLabels = {
    new: 'Новый',
    processing: 'В обработке',
    completed: 'Выполнен',
    cancelled: 'Отменён',
};

const statusColors = {
    new: '#e94560',
    processing: '#f5a623',
    completed: '#4caf50',
    cancelled: '#aaa',
};

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders/');
            setOrders(response.data.results || response.data);
        } catch {
            console.error('Ошибка загрузки заказов');
        } finally {
            setLoading(false);
        }
    };

    const toggleOrder = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    if (loading) return <div style={styles.loading}>Загрузка...</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Мои заказы</h1>

            {orders.length === 0 ? (
                <div style={styles.empty}>У вас пока нет заказов.</div>
            ) : (
                <div style={styles.list}>
                    {orders.map((order) => (
                        <div key={order.id} style={styles.order}>
                            <div
                                style={styles.orderHeader}
                                onClick={() => toggleOrder(order.id)}
                            >
                                <div style={styles.orderLeft}>
                                    <span style={styles.orderId}>Заказ #{order.id}</span>
                                    <span
                                        style={{
                                            ...styles.status,
                                            color: statusColors[order.status],
                                            borderColor: statusColors[order.status],
                                        }}
                                    >
                                        {statusLabels[order.status]}
                                    </span>
                                </div>
                                <div style={styles.orderRight}>
                                    <span style={styles.orderTotal}>{order.total_price} ₽</span>
                                    <span style={styles.orderDate}>
                                        {new Date(order.created_at).toLocaleDateString('ru-RU')}
                                    </span>
                                    <span style={styles.arrow}>
                                        {expandedOrder === order.id ? '▲' : '▼'}
                                    </span>
                                </div>
                            </div>

                            {expandedOrder === order.id && (
                                <div style={styles.orderItems}>
                                    {order.items.map((item) => (
                                        <div key={item.id} style={styles.orderItem}>
                                            <span style={styles.itemName}>
                                                {item.product?.title || 'Товар удалён'}
                                            </span>
                                            <span style={styles.itemQty}>
                                                x{item.quantity}
                                            </span>
                                            <span style={styles.itemPrice}>
                                                {item.price} ₽
                                            </span>
                                            <span style={styles.itemSubtotal}>
                                                {item.subtotal} ₽
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
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
    loading: {
        color: '#aaa',
        textAlign: 'center',
        marginTop: '3rem',
        fontSize: '16px',
    },
    empty: {
        color: '#aaa',
        textAlign: 'center',
        marginTop: '3rem',
        fontSize: '16px',
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    order: {
        backgroundColor: '#1a1a2e',
        borderRadius: '8px',
        overflow: 'hidden',
    },
    orderHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem',
        cursor: 'pointer',
    },
    orderLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    orderId: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '16px',
    },
    status: {
        fontSize: '12px',
        border: '1px solid',
        borderRadius: '4px',
        padding: '2px 8px',
    },
    orderRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
    },
    orderTotal: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '18px',
    },
    orderDate: {
        color: '#aaa',
        fontSize: '14px',
    },
    arrow: {
        color: '#aaa',
        fontSize: '12px',
    },
    orderItems: {
        borderTop: '1px solid #0f0f1a',
        padding: '1rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    orderItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 0',
        borderBottom: '1px solid #ffffff10',
    },
    itemName: {
        color: '#fff',
        flex: 1,
        fontSize: '15px',
    },
    itemQty: {
        color: '#aaa',
        fontSize: '14px',
        minWidth: '40px',
        textAlign: 'center',
    },
    itemPrice: {
        color: '#aaa',
        fontSize: '14px',
        minWidth: '80px',
        textAlign: 'right',
    },
    itemSubtotal: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '15px',
        minWidth: '80px',
        textAlign: 'right',
    },
};

export default Orders;