import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [generalError, setGeneralError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (fieldErrors[name]) {
            setFieldErrors({ ...fieldErrors, [name]: '' });
        }
    };

    const validate = () => {
        const errors = {};
        if (formData.username.length < 3) {
            errors.username = 'Имя пользователя должно содержать минимум 3 символа';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Введите корректный email адрес';
        }
        if (formData.password.length < 8) {
            errors.password = 'Пароль должен содержать минимум 8 символов';
        }
        if (formData.password !== formData.password2) {
            errors.password2 = 'Пароли не совпадают';
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError('');

        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        setLoading(true);
        try {
            await register(formData.username, formData.email, formData.password, formData.password2);
            navigate('/login');
        } catch (err) {
            const data = err.response?.data;
            if (data && typeof data === 'object') {
                const serverErrors = {};
                const general = [];
                Object.entries(data).forEach(([key, val]) => {
                    const msg = Array.isArray(val) ? val.join(' ') : val;
                    if (['username', 'email', 'password', 'password2'].includes(key)) {
                        serverErrors[key] = msg;
                    } else {
                        general.push(msg);
                    }
                });
                setFieldErrors(serverErrors);
                if (general.length > 0) {
                    setGeneralError(general.join(' '));
                }
            } else {
                setGeneralError('Ошибка регистрации. Попробуйте снова.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <span style={styles.icon}>🎮</span>
                    <h2 style={styles.title}>Создать аккаунт</h2>
                    <p style={styles.subtitle}>Заполните форму для регистрации</p>
                </div>

                {generalError && <div style={styles.error}>{generalError}</div>}

                <form onSubmit={handleSubmit} noValidate>
                    <div style={styles.field}>
                        <label style={styles.label}>Имя пользователя</label>
                        <input
                            style={{ ...styles.input, ...(fieldErrors.username ? styles.inputError : {}) }}
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="username"
                        />
                        {fieldErrors.username && (
                            <span style={styles.fieldError}>{fieldErrors.username}</span>
                        )}
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Email</label>
                        <input
                            style={{ ...styles.input, ...(fieldErrors.email ? styles.inputError : {}) }}
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="example@mail.ru"
                        />
                        {fieldErrors.email && (
                            <span style={styles.fieldError}>{fieldErrors.email}</span>
                        )}
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Пароль</label>
                        <input
                            style={{ ...styles.input, ...(fieldErrors.password ? styles.inputError : {}) }}
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                        />
                        {fieldErrors.password && (
                            <span style={styles.fieldError}>{fieldErrors.password}</span>
                        )}
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Подтверждение пароля</label>
                        <input
                            style={{ ...styles.input, ...(fieldErrors.password2 ? styles.inputError : {}) }}
                            type="password"
                            name="password2"
                            value={formData.password2}
                            onChange={handleChange}
                            placeholder="••••••••"
                        />
                        {fieldErrors.password2 && (
                            <span style={styles.fieldError}>{fieldErrors.password2}</span>
                        )}
                    </div>
                    <button style={styles.button} type="submit" disabled={loading}>
                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </form>

                <p style={styles.footer}>
                    Уже есть аккаунт?{' '}
                    <Link to="/login" style={styles.footerLink}>
                        Войти
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
    inputError: {
        borderColor: '#e94560',
    },
    fieldError: {
        display: 'block',
        color: '#e94560',
        fontSize: '12px',
        marginTop: '5px',
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

export default Register;