import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Profile = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        bio: user?.bio || '',
        phone: user?.phone || '',
    });
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);
        try {
            await api.patch('/auth/profile/', formData);
            setMessageType('success');
            setMessage('Профиль успешно обновлён!');
        } catch {
            setMessageType('error');
            setMessage('Ошибка при обновлении профиля.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.profileHeader}>
                    <div style={styles.avatarCircle}>
                        {user?.username?.[0]?.toUpperCase()}
                    </div>
                    <div>
                        <h1 style={styles.username}>@{user?.username}</h1>
                        <p style={styles.email}>{user?.email}</p>
                    </div>
                </div>

                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>Личные данные</h2>

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
                                    placeholder="Иван"
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
                                    placeholder="Иванов"
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
                                placeholder="+7 999 000 00 00"
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>О себе</label>
                            <textarea
                                style={{ ...styles.input, height: '100px', resize: 'vertical' }}
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Расскажите о себе..."
                            />
                        </div>
                        <button style={styles.button} type="submit" disabled={loading}>
                            {loading ? 'Сохранение...' : 'Сохранить изменения'}
                        </button>
                    </form>
                </div>
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
        maxWidth: '720px',
        margin: '0 auto',
        padding: '2.5rem 2rem',
    },
    profileHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        marginBottom: '2rem',
    },
    avatarCircle: {
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        backgroundColor: '#e94560',
        color: '#fff',
        fontSize: '28px',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    username: {
        color: '#fff',
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '4px',
    },
    email: {
        color: '#555',
        fontSize: '14px',
    },
    card: {
        backgroundColor: '#111',
        border: '1px solid #1e1e1e',
        borderRadius: '16px',
        padding: '2rem',
    },
    cardTitle: {
        color: '#fff',
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '1.5rem',
    },
    message: {
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid',
        marginBottom: '1.5rem',
        fontSize: '14px',
    },
    row: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
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
};

export default Profile;