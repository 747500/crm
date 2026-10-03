# ROADMAP

Решения, принятые в обсуждении (2026-10-03):

- **Монорепо здесь, без submodules.** Две части занесены в `packages/`, оригинальные
  репозитории заморожены (`FROZEN.md` с отсылкой).
- **ClickHouse — dual** (пишем и в Mongo, и в CH; читаем пока из Mongo, CH — эксперимент,
  включая «ClickHouse с файлами»).
- **Старт максимально мягкий**: сначала очевидные баги → запустить → happy-path unit/e2e
  (если оправданы) → потом большие миграции.
- **Frontend Vue 3 + TS — отдельным workspace** (`packages/web`), не трогая текущий Vue 2.
- **Файловые операции — кандидат в отдельный сервис/workspace** (`packages/files`).
- **GraphQL** — недописанная reflection-идея (пунктирно работала). Держим её в фокусе,
  но не блокируем остальное.
- Итоговый порядок фаз определяю сам (ниже).

## Целевая структура

```
crm/                      # монорепо (workspaces)
├── server/               # BFF (Express) — в корне
├── packages/
│   ├── legacy-web/       # старый Vue2 SPA (webpack → корневой public/)
│   ├── web/              # новый SPA: Vue3 + TS + Vite
│   ├── graphql-mongodb/  # GraphQL backend (→ dual + ClickHouse позже)
│   ├── telegram-bot/
│   └── e2e/              # Playwright e2e
├── test/                 # unit (vitest)
├── docker/  docker-compose.yml
├── TODO.md  REVIEW.md  ROADMAP.md
```

## Порядок фаз

- [x] **Фаза 0 — Монорепо-скелет.** `workspaces` в корне, `packages/graphql-mongodb`,
      `packages/telegram-bot`, заморозка оригиналов (`FROZEN.md`).
- [x] **Фаза 1 — Очевидные баги (P0/P1).** См. список ниже.
- [x] **Фаза 2 — Поднять стек.** Локально поднято на реальных данных; поиск/файлы/бот — см. «итог» ниже.
      Docker-образы скачаны, `docker-compose.yml` валиден (переключение — по желанию).
- [x] **Фаза 3 — Тесты.** ✅ unit (vitest, 12) + ✅ e2e (Playwright, 4: upload, settings, create/edit, search).
- [x] **Фаза 4 — `packages/web` (Vue 3 + TS).** ✅ каркас на Vite + CRUD + файлы + поиск + настройки;
      SPA собирается в корневой `public/` и раздаётся BFF. Legacy-SPA перестал отдаваться
      (`packages/legacy-web` пока в репо, удаление — после проверки).
- [ ] **Фаза 5 — `packages/files`.** Выделить файловые операции (upload/meta/thumbnails/GridFS)
      в отдельный сервис; BFF проксирует. Подготовить почву под CH-файлы.
- [ ] **Фаза 6 — TypeScript** по частям: `model`/`types` → `services` → `middleware`/`routes`,
      затем пакеты. Заодно обновление зависимостей (EOL: mongoose 5, express 4.17, graphql 15…).
- [ ] **Фаза 7 — ClickHouse (dual-write).** Схема (ReplacingMergeTree), репозиторий-адаптер,
      dual-write на записи, сверка, затем эксперимент с файлами в CH.
- [ ] **Фаза 8 — GraphQL reflection.** Доделать динамическую обёртку (introspection → прокси).
- [ ] **Фаза 9 — RabbitMQ «до рабочего состояния».** Reconnect, DLQ, единые durable/exclusive,
      таймауты (частично сделано), типизированный контракт, graceful shutdown.

## Фаза 1 — что уже исправлено

- **B1** двойной `callback`/`ack` в `server/services/mongodb.mjs` → один вызов.
- **B2** `server/services/graphql.mjs` — убрана несуществующая `queryUsers`, `reject(errors)`→
  `reject(reply.errors)`, сервис снова чистый прокси reflection-идеи.
- **B3** `packages/graphql-mongodb` — null-guard, `id` как строка, ISO для дат, `docs` отдаёт
  plain-объекты с `__typename`, в union добавлен `Contract`.
