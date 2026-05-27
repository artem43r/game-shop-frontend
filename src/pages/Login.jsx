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
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Вход</h2>
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
                            required
                        />
                    </div>
                    <button style={styles.button} type="submit" disabled={loading}>
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </form>
                <p style={styles.footer}>
                    Нет аккаунта? <Link to="/register" style={styles.footerLink}>Зарегистрироваться</Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 60px)',
        backgroundColor: '#0f0f1a',
    },
    card: {
        backgroundColor: '#1a1a2e',
        padding: '2rem',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '400px',
    },
    title: {
        color: '#fff',
        marginBottom: '1.5rem',
        textAlign: 'center',
    },
    error: {
        backgroundColor: '#e9456020',
        color: '#e94560',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '1rem',
        fontSize: '14px',
    },
    field: {
        marginBottom: '1rem',
    },
    label: {
        display: 'block',
        color: '#aaa',
        marginBottom: '6px',
        fontSize: '14px',
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #333',
        backgroundColor: '#0f0f1a',
        color: '#fff',
        fontSize: '15px',
        boxSizing: 'border-box',
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#e94560',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
        marginTop: '0.5rem',
    },
    footer: {
        color: '#aaa',
        textAlign: 'center',
        marginTop: '1rem',
        fontSize: '14px',
    },
    footerLink: {
        color: '#e94560',
        textDecoration: 'none',
    },
};

export default Login;