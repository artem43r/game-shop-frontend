import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.inner}>
                <Link to="/" style={styles.brand}>
                    <span style={styles.brandIcon}>🎮</span>
                    <span style={styles.brandText}>Game Shop</span>
                </Link>

                <div style={styles.links}>
                    <Link to="/" style={styles.link}>Магазин</Link>
                    {user ? (
                        <>
                            <Link to="/cart" style={styles.link}>Корзина</Link>
                            <Link to="/orders" style={styles.link}>Заказы</Link>
                            <Link to="/profile" style={styles.link}>
                                <span style={styles.avatar}>
                                    {user.username[0].toUpperCase()}
                                </span>
                                {user.username}
                            </Link>
                            <button onClick={handleLogout} style={styles.logoutBtn}>
                                Выйти
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={styles.link}>Войти</Link>
                            <Link to="/register" style={styles.registerBtn}>
                                Регистрация
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        width: '100%',
        backgroundColor: '#111111',
        borderBottom: '1px solid #222',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    inner: {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none',
    },
    brandIcon: {
        fontSize: '24px',
    },
    brandText: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#fff',
        letterSpacing: '-0.5px',
    },
    links: {
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
    },
    link: {
        color: '#aaa',
        textDecoration: 'none',
        fontSize: '15px',
        fontWeight: '400',
        transition: 'color 0.2s',
    },
    avatar: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        backgroundColor: '#e94560',
        color: '#fff',
        fontSize: '13px',
        fontWeight: '600',
        marginRight: '6px',
    },
    logoutBtn: {
        background: 'none',
        border: '1px solid #333',
        color: '#aaa',
        padding: '7px 16px',
        borderRadius: '6px',
        fontSize: '14px',
        cursor: 'pointer',
    },
    registerBtn: {
        backgroundColor: '#e94560',
        color: '#fff',
        padding: '8px 18px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '500',
        textDecoration: 'none',
    },
};

export default Navbar;