- **B4** создание нового документа: `DocList.createDoc` → маршрут с `id: 'new'`, `Doc.vue`
  трактует `new` как создание.
- **B5** починен `build`-скрипт (убран абсолютный путь).
- **B6** `app/main.js` — переход на существующий маршрут (`personList`).
- **B7** убран незадекларированный `body-parser` (используем `express.text()/json()`).
- **B10** Sphinx: `localAddress` → `host`.
- **B14** добавлен error-handling middleware в `server/server.mjs`.
- **B16** guard на `tabView` в `Doc.vue`.
- **B17** `FileData.vue` — корректный `key` по `mtime`.
- **B21** таймаут ответа AMQP + очистка `graphqlCorrelation` (без утечки/зависаний).

## Осталось из ревью

- Исправлено в ходе работ: **S1** (переклассифицирован — осознанная отладка), **B3** (сериализация
  резолверов), **B8** (id для Sphinx → `sphinxId`), **B9** (`fts` учитывает массивы/поддокументы),
  **B11–B12** (загрузка: `lastModified`, кодирование имени, `caption`/`Last-Modified` дефолты),
  **B14** (error-handler), **B16**, **B17**, graceful shutdown (зависшие процессы).
- Осталось: **S2** (отозвать токен бота), **B13** (строгий `application/json`), **B15** (events-заглушка),
  **B18** (`yearmonth`/пагинация), **B19** (cookie/session для прода), **B20** (имена очередей в примерах),
  **B22** (логи/PII), **B23** (обновление модулей — Фаза 6).

## Локальный запуск (проверено 2026-10-03)

Требуется: MongoDB, RabbitMQ, Node 22. Sphinx — опционально (нужен только для поиска).

```bash
npm install

mongod --dbpath /tmp/crm-mongo --bind_ip 127.0.0.1 &

# если системные каталоги RabbitMQ недоступны — свои base-каталоги
RABBITMQ_MNESIA_BASE=/tmp/rabbit/mnesia RABBITMQ_LOG_BASE=/tmp/rabbit/log \
  rabbitmq-server &

node packages/graphql-mongodb/index.mjs &   # слушает очередь crm-graphql
node server/server.mjs &                    # BFF + SPA на http://127.0.0.1:3000

npm run build                               # фронт → public/
```

Конфиги: `server/config.js` (из `server/example-config.js`) и `packages/*/config.mjs`
(из `example.config.mjs`) — сейчас указывают на `127.0.0.1`.

Проверенный smoke (всё зелёное): создание пользователя (`PUT /api/v0/u`) → сессия
(`POST /api/v0/u/set`) → список (`GET /api/v0/u/list`) → профиль через GraphQL-over-AMQP
(`GET /api/v0/u/info`) → создание/чтение/обновление контакта (`PUT/GET/POST /api/v0/doc`) →
`GET /api/v0/doc/:id/files`.

## Находки Phase 2

- **amqplib 0.7 несовместим с RabbitMQ 4**: клиент предлагает `frame_max=4096`, сервер требует
  ≥ 8192 → `ECONNRESET` на handshake. Апнули `amqplib` до `^0.10.4` во всех трёх пакетах — работает.
- **Smoke поймал регрессию**: при замене `body-parser` потерялась обёртка `app.use(...)` у
  `express.json()` → `req.body` был `undefined` (исправлено).
- **Sphinx не обязателен для записи**: индексация (`Search.Add/Update`) сделана не-фатальной —
  без Sphinx документы создаются/обновляются штатно, пропуск индексации пишется в лог.
- **Установка**: `pug-loader@2` конфликтовал peer'ом с `pug@3` и не используется → удалён;
  добавлен `.npmrc` с `legacy-peer-deps=true` для легаси-дерева.
- **Сборка фронта** (`npm run build`) пришлось чинить в три шага: webpack 5.50 падает на OpenSSL 3
  (md4) → `NODE_OPTIONS=--openssl-legacy-provider`; `entry` должен быть относительным (`./app/main.js`);
  выход `-o ./public`. Итог: собирается (`main.js` 2.18 MiB, `bundle.css` 215 KiB).

