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
    cancelled: '#555',
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

    if (loading) return <div style={styles.empty}>Загрузка...</div>;

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <h1 style={styles.title}>Мои заказы</h1>

                {orders.length === 0 ? (
                    <div style={styles.emptyOrders}>
                        <span style={styles.emptyIcon}>📦</span>
                        <p style={styles.emptyText}>Заказов пока нет</p>
                        <p style={styles.emptySubtext}>Оформите первый заказ в каталоге</p>
                    </div>
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
                                        <span style={{
                                            ...styles.statusBadge,
                                            backgroundColor: statusColors[order.status] + '20',
                                            color: statusColors[order.status],
                                            borderColor: statusColors[order.status] + '50',
                                        }}>
                                            {statusLabels[order.status]}
                                        </span>
                                    </div>
                                    <div style={styles.orderRight}>
                                        <span style={styles.orderDate}>
                                            {new Date(order.created_at).toLocaleDateString('ru-RU')}
                                        </span>
                                        <span style={styles.orderTotal}>
                                            {order.total_price} ₽
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
                                                <span style={styles.itemQty}>x{item.quantity}</span>
                                                <span style={styles.itemPrice}>{item.price} ₽</span>
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
        </div>
    );
};

const styles = {
    page: {
        backgroundColor: '#0d0d0d',
        minHeight: 'calc(100vh - 64px)',
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
    empty: {
        color: '#555',
        textAlign: 'center',
        marginTop: '4rem',
        fontSize: '16px',
    },
    emptyOrders: {
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
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    order: {
        backgroundColor: '#111',
        border: '1px solid #1e1e1e',
        borderRadius: '12px',
        overflow: 'hidden',
    },
    orderHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 1.5rem',
        cursor: 'pointer',
    },
    orderLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    orderId: {
        color: '#fff',
        fontWeight: '700',
        fontSize: '16px',
    },
    statusBadge: {
        fontSize: '12px',
        fontWeight: '500',
        border: '1px solid',
        borderRadius: '20px',
        padding: '3px 10px',
    },
    orderRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
    },
    orderDate: {
        color: '#555',
        fontSize: '13px',
    },
    orderTotal: {
        color: '#fff',
        fontWeight: '700',
        fontSize: '18px',
    },
    arrow: {
        color: '#444',
        fontSize: '11px',
    },
    orderItems: {
        borderTop: '1px solid #1e1e1e',
        padding: '1rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    orderItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 0',
        borderBottom: '1px solid #1a1a1a',
    },
    itemName: {
        color: '#fff',
        flex: 1,
        fontSize: '14px',
    },
    itemQty: {
        color: '#555',
        fontSize: '13px',
        minWidth: '40px',
        textAlign: 'center',
    },
    itemPrice: {
        color: '#555',
        fontSize: '13px',
        minWidth: '80px',
        textAlign: 'right',
    },
    itemSubtotal: {
        color: '#fff',
        fontWeight: '600',
        fontSize: '15px',
        minWidth: '80px',
        textAlign: 'right',
    },
};

export default Orders;