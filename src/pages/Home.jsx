import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('error');

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, search]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories/');
            setCategories(response.data.results || response.data);
        } catch {
            console.error('Ошибка загрузки категорий');
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = {};
            if (selectedCategory) params.category = selectedCategory;
            if (search) params.search = search;
            const response = await api.get('/products/', { params });
            setProducts(response.data.results || response.data);
        } catch {
            console.error('Ошибка загрузки товаров');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (text, type = 'error') => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => setMessage(''), 3000);
    };

    const addToCart = async (productId) => {
        if (!user) {
            showMessage('Войдите в аккаунт чтобы добавить товар в корзину.');
            return;
        }
        try {
            await api.post('/cart/', { product_id: productId, quantity: 1 });
            showMessage('Товар добавлен в корзину!', 'success');
        } catch {
            showMessage('Ошибка при добавлении в корзину.');
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>

                <div style={styles.header}>
                    <h1 style={styles.title}>Игровая валюта</h1>
                    <p style={styles.subtitle}>Пополняй баланс в любимых играх быстро и выгодно</p>
                </div>

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

                <div style={styles.filters}>
                    <input
                        style={styles.search}
                        type="text"
                        placeholder="🔍  Поиск товаров..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div style={styles.categoryList}>
                        <button
                            style={{
                                ...styles.categoryBtn,
                                ...(selectedCategory === '' ? styles.categoryBtnActive : {}),
                            }}
                            onClick={() => setSelectedCategory('')}
                        >
                            Все
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                style={{
                                    ...styles.categoryBtn,
                                    ...(selectedCategory === String(cat.id) ? styles.categoryBtnActive : {}),
                                }}
                                onClick={() => setSelectedCategory(String(cat.id))}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div style={styles.empty}>Загрузка...</div>
                ) : products.length === 0 ? (
                    <div style={styles.empty}>Товары не найдены.</div>
                ) : (
                    <div style={styles.grid}>
                        {products.map((product) => (
                            <div key={product.id} style={styles.card}>
                                <div style={styles.cardTop}>
                                    <span style={styles.categoryTag}>{product.category_name}</span>
                                    <span style={styles.currencyBadge}>💰 {product.currency_amount}</span>
                                </div>
                                <h3 style={styles.productTitle}>{product.title}</h3>
                                <div style={styles.cardBottom}>
                                    <span style={styles.price}>{product.price} ₽</span>
                                    <button
                                        style={styles.addBtn}
                                        onClick={() => addToCart(product.id)}
                                    >
                                        В корзину
                                    </button>
                                </div>
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
    header: {
        marginBottom: '2rem',
    },
    title: {
        fontSize: '32px',
        fontWeight: '700',
        color: '#fff',
        marginBottom: '8px',
    },
    subtitle: {
        color: '#666',
        fontSize: '16px',
    },
    message: {
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid',
        marginBottom: '1.5rem',
        fontSize: '14px',
    },
    filters: {
        marginBottom: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    search: {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid #222',
        backgroundColor: '#111',
        color: '#fff',
        fontSize: '15px',
        outline: 'none',
        boxSizing: 'border-box',
    },
    categoryList: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
    },
    categoryBtn: {
        padding: '7px 16px',
        borderRadius: '20px',
        border: '1px solid #222',
        backgroundColor: 'transparent',
        color: '#888',
        fontSize: '13px',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    categoryBtnActive: {
        backgroundColor: '#e94560',
        borderColor: '#e94560',
        color: '#fff',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem',
    },
    card: {
        backgroundColor: '#111',
        border: '1px solid #1e1e1e',
        borderRadius: '12px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        transition: 'border-color 0.2s',
    },
    cardTop: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryTag: {
        color: '#e94560',
        fontSize: '12px',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    currencyBadge: {
        backgroundColor: '#1e1e1e',
        color: '#888',
        fontSize: '12px',
        padding: '3px 10px',
        borderRadius: '20px',
    },
    productTitle: {
        color: '#fff',
        fontSize: '17px',
        fontWeight: '600',
        flex: 1,
    },
    cardBottom: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto',
    },
    price: {
        color: '#fff',
        fontSize: '22px',
        fontWeight: '700',
    },
    addBtn: {
        backgroundColor: '#e94560',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '9px 18px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
    },
    empty: {
        color: '#555',
        textAlign: 'center',
        marginTop: '4rem',
        fontSize: '16px',
    },
};

export default Home;