## Секреты → `.env`

- `packages/telegram-bot/.env.example` (трекнут), `.env` (в `.gitignore`).
- `config.mjs` читает всё из окружения; `serve` грузит `.env` через
  `node --env-file-if-exists=.env` (Node 22, без `dotenv`). Хардкод токена убран.
- Корневые скрипты: `npm run serve:graphql`, `npm run serve:bot`.

## Заметки: текстовый поиск в ClickHouse (проверено на 26.9.7.9)

Доступные skip-индексы: `text`, `sparse_grams`, `vector_similarity`, `bloom_filter`,
`tokenbf_v1`, `ngrambf_v1`, `set`, `minmax`, `hypothesis`.

- `INDEX ... TYPE text(tokenizer='splitByNonAlpha')` — инвертированный (полнотекстовый) индекс
  (бывший `full_text`), требует явный `tokenizer`; ускоряет `hasToken/hasAllTokens/hasAnyTokens`
  (проверено: находит `Hello` в `Hello World`).
- `sparse_grams(...)` — n-граммы для substring `LIKE '%...%'` (требует 5–6 аргументов).
- `tokenbf_v1` / `ngrambf_v1` — bloom-фильтры по токенам / n-граммам.
- `vector_similarity('hnsw','cosineDistance',<dim>)` — векторный (ANN) индекс, dim фиксирован.

Ограничения против Sphinx:

- **Нет морфологии**: `hasAllTokens(s,['Иванову'])` НЕ находит `Иванов` (проверено). Нет
  стемминга/Soundex/Metaphone — а в текущем rt-индексе Sphinx они включены (`stem_enru, Soundex, Metaphone`).
- **Нет ранжирования** (BM25/TF-IDF) из коробки.
- `ILIKE`/`position*` работают, но без `sparse_grams` это скан колонки, а не индекс.

Вывод: **Sphinx остаётся основным** для поиска (морфология важна для русских ФИО/адресов).
В ClickHouse (dual) заводим `String`-колонку `fts` с индексом `text`/`sparse_grams` как эксперимент;
полный отказ от Sphinx — только если решим, что морфология не нужна (тогда доделываем ранжирование руками).

## Инфраструктура: прокси, 10.28.0.25, docker-compose

- **Прокси**: локальный `*:2080` (работает и как HTTP, и как SOCKS5). Бот ходит через
  `TELEGRAM_PROXY` (по умолчанию `http://127.0.0.1:2080`); проверено — `getMe` →
  `@crm_untyped_net_bot`. На `10.28.0.25:2080` прокси нет.
- **Mongo на 10.28.0.25**: `mongodb-org 5.0.9` (amzn2-сборка), сервис `mongod` (disabled).
  Данные `/var/lib/mongo` (453 MB, WiredTiger 2021–2022), БД **`crm` (46 MB)**: коллекции
  `users, docs, sessions, fs.files, fs.chunks, test`. Запуск на 5.0.9 — **успешно**
  (проверено, затем остановлено; включить: `sudo systemctl enable --now mongod`).
  Репозитория mongodb в `dnf` нет. «Свежий» mongod **на этом же каталоге данных не стартует** —
  нужен последовательный апгрейд 5.0→6.0→7.0 (`setFeatureCompatibilityVersion`) либо
  `mongodump` → свежий сервер на новом каталоге (база мелкая — проще дамп/рестор).
- **ClickHouse на 10.28.0.25 — годится** (для лёгкой/экспериментальной нагрузки):
  Fedora 44, 8 ядер AMD FX-8350 (старый, без AVX2 — по пер-ядру слабый), **31 GiB RAM**,
  NVMe (143 GB `/`, 220 GB `/home`), `clickhouse` уже установлен, load ~0.
  Рекомендация: ужать (`max_threads≈4`, `max_server_memory_usage≈8 GiB`), данные — на NVMe.
