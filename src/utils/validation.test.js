import { validatePhone, validateEmail, validateName } from './validation';

describe('validatePhone', () => {
    test('принимает корректный номер с +7', () => {
        expect(validatePhone('+7 999 000 00 00')).toBe(true);
    });

    test('принимает корректный номер с 8', () => {
        expect(validatePhone('8 999 000 00 00')).toBe(true);
    });

    test('отклоняет номер с буквами', () => {
        expect(validatePhone('+7 999 abc 00 00')).toBe(false);
    });

    test('отклоняет слишком короткий номер', () => {
        expect(validatePhone('12345')).toBe(false);
    });

    test('пустой номер допустим', () => {
        expect(validatePhone('')).toBe(true);
    });
});

describe('validateEmail', () => {
    test('принимает корректный email', () => {
        expect(validateEmail('test@mail.ru')).toBe(true);
    });

    test('отклоняет email без @', () => {
        expect(validateEmail('testmail.ru')).toBe(false);
    });

    test('отклоняет email без домена', () => {
        expect(validateEmail('test@')).toBe(false);
    });

    test('отклоняет пустой email', () => {
        expect(validateEmail('')).toBe(false);
    });
});

describe('validateName', () => {
    test('принимает имя без цифр', () => {
        expect(validateName('Иван')).toBe(true);
    });

    test('отклоняет имя с цифрами', () => {
        expect(validateName('Иван123')).toBe(false);
    });

    test('пустое имя допустимо', () => {
        expect(validateName('')).toBe(true);
    });
});