import React, { useState, useRef, useEffect } from "react";
import QuizStep from "./QuizStep";
import QuizOption from "./QuizOption";
import QuizProgress from "./QuizProgress";
import Input from "@/components/Input";
import PopupNotification from "@/components/PopupNotification/PopupNotification";
import { validatePhone } from "@/helpers";
import { apiRequest } from "@/utils/api";
import "./QuizCalculator.scss";

/**
 * Основной компонент квиз-калькулятора
 * Управляет состоянием всех шагов квиза и собирает данные пользователя
 */
const QuizCalculator = ({ isOpen, onClose }) => {
  // Ключи для sessionStorage
  const STORAGE_KEYS = {
    CURRENT_STEP: "quiz_current_step",
    ANSWERS: "quiz_answers",
    FORM_DATA: "quiz_form_data",
  };

  // Функции для работы с sessionStorage
  const saveToStorage = (key, data) => {
    try {
      sessionStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn("Не удалось сохранить данные в sessionStorage:", error);
    }
  };

  const loadFromStorage = (key, defaultValue) => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn("Не удалось загрузить данные из sessionStorage:", error);
      return defaultValue;
    }
  };

  const clearStorage = () => {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        sessionStorage.removeItem(key);
      });
    } catch (error) {
      console.warn("Не удалось очистить sessionStorage:", error);
    }
  };

  // Инициализация состояния с восстановлением из sessionStorage
  const [currentStep, setCurrentStep] = useState(() =>
    loadFromStorage(STORAGE_KEYS.CURRENT_STEP, 1)
  );
  const [answers, setAnswers] = useState(() =>
    loadFromStorage(STORAGE_KEYS.ANSWERS, {})
  );
  const [formData, setFormData] = useState(() =>
    loadFromStorage(STORAGE_KEYS.FORM_DATA, { name: "", phone: "" })
  );

  // Состояние уведомлений
  const [notification, setNotification] = useState({
    isVisible: false,
    type: "info",
    title: "",
    message: "",
  });

  // Состояние загрузки для кнопки отправки
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ref для поля телефона
  const phoneInputRef = useRef(null);

  // Хелпер для показа уведомлений
  const showNotification = (type, title, message) => {
    setNotification({
      isVisible: true,
      type,
      title,
      message,
    });
  };

  // Хелпер для скрытия уведомлений
  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
  };

  // Получение динамических данных для шагов квиза
  const getQuizSteps = () => {
    const isCremation = answers.step_1 === "cremation";

    return {
      1: {
        title: "Какой вид захоронения вы рассматриваете?",
        options: [
          { value: "funeral", label: "Похороны", icon: "coffin" },
          { value: "cremation", label: "Кремация", icon: "urn" },
        ],
        type: "single",
      },
      2: {
        title: isCremation
          ? "Какую урну вы предпочитаете?"
          : "Какой гроб вы предпочитаете?",
        options: isCremation
          ? [
              {
                value: "economy",
                label: "Эконом / Простая керамика",
                icon: "urn-simple",
              },
              {
                value: "standard",
                label: "Стандарт / Деревянная",
                icon: "urn-wooden",
              },
              {
                value: "premium",
                label: "Премиум / Мрамор/металл",
                icon: "urn-premium",
              },
            ]
          : [
              {
                value: "economy",
                label: "Эконом / Обитый тканью",
                icon: "coffin-simple",
              },
              {
                value: "standard",
                label: "Стандарт / Деревянный",
                icon: "coffin-wooden",
              },
              {
                value: "premium",
                label: "Премиум / Лакированный",
                icon: "coffin-premium",
              },
            ],
        type: "single",
      },
      3: {
        title: "Какие принадлежности вам понадобятся?",
        options: [
          { value: "wreath", label: "Венок", icon: "wreath" },
          { value: "cross", label: "Крест на могилу", icon: "cross" },
          { value: "ribbons", label: "Траурные ленты", icon: "ribbon" },
          { value: "clothes", label: "Одежда для усопшего", icon: "clothes" },
        ],
        type: "multiple",
      },
      4: {
        title: "Нужен ли транспорт для гостей?",
        options: [
          { value: "yes", label: "Да, автобус", icon: "bus" },
          { value: "no", label: "Нет, не нужен", icon: "no-bus" },
        ],
        type: "single",
      },
    };
  };

  const quizSteps = getQuizSteps();
  const totalSteps = Object.keys(quizSteps).length;

  // Автоматическое сохранение прогресса в sessionStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CURRENT_STEP, currentStep);
  }, [currentStep]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ANSWERS, answers);
  }, [answers]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.FORM_DATA, formData);
  }, [formData]);

  // Обработчик выбора ответа
  const handleAnswerSelect = (stepKey, answer) => {
    const step = quizSteps[currentStep];

    if (step.type === "multiple") {
      // Для множественного выбора
      setAnswers((prev) => {
        const currentAnswers = prev[stepKey] || [];
        const isSelected = currentAnswers.includes(answer);

        return {
          ...prev,
          [stepKey]: isSelected
            ? currentAnswers.filter((a) => a !== answer)
            : [...currentAnswers, answer],
        };
      });
    } else {
      // Для одиночного выбора - автоматический переход к следующему шагу
      setAnswers((prev) => ({ ...prev, [stepKey]: answer }));

      setTimeout(() => {
        if (currentStep < totalSteps) {
          setCurrentStep((prev) => prev + 1);
        } else {
          // Переход к форме
          setCurrentStep(totalSteps + 1);
        }
      }, 300);
    }
  };

  // Обработчик перехода к следующему шагу (для множественного выбора)
  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setCurrentStep(totalSteps + 1);
    }
  };

  // Обработчик возврата к предыдущему шагу
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Функция отправки данных в Telegram
  const sendToTelegram = async (data) => {
    try {
      const response = await apiRequest("/api/quiz/submit", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // Пытаемся прочитать детали ошибки от сервера
        let errorMessage = "Ошибка обработки заявки";
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch {
          // Если не можем прочитать JSON, используем статус код
          errorMessage = `Ошибка сервера: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error("Ошибка отправки в Telegram:", error);

      // Если ошибка сети или сервера недоступен
      if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
        throw new Error("Проблемы с подключением к серверу. Проверьте интернет-соединение.");
      }

      throw error;
    }
  };

  // Функция повторной отправки неудачных заявок
  const retryFailedSubmissions = async () => {
    try {
      const failedSubmissions = JSON.parse(localStorage.getItem('failedQuizSubmissions') || '[]');

      if (failedSubmissions.length === 0) return;

      for (const submission of failedSubmissions) {
        try {
          await sendToTelegram(submission.data);
          console.log('Повторная отправка успешна для заявки:', submission.timestamp);
        } catch (error) {
          console.log('Повторная отправка неудачна:', error.message);
          break; // Прекращаем попытки если сервер все еще недоступен
        }
      }

      // Очищаем успешно отправленные заявки
      localStorage.removeItem('failedQuizSubmissions');
    } catch (error) {
      console.warn('Ошибка при повторной отправке:', error);
    }
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Предотвращаем повторную отправку
    if (isSubmitting) return;

    // Валидация полей перед отправкой
    if (!formData.name.trim()) {
      showNotification(
        "error",
        "Вы кое-что забыли",
        "Пожалуйста, введите ваше имя"
      );
      return;
    }

    if (!formData.phone || !validatePhone(formData.phone)) {
      showNotification(
        "error",
        "Вы кое-что забыли",
        "Пожалуйста, введите корректный номер телефона"
      );
      // Фокусируемся на поле телефона
      if (phoneInputRef.current) {
        phoneInputRef.current.focus();
      }
      return;
    }

    const finalData = {
      ...answers,
      ...formData,
      timestamp: new Date().toISOString(),
    };

    // Начинаем отправку
    setIsSubmitting(true);

    try {
      // Отправляем данные в Telegram
      await sendToTelegram(finalData);

      // Попытка отправить ранее неудачные заявки
      await retryFailedSubmissions();

      // Очистить сохраненные данные после успешной отправки
      clearStorage();

      // Показать уведомление об успешной отправке
      showNotification(
        "success",
        "Заявка отправлена!",
        "Спасибо! Наш специалист свяжется с вами в течение 5 минут."
      );

      // Закрыть модальное окно через небольшую задержку
      setTimeout(() => {
        onClose();
      }, 3000);

    } catch (error) {
      // Сохраняем данные локально для попытки отправки позже
      try {
        const failedSubmissions = JSON.parse(localStorage.getItem('failedQuizSubmissions') || '[]');
        failedSubmissions.push({
          data: finalData,
          timestamp: new Date().toISOString(),
          error: error.message
        });
        localStorage.setItem('failedQuizSubmissions', JSON.stringify(failedSubmissions));
      } catch (storageError) {
        console.warn('Не удалось сохранить данные локально:', storageError);
      }

      // Показать уведомление об ошибке с конкретным сообщением
      showNotification(
        "error",
        "Ошибка отправки",
        `${error.message} Попробуйте еще раз или позвоните нам: +7 (920) 366-36-36`
      );
    } finally {
      // Завершаем состояние загрузки
      setIsSubmitting(false);
    }
  };

  // Обработчик изменения полей формы
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Закрытие модального окна
  const handleClose = () => {
    // НЕ сбрасываем состояние при закрытии, чтобы сохранить прогресс
    // Прогресс будет очищен только при успешной отправке формы
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="quiz-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiz-title"
      >
        <div className="quiz-modal__overlay" onClick={handleClose}></div>
        <div className="quiz-modal__content">
          <button
            className="quiz-modal__close"
            onClick={handleClose}
            aria-label="Закрыть калькулятор"
          >
            &times;
          </button>

          <header className="quiz-header">
            <h2 id="quiz-title" className="quiz-header__title">
              Рассчитайте стоимость похорон за 1 минуту
            </h2>
            <QuizProgress currentStep={currentStep} totalSteps={totalSteps} />
          </header>

          <div aria-live="polite" aria-atomic="true" className="sr-only">
            {currentStep <= totalSteps
              ? `Шаг ${currentStep} из ${totalSteps}: ${quizSteps[currentStep]?.title}`
              : "Заполните контактные данные для получения расчета"}
          </div>

          <main className="quiz-body">
            {currentStep <= totalSteps ? (
              <QuizStep
                title={quizSteps[currentStep].title}
                stepNumber={currentStep}
              >
                <div className="quiz-options">
                  {quizSteps[currentStep].options.map((option) => (
                    <QuizOption
                      key={option.value}
                      label={option.label}
                      value={option.value}
                      icon={option.icon}
                      type={quizSteps[currentStep].type}
                      isSelected={
                        quizSteps[currentStep].type === "multiple"
                          ? (answers[`step_${currentStep}`] || []).includes(
                              option.value
                            )
                          : answers[`step_${currentStep}`] === option.value
                      }
                      onClick={() =>
                        handleAnswerSelect(`step_${currentStep}`, option.value)
                      }
                    />
                  ))}
                </div>

                <div className="quiz-navigation">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      className="quiz-btn quiz-btn--secondary"
                      onClick={handlePrevStep}
                    >
                      Назад
                    </button>
                  )}

                  {quizSteps[currentStep].type === "multiple" && (
                    <button
                      type="button"
                      className="quiz-btn quiz-btn--primary"
                      onClick={handleNextStep}
                      disabled={
                        !answers[`step_${currentStep}`] ||
                        answers[`step_${currentStep}`].length === 0
                      }
                    >
                      Далее
                    </button>
                  )}
                </div>
              </QuizStep>
            ) : (
              <QuizStep title="Расчет почти готов!" stepNumber={currentStep}>
                <div className="quiz-form">
                  <p className="quiz-form__description">
                    Оставьте ваш номер телефона, и наш специалист свяжется с
                    вами в течение 5 минут, чтобы озвучить точную стоимость и
                    ответить на все вопросы.
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div className="quiz-form__field">
                      <label htmlFor="quiz-name" className="quiz-form__label">
                        Ваше имя
                      </label>
                      <Input
                        id="quiz-name"
                        type="text"
                        className="quiz-form__input"
                        value={formData.name}
                        onChange={(value) => handleFormChange("name", value)}
                        required
                        placeholder="Введите ваше имя"
                        requiredMessage="Пожалуйста, введите ваше имя"
                      />
                    </div>

                    <div className="quiz-form__field">
                      <label htmlFor="quiz-phone" className="quiz-form__label">
                        Ваш номер телефона
                      </label>
                      <Input
                        id="quiz-phone"
                        ref={phoneInputRef}
                        type="tel"
                        className="quiz-form__input"
                        required
                        placeholder="+7 (___) ___-__-__"
                        mask={true}
                        numericOnly={true}
                        onChange={(value) => handleFormChange("phone", value)}
                        onMaskComplete={(value) =>
                          handleFormChange("phone", value)
                        }
                        requiredMessage="Пожалуйста, введите ваш номер телефона"
                      />
                    </div>

                    <div className="quiz-form__actions">
                      {currentStep > 1 && (
                        <button
                          type="button"
                          className="quiz-btn quiz-btn--secondary"
                          onClick={handlePrevStep}
                        >
                          Назад
                        </button>
                      )}

                      <button
                        type="submit"
                        className={`quiz-btn quiz-btn--primary quiz-btn--large ${isSubmitting ? 'loading' : ''}`}
                        disabled={isSubmitting}
                      >
                        <span>
                          {isSubmitting ? 'Отправляем...' : 'Получить точный расчет'}
                        </span>
                      </button>
                    </div>
                  </form>
                </div>
              </QuizStep>
            )}
          </main>
        </div>
      </div>

      {/* Уведомления */}
      <PopupNotification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
        closable={true}
        duration={notification.type === "success" ? 0 : 5000}
      />
    </>
  );
};

export default QuizCalculator;
