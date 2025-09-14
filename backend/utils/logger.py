"""
Утилиты для логирования парсеров.
Обеспечивает единообразное логирование с возможностью отключения избыточных сообщений.
"""


class ParserLogger:
    """Класс для управления логированием парсеров."""

    def __init__(self, verbose: bool = True):
        """
        Инициализация логгера.

        Args:
            verbose: Включить подробное логирование
        """
        self.verbose = verbose

    def info(self, message: str):
        """Информационное сообщение."""
        if self.verbose:
            print(f"ℹ️  {message}")

    def success(self, message: str):
        """Сообщение об успехе."""
        print(f"✅ {message}")

    def warning(self, message: str):
        """Предупреждение."""
        print(f"⚠️  {message}")

    def error(self, message: str):
        """Ошибка."""
        print(f"❌ {message}")

    def debug(self, message: str):
        """Отладочное сообщение (только в verbose режиме)."""
        if self.verbose:
            print(f"🔍 {message}")

    def processing(self, message: str):
        """Сообщение о процессе обработки."""
        if self.verbose:
            print(f"  📝 {message}")


# Глобальный экземпляр логгера
logger = ParserLogger(verbose=False)  # По умолчанию краткое логирование


def set_verbose_logging(verbose: bool = True):
    """Включить/выключить подробное логирование."""
    global logger
    logger.verbose = verbose