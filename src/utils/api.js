/**
 * Утилиты для работы с API
 */

/**
 * Получает базовый URL для API запросов
 * В development используется относительный путь (прокси)
 * В production используется полный URL к API домену
 */
export const getApiBaseUrl = () => {
  // В development mode используем прокси
  if (import.meta.env.DEV) {
    return '';
  }

  // В production используем API домен
  return import.meta.env.VITE_API_BASE_URL || '';
};

/**
 * Создает полный URL для API endpoint
 * @param {string} endpoint - API endpoint (например, '/api/reviews')
 * @returns {string} - Полный URL
 */
export const createApiUrl = (endpoint) => {
  const baseUrl = getApiBaseUrl();
  return `${baseUrl}${endpoint}`;
};

/**
 * Выполняет fetch запрос к API с правильным базовым URL
 * @param {string} endpoint - API endpoint
 * @param {RequestInit} options - Опции fetch
 * @returns {Promise<Response>} - Promise с ответом
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = createApiUrl(endpoint);

  // Добавляем дефолтные headers
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const fetchOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  return fetch(url, fetchOptions);
};