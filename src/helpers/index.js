// =================
// HELPERS - Утилитарные функции для проекта ритуальной службы "Век"
// =================

// ФОРМАТИРОВАНИЕ ТЕЛЕФОНОВ
// =================

/**
 * Форматирует номер телефона для отображения
 * @param {string} phone - Номер телефона
 * @returns {string} - Отформатированный номер
 */
export const formatPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 11 && cleaned.startsWith("7")) {
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(
      7,
      9
    )}-${cleaned.slice(9, 11)}`;
  }

  return phone;
};

/**
 * Создает ссылку tel: для номера телефона
 * @param {string} phone - Номер телефона
 * @returns {string} - Ссылка для tel:
 */
export const createTelLink = (phone) => {
  const cleaned = phone.replace(/\D/g, "");
  return `tel:+${cleaned}`;
};

// РАБОТА С ФОРМАМИ
// =================

/**
 * Валидирует номер телефона
 * @param {string} phone - Номер телефона
 * @returns {boolean} - Результат валидации
 */
export const validatePhone = (phone) => {
  const phoneRegex =
    /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
  return phoneRegex.test(phone);
};

/**
 * Валидирует email
 * @param {string} email - Email адрес
 * @returns {boolean} - Результат валидации
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Валидирует имя (только буквы и дефис)
 * @param {string} name - Имя
 * @returns {boolean} - Результат валидации
 */
export const validateName = (name) => {
  const nameRegex = /^[а-яёА-ЯЁa-zA-Z\s\-]+$/;
  return nameRegex.test(name) && name.trim().length >= 2;
};

// РАБОТА С URL И НАВИГАЦИЕЙ
// =================

/**
 * Создает slug из строки (для URL)
 * @param {string} text - Исходный текст
 * @returns {string} - URL-friendly строка
 */
export const createSlug = (text) => {
  const translitMap = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "e",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "kh",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "shch",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
  };

  return text
    .toLowerCase()
    .split("")
    .map((char) => translitMap[char] || char)
    .join("")
    .replace(/[^a-z0-9\-\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim("-");
};

/**
 * Проверяет, является ли ссылка внешней
 * @param {string} url - URL для проверки
 * @returns {boolean} - true если внешняя ссылка
 */
export const isExternalLink = (url) => {
  return url.startsWith("http") || url.startsWith("//");
};

// РАБОТА С ДАТАМИ И ВРЕМЕНЕМ
// =================

/**
 * Форматирует дату для отображения
 * @param {Date|string} date - Дата
 * @returns {string} - Отформатированная дата
 */
export const formatDate = (date) => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Проверяет рабочее время (8:00-17:00)
 * @returns {boolean} - true если рабочее время
 */
export const isWorkingHours = () => {
  const now = new Date();
  const hours = now.getHours();
  return hours >= 8 && hours < 17;
};

/**
 * Получает приветствие в зависимости от времени суток
 * @returns {string} - Приветствие
 */
export const getTimeGreeting = () => {
  const hours = new Date().getHours();

  if (hours >= 6 && hours < 12) return "Доброе утро";
  if (hours >= 12 && hours < 18) return "Добрый день";
  if (hours >= 18 && hours < 24) return "Добрый вечер";
  return "Доброй ночи";
};

// РАБОТА С ЦЕНАМИ И ЧИСЛАМИ
// =================

/**
 * Форматирует цену в рублях
 * @param {number} price - Цена
 * @returns {string} - Отформатированная цена
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
  }).format(price);
};

/**
 * Форматирует большие числа (1000 -> 1к)
 * @param {number} num - Число
 * @returns {string} - Сокращенное число
 */
export const formatLargeNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(".0", "") + "М";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(".0", "") + "к";
  }
  return num.toString();
};

// РАБОТА С DOM И СОБЫТИЯМИ
// =================

/**
 * Плавная прокрутка к элементу
 * @param {string} selector - CSS селектор
 * @param {number} offset - Отступ сверху
 */
export const smoothScrollTo = (selector, offset = 0) => {
  const element = document.querySelector(selector);
  if (!element) return;

  const targetPosition =
    element.getBoundingClientRect().top + window.pageYOffset - offset;

  window.scrollTo({
    top: targetPosition,
    behavior: "smooth",
  });
};

/**
 * Debounce функция для оптимизации событий
 * @param {Function} func - Функция для вызова
 * @param {number} wait - Задержка в мс
 * @returns {Function} - Debounced функция
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle функция для оптимизации событий
 * @param {Function} func - Функция для вызова
 * @param {number} limit - Лимит в мс
 * @returns {Function} - Throttled функция
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// РАБОТА С ЛОКАЛЬНЫМ ХРАНИЛИЩЕМ
// =================

/**
 * Сохраняет данные в localStorage
 * @param {string} key - Ключ
 * @param {any} value - Значение
 */
export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Не удалось сохранить в localStorage:", error);
  }
};

/**
 * Получает данные из localStorage
 * @param {string} key - Ключ
 * @param {any} defaultValue - Значение по умолчанию
 * @returns {any} - Сохраненные данные или значение по умолчанию
 */
export const getLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn("Не удалось прочитать из localStorage:", error);
    return defaultValue;
  }
};

/**
 * Удаляет данные из localStorage
 * @param {string} key - Ключ
 */
export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn("Не удалось удалить из localStorage:", error);
  }
};

// УТИЛИТЫ ДЛЯ РАЗРАБОТКИ
// =================

/**
 * Логирует данные только в режиме разработки
 * @param {...any} args - Аргументы для логирования
 */
export const devLog = (...args) => {
  if (import.meta.env.MODE === "development") {
    console.log(...args);
  }
};

/**
 * Генерирует уникальный ID
 * @returns {string} - Уникальный ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// КОНСТАНТЫ ПРОЕКТА
// =================

const COMPANY_INFO = {
  name: "Ритуальная служба Век",
  nameOfficial: "ИП Шадрина Лариса Геннадьевна",
  phone: "+7 (920) 366-36-36",
  city: "г. Шуя",
  region: "Ивановская область",
  legalName: 'Ритуальная служба "Век"',
  inn: "370601474199",
  ogrn: "324370000006824",
  privacyUrl: "/privacy",
  workSchedule: "Пн-Вс, с 8:00 до 17:00",
  phoneSchedule: "Круглосуточно",
  offices: [
    {
      id: 1,
      address: "Ул. Красноармейский переулок, 6",
      description: "2 минуты от ЦРБ",
      schedule: "Пн-Вс, с 8:00 до 17:00",
    },
    {
      id: 2,
      address: "Ул. Фабричная, 27",
      description: "ритуальный зал",
      schedule: "Пн-Вс, с 8:00 до 17:00",
    },
    {
      id: 3,
      address: "Ул. Генерала Белова, 33",
      description: "",
      schedule: "Пн-Вс, с 8:00 до 17:00",
    },
  ],
};

export { COMPANY_INFO };