- **docker-compose** добавлен: `rabbitmq` (crm/crm) + `mongo` по умолчанию; профили
  `--profile ch` (ClickHouse с `cpus:2`, `mem_limit:2g`, `limits.xml`) и `--profile sphinx`.
  Образы локально ещё не скачаны (`docker compose pull`).
- **`.env` для стека**: `server/config.js` и `packages/graphql-mongodb/config.mjs` читают
  `AMQP_URL`, `MONGO_URI`, `SPHINX_*`, `PORT`, `SESSION_SECRET`; `serve`-скрипты грузят `.env`.

## Находки Phase 2 (продолжение)

- **Зависшие процессы — важный баг.** Сервисы вешали `process.on('SIGTERM')`, но **не завершали
  процесс** (закрывали ресурсы и всё). Из-за этого старые инстансы выживали после `kill`, подключались
  к тем же AMQP-очередям и **перехватывали сообщения** (симптом: `GET /api/v0/u/info` → 401
  «Access Denied», хотя прямой AMQP-запрос к бэкенду возвращал пользователя). Плюс несколько
  процессов писали в один лог → NUL-мусор. Исправлено: `process.exit(0)` в shutdown-хендлерах
  express/mongo/sphinx (+ страховочный таймаут для keep-alive). На будущее — единый координатор
  shutdown (Этап 9).
- **Чистый перезапуск** (1 бэкенд + 1 BFF): smoke снова зелёный — `u/info` 200 (через
  GraphQL-over-AMQP), `PUT /doc` (property) 200.
- **Бот**: токен валиден; `getMe` через `TELEGRAM_PROXY=http://127.0.0.1:2080` → `@crm_untyped_net_bot`
  (напрямую `api.telegram.org` из этой среды недоступен).

## Фаза 2 — итог (готово)

- **Данные**: снят дамп со старой Mongo (`10.28.0.25`, mongod 5.0.9) и восстановлен локально
  (mongod 5.0.33): **4 пользователя, 80 документов, 83 файла**. Приложение работает на реальных данных
  (Serge + контакты «Абрамов», «Иванов», объекты, файлы).
- **Файлы**: GridFS-отдача (`GET /api/v0/f/:id`) и превью (`/:id/t`, sharp) — 200 на реальных данных.
- **Поиск**: поднят Sphinx (RT-индекс `testrt`), добавлен `scripts/reindex-sphinx.mjs`
  (`node scripts/reindex-sphinx.mjs`) — 80 документов; `POST /api/v0/doc/s` возвращает результаты
  (морфология `stem_enru` работает: «Иванов» → найден).
- **Бот**: `npm run serve:bot` стартует, AMQP подключается, Telegram polling через прокси без ошибок.
- **Docker**: образы `rabbitmq:4-management`, `mongo:7` скачаны; `docker-compose.yml` валиден.
  Переключение на docker — восстановить дамп в docker-mongo и выставить `AMQP_URL=amqp://crm:crm@127.0.0.1`.
- Фронт собирается, BFF+бэкенд smoke зелёный.

**Дальше — Этап 3 (тесты):** `vitest` на чистые функции (`fts`, `sphinx-id`, сериализация),
Playwright happy-path (UI + AMQP). Согласовать объём.

## Загрузка файлов — баги (исправлено)

Найдено при проверке UI («Загрузить ничего не делает», ошибка в консоли браузера):

- **`task.file.lastModifiedDate` в современных браузерах удалён** → `.toString()` кидал `TypeError`,
  воркер очереди падал, и кнопка «Загрузить» молча ничего не делала. Заменено на
  `task.file.lastModified` (+ fallback на `Date.now()`).
- **URL не кодировал имя файла** → имена с пробелами/кириллицей ломали запрос. Теперь `encodeURIComponent`.
- **`callback(err)` в `catch`** — при ошибке запроса очередь вставала навсегда.
- **Глобальные `express.json()/text()` съедали тело загрузок** с `text/plain`/`application/json`
  (файл сохранялся 0 байт) → body-parser теперь пропускает путь `/upload/` (проверено: 21 Б round-trip).
