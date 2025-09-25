import React, { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import IMask from "imask";
import "./Input.scss";

/**
 * Переиспользуемый компонент Input
 * Поддерживает маски для телефона, валидацию и различные типы ввода
 * 
 * @param {string} type - Тип input (text, tel, email и т.д.)
 * @param {string} value - Значение поля
 * @param {function} onChange - Обработчик изменения значения
 * @param {string} placeholder - Плейсхолдер
 * @param {boolean} required - Обязательное поле
 * @param {string} className - Дополнительные CSS классы
 * @param {string} id - ID элемента
 * @param {boolean} mask - Применять маску телефона (только для type="tel")
 * @param {string} maskPattern - Паттерн маски (по умолчанию российский телефон)
 * @param {function} onMaskComplete - Обработчик завершения ввода маски
 * @param {boolean} numericOnly - Разрешить только цифры для ввода
 * @param {string} inputMode - Тип клавиатуры на мобильных устройствах
 * @param {string} pattern - HTML pattern для валидации
 * @param {string} requiredMessage - Кастомное сообщение для required валидации
 * @param {string} patternMessage - Кастомное сообщение для pattern валидации
 * @param {object} ref - Ref для доступа к элементу
 */
const Input = forwardRef(({
  type = "text",
  value = "",
  onChange,
  placeholder = "",
  required = false,
  className = "",
  id,
  mask = false,
  maskPattern = "+7 (000) 000-00-00",
  onMaskComplete,
  numericOnly = false,
  inputMode,
  pattern,
  requiredMessage = "Это поле обязательно для заполнения",
  patternMessage = "Введите данные в правильном формате",
  ...props
}, ref) => {
  const inputRef = useRef(null);
  const maskRef = useRef(null);

  // Предоставляем доступ к внутреннему ref через forwardRef
  useImperativeHandle(ref, () => inputRef.current);

  // Инициализация маски
  useEffect(() => {
    if (mask && inputRef.current && type === "tel") {
      maskRef.current = IMask(inputRef.current, {
        mask: maskPattern,
        lazy: false,
        placeholderChar: '_'
      });

      // Обработчик завершения ввода маски (когда маска полностью заполнена)
      maskRef.current.on('complete', () => {
        if (onMaskComplete) {
          onMaskComplete(maskRef.current.value);
        }
        // Маска завершена - поле валидно
        inputRef.current.setCustomValidity('');
      });

      // Обработчик изменений маски
      maskRef.current.on('accept', () => {
        if (onChange) {
          onChange(maskRef.current.value);
        }
        // Проверяем только если поле не пустое
        const unmaskedValue = maskRef.current.unmaskedValue;
        if (unmaskedValue.length === 0) {
          // Пустое поле - очищаем валидацию до blur
          inputRef.current.setCustomValidity('');
        } else if (unmaskedValue.length === 10) {
          // Полный номер (10 цифр после +7)
          inputRef.current.setCustomValidity('');
        } else {
          // Неполный номер
          inputRef.current.setCustomValidity('Введите полный номер телефона');
        }
      });

      // Обработчик потери фокуса для обязательных полей
      const handleBlur = () => {
        const unmaskedValue = maskRef.current.unmaskedValue;
        if (required && unmaskedValue.length === 0) {
          inputRef.current.setCustomValidity('Пожалуйста, введите ваш номер телефона');
        }
      };

      inputRef.current.addEventListener('blur', handleBlur);

      // НЕ инициализируем валидацию сразу - дадим пользователю начать ввод

      return () => {
        if (maskRef.current) {
          maskRef.current.destroy();
        }
        if (inputRef.current) {
          inputRef.current.removeEventListener('blur', handleBlur);
        }
      };
    }
  }, [mask, maskPattern, onMaskComplete, onChange, type, required]);

  // Обработчик для ограничения ввода только цифрами
  useEffect(() => {
    if (numericOnly && inputRef.current) {
      const handleKeyDown = (e) => {
        // Разрешаем служебные клавиши
        const allowedKeys = [8, 9, 27, 13, 46, 35, 36, 37, 39];
        if (allowedKeys.includes(e.keyCode) || 
            // Разрешаем Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
            (e.ctrlKey && [65, 67, 86, 88, 90].includes(e.keyCode))) {
          return;
        }
        // Разрешаем цифры с основной клавиатуры (48-57) и numpad (96-105)
        if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
          return;
        }
        // Блокируем все остальное
        e.preventDefault();
      };

      inputRef.current.addEventListener('keydown', handleKeyDown);

      return () => {
        if (inputRef.current) {
          inputRef.current.removeEventListener('keydown', handleKeyDown);
        }
      };
    }
  }, [numericOnly]);

  // Обработчик кастомной валидации только для обычных полей (не маски)
  useEffect(() => {
    if (inputRef.current && !mask) {
      const handleInvalid = (e) => {
        const validity = e.target.validity;
        if (validity.valueMissing) {
          e.target.setCustomValidity(requiredMessage);
        } else if (validity.patternMismatch) {
          e.target.setCustomValidity(patternMessage);
        } else if (validity.typeMismatch && type === 'tel') {
          e.target.setCustomValidity('Введите корректный номер телефона');
        } else {
          e.target.setCustomValidity('');
        }
      };

      const handleInput = (e) => {
        // Сбрасываем кастомное сообщение при вводе
        e.target.setCustomValidity('');
      };

      inputRef.current.addEventListener('invalid', handleInvalid);
      inputRef.current.addEventListener('input', handleInput);

      // НЕ инициализируем валидацию сразу - дадим пользователю начать ввод

      return () => {
        if (inputRef.current) {
          inputRef.current.removeEventListener('invalid', handleInvalid);
          inputRef.current.removeEventListener('input', handleInput);
        }
      };
    }
  }, [requiredMessage, patternMessage, mask, type, required, value]);

  // Обработчик изменения значения для обычных input
  const handleChange = (e) => {
    if (!mask && onChange) {
      onChange(e.target.value);
    }
  };

  // Автоматическое определение inputMode и pattern для телефона
  const getInputMode = () => {
    if (inputMode) return inputMode;
    if (type === "tel" || numericOnly) return "numeric";
    return undefined;
  };

  const getPattern = () => {
    if (pattern) return pattern;
    // Не устанавливаем pattern для полей с маской, так как валидацию делает маска
    if (mask) return undefined;
    if (type === "tel" || numericOnly) return "[0-9]*";
    return undefined;
  };

  return (
    <input
      ref={inputRef}
      type={type}
      value={mask ? undefined : value}
      onChange={handleChange}
      placeholder={placeholder}
      required={required}
      className={`input ios-zoom-fix ${className}`}
      id={id}
      inputMode={getInputMode()}
      pattern={getPattern()}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;