import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Profile = () => {
    const { user, login } = useAuth();
    const [formData, setFormData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        bio: user?.bio || '',
        phone: user?.phone || '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);
        try {
            await api.patch('/auth/profile/', formData);
            setMessage('Профиль успешно обновлён!');
        } catch {
            setError('Ошибка при обновлении профиля.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Профиль</h2>
                <div style={styles.username}>@{user?.username}</div>

                {message && <div style={styles.success}>{message}</div>}
                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.row}>
                        <div style={styles.field}>
                            <label style={styles.label}>Имя</label>
                            <input
                                style={styles.input}
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Фамилия</label>
                            <input
                                style={styles.input}
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Email</label>
                        <input
                            style={styles.input}
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Телефон</label>
                        <input
                            style={styles.input}
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>О себе</label>
                        <textarea
                            style={{ ...styles.input, height: '100px', resize: 'vertical' }}
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                        />
                    </div>
                    <button style={styles.button} type="submit" disabled={loading}>
                        {loading ? 'Сохранение...' : 'Сохранить изменения'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        padding: '2rem',
        backgroundColor: '#0f0f1a',
        minHeight: 'calc(100vh - 60px)',
    },
    card: {
        backgroundColor: '#1a1a2e',
        padding: '2rem',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '600px',
    },
    title: {
        color: '#fff',
        marginBottom: '0.5rem',
    },
    username: {
        color: '#e94560',
        fontSize: '14px',
        marginBottom: '1.5rem',
    },
    success: {
        backgroundColor: '#4caf5020',
        color: '#4caf50',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '1rem',
        fontSize: '14px',
    },
    error: {
        backgroundColor: '#e9456020',
        color: '#e94560',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '1rem',
        fontSize: '14px',
    },
    row: {
        display: 'flex',
        gap: '1rem',
    },
    field: {
        flex: 1,
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
};

export default Profile;