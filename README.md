# Приложение messenger на курсе Middle-frontend-developer от Yandex

Это приложение предназначено для общения между пользователями в браузере

## Используемые технологии

- HTML
- SCSS
- JS/TS
- REST API
- Websocket
- Handlebars.js
- Vite
- Express

## Установка

1. Склонируйте репозиторий.
2. Откройте папку в любом редакторе кода.
3. Запустите установку всех зависимотей:

   npm install


## Запуск проекта

- Для запуска проекта в режиме разработки на сервере Vite:

  npm run dev


- Для сборки проекта и запуска на сервере Express(порт 3000):

  npm run start


## Дизайн

Я выбрал готовый дизайн, который предоставил Яндекс, ссылка на макет:
https://www.figma.com/file/jF5fFFzgGOxQeB4CmKWTiE/Chat_external_link?node-id=0%3A1

## Доступные страницы:

- http://localhost:3000/ - главная страница со списком всех страниц
- http://localhost:3000/login.html - страница авторизации пользователя
- http://localhost:3000/registry.html - страница регистрации пользователя
- http://localhost:3000/404.html - страница 404 ошибки
- http://localhost:3000/500.html - страница 500 ошибки
- http://localhost:3000/messages.html - страница списка чатов и чата
- http://localhost:3000/profile.html - страница профиля пользователя
- http://localhost:3000/modals.html - страница с модалками, которые будут использоваться в проекте

## Netlify

Проект выложен на Netlify и доступ по ссылке:
https://gilded-lollipop-2f6acd.netlify.app/
