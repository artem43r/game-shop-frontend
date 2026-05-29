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

    const addToCart = async (productId) => {
        if (!user) {
            setMessage('Войдите в аккаунт чтобы добавить товар в корзину.');
            setTimeout(() => setMessage(''), 3000);
            return;
        }
        try {
            await api.post('/cart/', { product_id: productId, quantity: 1 });
            setMessage('Товар добавлен в корзину!');
            setTimeout(() => setMessage(''), 3000);
        } catch {
            setMessage('Ошибка при добавлении в корзину.');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Игровая валюта</h1>

            {message && <div style={styles.message}>{message}</div>}

            <div style={styles.filters}>
                <input
                    style={styles.search}
                    type="text"
                    placeholder="Поиск товаров..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    style={styles.select}
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">Все категории</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div style={styles.loading}>Загрузка...</div>
            ) : products.length === 0 ? (
                <div style={styles.loading}>Товары не найдены.</div>
            ) : (
                <div style={styles.grid}>
                    {products.map((product) => (
                        <div key={product.id} style={styles.card}>
                            <div style={styles.category}>{product.category_name}</div>
                            <h3 style={styles.productTitle}>{product.title}</h3>
                            <div style={styles.currency}>
                                💰 {product.currency_amount} валюты
                            </div>
                            <div style={styles.price}>{product.price} ₽</div>
                            <button
                                style={styles.button}
                                onClick={() => addToCart(product.id)}
                            >
                                В корзину
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
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
    filters: {
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
    },
    search: {
        flex: 1,
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #333',
        backgroundColor: '#1a1a2e',
        color: '#fff',
        fontSize: '15px',
    },
    select: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #333',
        backgroundColor: '#1a1a2e',
        color: '#fff',
        fontSize: '15px',
        minWidth: '180px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1.5rem',
    },
    card: {
        backgroundColor: '#1a1a2e',
        borderRadius: '8px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    category: {
        color: '#e94560',
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    productTitle: {
        color: '#fff',
        margin: 0,
        fontSize: '16px',
    },
    currency: {
        color: '#aaa',
        fontSize: '14px',
    },
    price: {
        color: '#fff',
        fontSize: '22px',
        fontWeight: 'bold',
    },
    button: {
        padding: '10px',
        backgroundColor: '#e94560',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '15px',
        cursor: 'pointer',
        marginTop: 'auto',
    },
    loading: {
        color: '#aaa',
        textAlign: 'center',
        marginTop: '3rem',
        fontSize: '16px',
    },
};

export default Home;