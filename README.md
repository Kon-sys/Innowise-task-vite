# Book Catalog (Vite + Vanilla JS)

Небольшое фронт-приложение “каталог книг” без фреймворков. Собрано на Vite, данные берутся из Open Library API.  
Есть поиск, карточки книг, избранное (localStorage) и несколько дополнительных улучшений (фильтр по автору, темы, Docker, CI).

---

## Что сделано по ТЗ

- Поиск книг через **Open Library API**
- Отображение результатов карточками:
  - обложка (или заглушка)
  - название
  - автор(ы)
  - год первой публикации
- **Избранное**
  - добавить/убрать книгу
  - сохранение в `localStorage`
  - восстановление после перезагрузки
- Состояния интерфейса:
  - `Loading` (skeleton)
  - `Empty` (нет результатов)
  - `Error` (ошибка + кнопка Retry)
  - `Idle` (подсказка)

---

## Дополнительно

- Фильтр по автору (селект заполняется после поиска)
- Theme manager (light/dark) + сохранение в `localStorage`
- Live search (поиск на лету) + `debounce` + отмена запросов через `AbortController`
- Docker (production сборка через nginx)
- GitHub Actions CI (lint + build)

---

## Требования

- Node.js **20+** (рекомендуется)
- npm **9+**
- Docker (если хочешь запускать контейнером)

---

## Запуск локально

Установить зависимости:

npm install

Запустить dev:

npm run dev

Vite покажет адрес в консоли (обычно `http://localhost:5173`).

---

## Сборка (production)

Собрать:

npm run build

Посмотреть production сборку локально:

npm run preview

### Как выглядит `dist/` после build

После `npm run build` в `dist/` должно быть:

* `dist/index.html`
* `dist/app.js`
* `dist/assets/**` (css/картинки/прочие ассеты)

---

## Запуск в Docker (production)

Собрать образ:

docker build -t book-catalog .

Запустить контейнер:

docker run --rm -p 8080:80 book-catalog

Открыть:

* `http://localhost:8080`

---

## CI (GitHub Actions)

Workflow запускается на `push` и `pull_request` и делает:

* `npm ci`
* `npm run lint`
* `npm run build`

Результат можно посмотреть на GitHub во вкладке **Actions**.

---

## npm scripts

* `npm run dev` — dev режим
* `npm run build` — production сборка
* `npm run preview` — предпросмотр production сборки
* `npm run lint` — ESLint
* `npm run format` — Prettier (форматирование)
* `npm run format:check` — проверка форматирования

---

## Структура проекта

src/
  app/
    init.js                 # инициализация приложения, подписки, обработчики
    layout.js               # базовая разметка
  shared/
    api/openLibrary.js      # запросы к Open Library
    lib/debounce.js         # debounce
    ui/skeleton.js          # skeleton при loading
    dom.js                  # qs/qsa утилиты
    store.js                # мини-store (state + subscribe)
  entities/
    book/model.js           # нормализация данных книги
  features/
    favorites/              # избранное (localStorage)
    filters/                # фильтр по автору
    theme/                  # theme manager
  widgets/
    catalog/catalogGrid.js  # рендер карточек
    favorites/favoritesPanel.js
styles/
  app.css                   # стили

---