- **`caption:"undefined"`** при отсутствии `X-Meta-Caption` → дефолт `''`; `Last-Modified` с fallback.
- **`jsconfig.json` был невалидным JSON** (без закрывающей `]`) → ломало Playwright/JSON-инструменты.

## Фаза 3 — начало (e2e)

- Новый workspace `packages/e2e` (`@crm/e2e`) с **Playwright 1.63**: `playwright.config.js`
  (baseURL `http://127.0.0.1:3000`, `--no-sandbox`), фикстура `fixtures/e2e-upload.png`.
- Тест `tests/upload.spec.js`: отладочный вход (in-page `fetch` на `/u/set`) → список контактов →
  открытие контакта → вкладка «Файлы» → `setInputFiles` → «Загрузить» → **ожидание `200` от `/upload/`**
  → очередь очищается. **Проверено: `1 passed`.** Именно этот тест ловит регрессию `lastModifiedDate`.
- Запуск: `npm run test:e2e` (из корня) или `npx playwright test` из `packages/e2e`.
- Осталось: unit-тесты (`vitest`) на `fts`/`sphinx-id`/сериализацию; ещё e2e (создание/правка сущностей).

## Настройки пользователя — баг (исправлено)

- `POST /api/v0/u` (сохранение настроек) падал с 500 `Cannot read properties of undefined
  (reading 'tree')`: `user/Load` клал в `req.User` **plain-объект из GraphQL**, а
  `user/Update`/`user/Save` ожидали mongoose-документ (`req.User.schema.tree`, `req.User.save()`).
  Это следствие незавершённого перехода на GraphQL.
- Исправлено: `user/Load` грузит собственный mongoose-документ `User` (единый источник для чтения
  и записи); в `user/AsResult` добавлен `id` (виртуал — `toObject()` его по умолчанию не отдаёт),
  чтобы работала подсказка `/auth {{ userinfo.id }}` в UI.
- Проверено: `POST /u` → 200, `notifyBirthdayAt` меняется (08:00 → 09:30) и сохраняется.

## Фаза 3 — e2e (добавлено)

- Второй тест `tests/settings.spec.js`: вход → `#/settings` → смена времени → `POST /u` 200 →
  проверка через `GET /u/info`. **Оба теста зелёные:** `2 passed` (`npm run test:e2e`).
- Замечание: никаких хардкод-хостов в `app/` нет — API root относительный (`/api/v0`),
  поэтому POST идёт на тот же хост, с которого открыт SPA (доступ с любого адреса, не только 127.0.0.1).

## Фаза 3 — unit-тесты (vitest, добавлено)

- `vitest` в корне, `vitest.config.mjs`, тесты в `test/`. Запуск: `npm run test:unit`. **12 тестов, зелёные.**
  - `test/fts.test.mjs` — вложенные объекты; массивы/поддокументы (`contact._doc`); пропуск
    `ObjectId`/`Date`/`$__*`; защита от циклов (регресс-щит **B9**);
  - `test/sphinx-id.test.mjs` — уникальность при одинаковом `ctime` (регресс-щит **B8**);
  - `test/serialize.test.mjs` — `id` строка, `version`, `__typename`, даты ISO.
- Рефакторинг под тесты: `server/lib/sphinx-id.mjs`; `packages/graphql-mongodb/graphql/serialize.mjs`
  (резолверы `doc/user/docs/users` используют его); `fts` переписан (массивы + `_doc` + WeakSet).
- Проверено end-to-end после фиксов: `fts` включает контакты, поиск находит по `qq@chto.li`,
  «мобильный» (2 док.), «Иванов»; e2e `2 passed`.

## Фаза 3 — e2e (расширено до 4)

- `tests/create.spec.js` — создание контакта («+» → форма → `PUT /doc` 200) и правка (`POST /doc/:id` 200).
- `tests/search.spec.js` — поиск через верхнюю строку → `POST /doc/s` 200 → клик по результату → модалка.
- `tests/upload.spec.js`, `tests/settings.spec.js` — как раньше; общий `tests/helpers.js`.
- **E2E поймал баг**: результаты поиска не открывались по клику — `@open="openDoc"` висел на `<List>`,
  а событие `open` эмитит `MDoc` (внутри слота, без обработчика). Перенёс `@open` на `MDoc` в `Search.vue`.
