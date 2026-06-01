const Footer = () => {
    return (
        <footer style={styles.footer}>
            <div style={styles.inner}>
                <div style={styles.brand}>
                    <span style={styles.brandIcon}>🎮</span>
                    <span style={styles.brandText}>Game Shop</span>
                </div>
                <p style={styles.copy}>
                    © 2026 Game Shop. Курсовой проект по дисциплине ТРПО.
                </p>
                <div style={styles.links}>
                    <span style={styles.link}>Магазин игровой валюты</span>
                    <span style={styles.dot}>·</span>
                    <span style={styles.link}>Django REST + React</span>
                    <span style={styles.dot}>·</span>
                    <span style={styles.link}>JWT Auth</span>
                </div>
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        backgroundColor: '#111',
        borderTop: '1px solid #1e1e1e',
        marginTop: 'auto',
    },
    inner: {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
    },
    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    brandIcon: {
        fontSize: '20px',
    },
    brandText: {
        color: '#fff',
        fontSize: '16px',
        fontWeight: '700',
    },
    copy: {
        color: '#444',
        fontSize: '13px',
    },
    links: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    link: {
        color: '#333',
        fontSize: '12px',
    },
    dot: {
        color: '#333',
        fontSize: '12px',
    },
};

export default Footer;