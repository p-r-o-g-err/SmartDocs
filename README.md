# УСТАНОВКА И ЗАПУСК (backend)
1) Перейти в папку с серверной частью
cd backend
2) Создание виртуального окружения
python3 -m venv venv
source venv/bin/activate (для Linux)
venv\Scripts\activate (для Windows)

3) Установка зависимостей
pip install -r requirements.txt

4) Запуск приложения
python run.py

# УСТАНОВКА И ЗАПУСК (frontend)
1) Перейти в папку с клиентской частью
cd frontend

2) Скачать и установить Node.js (при необходимости)

3) Выполнить команду для установки всех необходимых зависимостей
npm install

4) Запуск приложения
npm start