- Итог: `npm run test:e2e` → **4 passed**.

## Фаза 4 — packages/web (Vue 3 + TS + Vite)

- Новый workspace `@crm/web`: `vite.config.ts` (dev-прокси `/api` → `http://127.0.0.1:3000`),
  `tsconfig.json` (strict), `env.d.ts`, `src/main.ts` (vue-router hash), `src/App.vue` (выбор
  пользователя), `src/api.ts` (типизированный fetch к `/api/v0`), `src/views/ContactsView.vue`
  (список контактов). Ходит в тот же BFF API.
- Проверено: `npm run build -w @crm/web` → `vue-tsc --noEmit` + `vite build` — **зелёные**.

## Реструктуризация: legacy-web + vue3 в корне

Два vue-мажора не уживаются в одном `node_modules` (hoisting):
- Старый Vue-2 SPA вынесен в `packages/legacy-web` (`app/`, `webpack.config.js`, `vue.config.js`,
  `jsconfig.json`, все SPA-зависимости); сборка пишет в корневой `public/` (`npm run build` делегирует).
  Импорт bootstrap в `main.js` — на bare-спецификатор (`bootstrap/dist/css/bootstrap.css`).
- Корневой `package.json` — только серверные зависимости; в `devDependencies` добавлен `vue@3`,
  чтобы vue3 жил в корне, а vue2 — вложенно у `legacy-web` (иначе hoisted `@vitejs/plugin-vue`
  резолвил CJS vue2 и `vite build` падал).

## Итог по проверкам

- unit: **12 passed**; e2e: **4 passed**; `@crm/web` build: **OK**; legacy SPA build: **OK**.
- Стек: `mongod`, `rabbitmq-server`, GraphQL-бэкенд, BFF, `searchd` — на реальных данных.

## TS-пилот (рекомендация A→B): packages/graphql-mongodb

Решили переводить бэк на TypeScript по схеме «`.ts` + нативный запуск Node + отдельный `tsc --noEmit`»
(без шага сборки). Пилот — на листовом пакете.

- Все `.mjs` → `.ts`, импорты `./x.ts`, пакет `"type": "module"`, `main: index.ts`.
- **Нативный запуск**: `node index.ts` (Node 22.22 — type stripping включён по умолчанию, без флагов).
- **Типы отдельно**: `npm run typecheck` = `tsc --noEmit` → **зелёно**.
- `tsconfig`: `strict: true`, но на старте `noImplicitAny/noImplicitThis: false` (легаси без аннотаций —
  включаем постепенно, файл за файлом).
- Типы зависимостей: mongoose 5 и graphql — bundled; `@types/amqplib`; шим для `graphql-fields-list`
  (`types/shims.d.ts`).
- Дополнительно типизированы: реестр сервисов (`services/index.ts`), non-null на границах парсинга в
  `test.ts`, `JSON.parse(content.toString())`.
- Проверено: бэкенд стартует из `.ts`, unit **12**, e2e **4** — зелёные.

Замечания по нативному TS (проверено на 22.22.2): strip-only не поддерживает `enum`/`namespace`/
параметр-свойства (в нашем коде их нет); расширения в импортах обязательны и «как в файле»;
`./x.js` НЕ резолвится в `x.ts`; `tsconfig.paths` не работает. Node 24 LTS — станет ещё лучше.

## Фаза 4 — packages/web: CRUD + файлы (паритет)

- `api.ts`: добавлены `getDoc/createDoc/updateDoc`, `listFiles/fileMeta/fileUrl`,
  `saveCaption/deleteFile/uploadFile`.
- `schema.ts`: описания видов (person/property — поля, `listKeys`, special contact/owner).
- Экраны: `DocList.vue` (список + «+ Новый»), `DocEdit.vue` (создание/правка; контакты строками
  `значение | описание`; выбор собственника), `FilesPanel.vue` (загрузка/список/подпись/удаление).
