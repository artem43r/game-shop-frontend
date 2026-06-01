import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(formData.username, formData.password);
            navigate('/');
        } catch {
            setError('Неверный логин или пароль.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <span style={styles.icon}>🎮</span>
                    <h2 style={styles.title}>Вход в аккаунт</h2>
                    <p style={styles.subtitle}>Введите данные для входа</p>
                </div>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.field}>
                        <label style={styles.label}>Имя пользователя</label>
                        <input
                            style={styles.input}
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="username"
                            required
                        />
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Пароль</label>
                        <input
                            style={styles.input}
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button style={styles.button} type="submit" disabled={loading}>
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </form>

                <p style={styles.footer}>
                    Нет аккаунта?{' '}
                    <Link to="/register" style={styles.footerLink}>
                        Зарегистрироваться
                    </Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    page: {
        backgroundColor: '#0d0d0d',
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
    },
    card: {
        backgroundColor: '#111',
        border: '1px solid #1e1e1e',
        borderRadius: '16px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '420px',
    },
    cardHeader: {
        textAlign: 'center',
        marginBottom: '2rem',
    },
    icon: {
        fontSize: '36px',
        display: 'block',
        marginBottom: '12px',
    },
    title: {
        color: '#fff',
        fontSize: '22px',
        fontWeight: '700',
        marginBottom: '6px',
    },
    subtitle: {
        color: '#555',
        fontSize: '14px',
    },
    error: {
        backgroundColor: '#e9456015',
        border: '1px solid #e9456040',
        color: '#e94560',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '1.25rem',
        fontSize: '14px',
    },
    field: {
        marginBottom: '1.25rem',
    },
    label: {
        display: 'block',
        color: '#888',
        marginBottom: '8px',
        fontSize: '13px',
        fontWeight: '500',
    },
    input: {
        width: '100%',
        padding: '12px 14px',
        borderRadius: '8px',
        border: '1px solid #222',
        backgroundColor: '#0d0d0d',
        color: '#fff',
        fontSize: '15px',
        boxSizing: 'border-box',
        outline: 'none',
    },
    button: {
        width: '100%',
        padding: '13px',
        backgroundColor: '#e94560',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '0.5rem',
    },
    footer: {
        color: '#555',
        textAlign: 'center',
        marginTop: '1.5rem',
        fontSize: '14px',
    },
    footerLink: {
        color: '#e94560',
        textDecoration: 'none',
        fontWeight: '500',
    },
};

export default Login;