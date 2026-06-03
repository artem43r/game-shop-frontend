export const validatePhone = (phone) => {
    if (!phone) return true;
    if (!/^[\d\s+()-]+$/.test(phone)) return false;
    const digits = phone.replace(/\D/g, '');
    const normalized = digits.startsWith('8') ? '7' + digits.slice(1) : digits;
    return normalized.length === 11 && normalized.startsWith('7');
};

export const validateEmail = (email) => {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateName = (name) => {
    if (!name) return true;
    return !/\d/.test(name);
};