- Роуты: `/:kind(person|property)`, `/:kind/new`, `/:kind/:id`.
- Vite: `server.host = '127.0.0.1'` (иначе слушает только `[::1]`), `preview` с прокси.
- Smoke-тест нового SPA `tests/web.spec.js` (список → создание → загрузка) — итого e2e **5 passed**.
- **✅ Фаза 4 завершена.** SPA собирается в корневой `public/` (`vite build.outDir = '../../public'`,
  `emptyOutDir: true`), BFF раздаёт его через `express.static('public')`; `npm run build` теперь
  собирает `@crm/web` (legacy-web больше не собирается в `public/`).
- **Паритет расширен**: добавлены `SearchView.vue` (`#/search?q=`, `POST /api/v0/doc/s`) и
  `SettingsView.vue` (`#/settings`, `POST /api/v0/u`), в `App.vue` — строка поиска + ссылка «Настройки».
- **e2e перенесены на новый UI** (все целятся в `:3000`, где BFF отдаёт новый SPA): `create`,
  `upload`, `search`, `settings` — **4 passed**. `web.spec.js` (vite-dev `:5173`) удалён — покрыт
  `create`+`upload`.
- **Открыто на проверку**: удаление `packages/legacy-web` (Vue 2) и его зависимостей — по согласию.
  Также в новом SPA пока нет экранов `contract` и событий (дней рождения) — возможные следующие шаги.

## Миграция legacy-фронта (Vue2 → Vue3) — фундамент

Решение: перенести legacy-вёрстку/логику «как есть», по шагам/виджетам. Формы — решаем отдельно
(FormKit vs свой рендерер). Сделано (фундамент):

- **Сайдбар-layout**: `App.vue` перестроен по образцу legacy `nav.vue` — Bootstrap `navbar` +
  сайдбар (`col-md-3/col-lg-2`, иконки+названия) + `main`. Подключён Bootstrap 5 CSS в `@crm/web`.
- **Роутер расширен**: `/calendar`, `/enquiries`, `/search`, `/settings` + `/:kind(person|property|contract)`
  (список/новая/правка). В `schema.ts` добавлен вид `contract` (Сделки).
- **Календарь**: `CalendarView.vue` (месяц, `<<`/`>>`, список событий) + `Calendar.vue` (сетка, Пн-первый,
  бизнес-дни/праздники, русские дни недели) + `EventItem.vue` (элемент → переход к контакту).
  Данные: `api.docEvents('person', yearmonth)` (`GET /api/v0/doc/events/person?yearmonth=`).
- **Зависимости**: `bootstrap`, `moment`. ⚠️ `moment-business-days` **не используется** — несовместим
  с Vite/ESM (`typeof require === 'function'` → `moment` undefined). Заменён локальным расчётом
  рабочих дней + фиксированный набор праздников (уточнить позже).
- **e2e**: добавлен `calendar.spec.js` — итого **5 passed** (calendar, create, search, settings, upload).
  unit: **12 passed**.

## Миграция — принцип и следующие шаги (виджеты)

**Принцип:** сначала **функциональный паритет** (не потерять то, что старый умеет, и отображать
то же в том же объёме; сырой JSON в `<pre>` у файлов — сохранить). Стили/бордеры не важны.
**Перевёрстка** (лаконично, по-современному) — **низкий приоритет**, отдельно, после переноса функционала.
`legacy-web` удаляем **после** достижения паритета.

- **[x] Файлы (паритет)**: `FilesPanel.vue` — у каждого файла действия **удалить**, **сделать главной**
  (💡 `setMain`, `POST /doc/:id {mainPicture}`), **инфо** (🛈, модалка с JSON в `<pre>`), правка **подписи**.
  Кнопки над картинкой в гриде. e2e `files-actions.spec.js` — **6 passed**.
  - **Баг «чёрные квадраты»**: e2e-фикстура `e2e-upload.png` была битым чёрным PNG (1×1, CRC error),
    upload-тесты заливали её в реальный первый документ (23 чёрных файла). **Фикс**: фикстура заменена
    на видимый градиент (120×90); чёрные файлы удалены; upload-тесты теперь создают **отдельный
    тестовый контакт** и заливают туда (реальные документы не засоряются).
- **[x] Формы — свой рендерер** (без FormKit). `DocEdit.vue`: все поля `person`/`property`/`contract`
  (в `schema.ts` добавлены `balkony`/`renovation`/`view`), **repeatable-группа контактов** (add/remove),
  **главная картинка**, выбор собственника (select), сохранение (create/update). Проверено: контакты
  сохраняются массивом. Осталось: **owner typeahead-поиск** и опционально вкладки `Doc`/`Modal`.
- **[x] Owner typeahead**: `OwnerSelect.vue` — поиск собственника по подсказкам (фильтр по загруженным
  персонам), выбор/сброс; подключён в `DocEdit.vue`. Проверено в браузере + e2e.
- **Карточки/список**: `DocList`, `List`, `M/{doc,person,property,contract,picture}`, `S/{doc,person,event,picture}`,
  `oidImage`/`iimg`, `currency`-хелпер.
- **Документ**: `Doc` (модалка+вкладки), `TabView`, `Modal`.
- **[x] Поиск с фильтром по `kind`**: `SearchView.vue` — фильтр person/property/contract (чекбоксы),
  передаётся в `api.searchDocs(q, kind)`. Проверено на API + e2e.
- **[x] Аккаунты (создание пользователя)**: в `App.vue` — опция «Создать» в переключателе → модалка
  (`api.createUser`, `PUT /u`). Проверено в браузере.
- **Мелочи**: `$listeners` → `$attrs`; убрать неиспользуемое; `EnquiryList` — заглушка (как в legacy).
- **Мелочи**: `$listeners` → `$attrs`; убрать неиспользуемое; `EnquiryList` — заглушка (как в legacy).
- **Тесты**: расширить e2e на новые экраны; затем переключение/удаление `legacy-web`.

## Инструменты (prettier + eslint)

Добавлено по образцу `../abook`:
- `.prettierrc`/`.prettierignore`, `.editorconfig`, `.vscode` (format-on-save, eslint, volar).
- `eslint.config.mjs` (flat): JS/MJS/CJS + `@typescript-eslint` + `eslint-plugin-vue` + prettier.
- Скрипты: `npm run lint` / `lint:fix` / `format` / `format:check`.
- `packages/legacy-web` исключён (pug-шаблоны prettier/eslint-plugin-vue не парсят);
  `server/config.js` — локальный (не в git).
- Линт: **0 errors**, 35 warnings (`no-unused-vars` в легаси `.mjs`); format — чисто.

## Сервис внешних данных (`packages/external`) — каркас сделан, календарь отложен

- Получение внешних данных **через RabbitMQ** (RPC по AMQP). Очередь `crm-external`.
- **RPC-контракт**: `{ action: 'productionCalendar', year }` → `{ year, holidays: ['YYYY-MM-DD', ...] }`.
- Первый кейс — **производственный календарь**: каркас + парсер `<table class="cal">` для
  `https://www.consultant.ru/law/ref/calendar/proizvodstvennye/{year}/` (проверено end-to-end: 118 дней 2026).
- **⚠️ Работа по календарю ОТЛОЖЕНА** — точная архитектура/источник не определены. Требования к источнику:
  - **надёжность** (долговременная стабильность структуры/выдачи);
  - **проблема с КонсультантПлюс**: URL не всегда `.../{year}/` (есть `.../2005b` и т.п.) — хардкод года плох;
  - **выбранные источники**: (1) **Портал открытых данных РФ** `7708660670-proizvcalendar` (CSV),
    (2) **КонсультантПлюс/Гарант** (вёрстка статична, парсится BeautifulSoup).
- **Далее (когда вернёмся)**: определить архитектуру подключения к календарю; заменить захардкоженные
  праздники в `packages/web/src/components/Calendar.vue` на данные из `packages/external`.
  Детали источников — в `TODO.md`.