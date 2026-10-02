# Ревью проекта CRM

Части: `crm` (BFF + SPA), `crm-backend-rabbitmq-graphql-mongodb`, `crm-backend-rabbitmq-telegram`.

Дата: 2026-10-03. Просмотрен весь код (`.mjs`, `.vue`, конфиги, скрипты, git-история).
Severity: **P0** — ломает фичу/безопасность, **P1** — заметно ломает, **P2** — мелкое/качество.

---

## 1. Карта проекта

Три независимых git-репозитория, ESM (`*.mjs`), без тестов и без TypeScript.

| Часть | Роль | Стек | Git |
|---|---|---|---|
| `crm` (текущая) | BFF + frontend | Express 4, Mongoose 5, GridFS, SphinxQL (mysql), amqplib, Vue 2 + webpack 5 + pug + bootstrap + vue-formulate | branch `dev`, `github.com/747500/crm` |
| `crm-backend-rabbitmq-graphql-mongodb` | GraphQL-сервис, только по AMQP | graphql 15, graphql-fields-list, Mongoose 5, amqplib | branch `main` |
| `crm-backend-rabbitmq-telegram` | Telegram-бот | node-telegram-bot-api, amqplib, async | branch `main` |

Схема взаимодействия (как задумано):

```
 Vue2 SPA ──HTTP /api/v0──► crm (Express BFF)
                              │  Mongo: документы + сессии + GridFS
                              │  SphinxQL: полнотекстовый поиск
                              ▼
        RabbitMQ (crm-graphql, crm-query, crm_bot_auth, crm_untyped_net_bot)
          ▲                                            │
          │                                            ▼
 graphql-mongodb (GraphQL по AMQP)          telegram-bot (Telegram API)
```

Идея хорошая и цельная: SPA → BFF (сессии/файлы/поиск) → доменный GraphQL-сервис
через AMQP request/response с `correlationId`, плюс воркер-бот на AMQP. Ровно то,
что хочется «довести до рабочего состояния».

## 2. Что сделано хорошо

- **Сервисный singleton** (`services/index.mjs` во всех трёх частях): единый `Run()`,
  последовательная инициализация, внятные логи.
- **RPC поверх AMQP** с `correlationId` + `replyTo` + temporary exclusive queue
  (`server/services/rabbitmq.mjs`) — каноничный паттерн, близко к учебнику.
- **Discriminated documents** (`Doc` + `Person|Property|Contract`) с `discriminatorKey`
  и кастомными `timestamps: { createdAt: 'ctime', updatedAt: 'mtime' }`.
- **Виртуал `fts`** (`model/virtuals/fts.mjs`) — самодельный сбор индексируемого текста.
- **`example-config` + `.gitignore`** на реальные конфиги — правильная привычка.

---

## 3. Найденные баги и проблемы

### P0 — безопасность

**[S1] «Вход» без пароля — сознательно отключено для отладки (подтверждено автором).**
`server/middleware/user/Session.mjs:4-10` — `POST /api/v0/u/set` берёт `req.body._id` и кладёт
в `req.session.user`; в UI есть переключатель пользователей (`app/components/Accounts.vue`).
Для отладки это удобно, но в прод так нельзя. Рекомендация: включать только по флагу
(`ALLOW_USER_SWITCH=true` в dev-`.env`), а в проде требовать реальную аутентификацию.
Плюс `/u` смонтирован ДО `mw.user.Load` (`server/routes/index.mjs:14-15`) — эти ручки вне зоны auth.

**[S2] Утёкший токен Telegram-бота в git-истории.**
`crm-backend-rabbitmq-telegram/config.mjs:5` содержит реальный токен `1547635292:AAE-...`.
Сейчас файла нет в HEAD (в `.gitignore`), НО коммитом `fcc7a55` он был закоммичен, позже
есть `2802be2 "change compromised token"`. Токен надо считать скомпрометированным —
**отозвать/перевыпустить у @BotFather**, а не просто заменить в конфиге.

### P0 — функциональность

**[B1] Telegram-auth: callback вызывается дважды (двойной `ack`).**
`server/services/mongodb.mjs:27-55`:
```js
User.findOne({ _id: oid }).then(user => { ...; return user.save() })
  .catch(err => callback(err))

callback()          // ← вызывается СРАЗУ и ВСЕГДА, вне промиса
```
`callback()` стоит после промис-цепочки синхронно. Колбэк `onBotAuth`
(`server/services/rabbitmq.mjs:117-139`) сработает немедленно (до сохранения), а при ошибке —
ещё и второй раз из `.catch`. Второй вызов = повторный `channel.ack(message)` (ошибка канала
«unknown delivery tag») и повторный `sendToQueue`. Привязка Telegram (`/auth <id>`) будет плавающе ломаться.

### P1 — заметные функциональные баги

**[B2] Сервис `graphql` в BFF ссылается на несуществующую переменную.**
`server/services/graphql.mjs:28,68` используют `queryUsers`, которой в файле нет (объявлена
только в `services/events.mjs`) → `ReferenceError` при любом вызове `services.graphql(...)`.
Плюс `:49` `reject(errors)` — `errors` не определена (нужно `reply.errors`).

**[B3] GraphQL-резолверы падают на «не найдено»/списках.**
- `graphql/resolvers/doc.mjs:24`, `user.mjs:31` — `result.toObject()` без проверки `null` → `TypeError`.
- `resolvers/docs.mjs:20` возвращает «сырые» mongoose-документы (без `id`/`version`/`__typename`),
  а схема объявляет `id: ID!`/`ctime: String!` и `union Docs` без `__typename` не резолвится.
- `union Docs = Person | Property` (`graphql/schema.mjs:61`) не включает `Contract`.

**[B4] Создание нового документа во фронте, скорее всего, не переходит на форму.**
`app/components/DocList.vue:108-112` `createDoc()` → `push({ name: this.$route.meta.kind })`.
`meta.kind` = `person|property|contract`, но это имена **дочерних** маршрутов с обязательным
`:id` (`app/router.js:82-89`); vue-router 3 не соберёт путь без `params.id`.

**[B5] Сломанный build-скрипт фронта.** `package.json:7` задаёт абсолютный
`--entry /home/native/src/crm/app/main.js` (директория `.../my/crm`) → `npm run build` из коробки
не работает. `vue.config.js` (`runtimeCompiler`) не применяется — сборка идёт webpack'ом напрямую.

**[B6] Переход на несуществующий маршрут.** `app/main.js:83-85` — `push({ name: 'browse' })`,
маршрута `browse` нет → предупреждение, начальный переход не срабатывает.

**[B7] Незадекларированные/лишние зависимости.**
- `body-parser` импортируется (`server/services/express.mjs:29`), но в `package.json` его нет —
  работает только транзитивно от Express.
- В `devDependencies`, хотя нужны в рантайме: `@braid/vue-formulate`, `bootstrap`, `async`,
  `moment-business-days`.
- Мёртвые: `connect-mongodb-session`, `sphinxapi` (импорт закомментирован), `mongodb` рядом с `mongoose`.
- `lodash` подключён CDN в `app/index.html:18`, но нигде не используется.

### P2 — корректность и мелочи

- **[B8] Коллизия Sphinx-id.** `middleware/doc/Search/Add.mjs:11` и `Update.mjs:11` берут
  `id = doc.ctime.getTime()` (мс). Два документа в одну мс → один id в RT-индексе. `Add` делает
  `INSERT`, `Update` — `DELETE`+`REPLACE`; надёжнее единообразно `REPLACE`.
- **[B9] `fts` не индексирует массивы.** `model/virtuals/fts.mjs:25-32` рекурсит только в ключ,
  равный `this._doc.kind`; `contact: [Contact]` — массив → телефоны/почта в поиск НЕ попадают.
  Параметр `function fts (a)` не используется.
- **[B10] SphinxQL-соединение.** `server/services/sphinx.mjs:15-19` использует `localAddress`
  вместо `host`, без `user`; работает лишь по случайности на localhost. `init()` резолвится сразу.
- **[B11] Превью файлов.** `middleware/files/thumbnails/StreamContent.mjs:27` —
  `contentType.split('/')` упадёт без contentType; `Last-Modified` ставится до проверки «это картинка?»;
  `querystring.escape(undefined)` → строка `"undefined"`.
- **[B12] Загрузка файла.** `middleware/files/Upload.mjs:27` — `new Date(req.headers['last-modified'])`
  без заголовка → `Invalid Date`; `querystring.unescape(caption)` без caption → `"undefined"`.
  Legacy-модуль `querystring`.
- **[B13] Метаданные файла.** `middleware/files/meta/Save.mjs:17` требует строго `application/json`;
  `application/json; charset=utf-8` получит ошибку.
- **[B14] Нет error-handling middleware.** Нигде нет `app.use((err, req, res, next) => ...)`,
  хотя middleware массово вызывают `next(err)`. `sendResultJSON` без `next` и без проверки
  `res.locals.Result`.
- **[B15] `services/events.mjs` — пустышка** (раз в минуту печатает строку). `services/graphql.mjs`
  и `events.mjs` через `process.nextTick` делают демо-запросы на старте — отладочный шум.
- **[B16] `Doc.vue` без null-guard.** `app/components/Doc.vue:119` — `this.tabView.component`
  при `tabView === null` (гонка с `TabView`) → возможный `TypeError`.
- **[B17] `FileData.vue`** — computed `key()` использует `this.lastModified`, которого нет
  (нужно `this.model.mtime`) → `NaN`.
- **[B18] `doc/List.mjs`** без пагинации/`lean()`; `doc/Events.mjs` — `req.query.yearmonth` может
  быть `undefined` (`moment(undefined)` = «сейчас»), `age = 1 + diff(years)` приблизителен.
- **[B19] Сессии.** `resave: true`, `saveUninitialized: true`, `cookie.secure: false`
  (`server/services/express.mjs:74-79`) — для прода небезопасно/шумно.
- **[B20] Конфиги очередей расходятся.** `crm` использует `crm-graphql`, `crm-query`,
  `crm_bot_auth`, `crm_untyped_net_bot`; в примерах `crm_bot_messages`. Пример и дефолт
  расходятся → «по README» не соединится. Плюс `botQueue` объявлен `durable: true` и
  `exclusive: true` одновременно (противоречиво).
- **[B21] Нет graceful shutdown для AMQP/Telegram** (SIGTERM только у express/mongo/sphinx),
  нет reconnect-логики при падении RabbitMQ. Также в `rabbitmq.mjs` записи в
  `this.graphqlCorrelation` при потере ответа не удаляются никогда → утечка.
- **[B22] Логи и PII.** Везде `console.log` с дампами документов/сообщений; бот пишет полные
  сообщения в `msglog/<id>/<date>` (PII).
- **[B23] Устаревшие/EOL-модули** (под TODO «обновить модули»): mongoose 5.13.7 + mongodb 3.6
  (EOL, Node 22 официально не поддерживается), express 4.17.1, graphql 15.5.1, amqplib 0.7,
  sharp 0.28, `mysql` (не `mysql2`), Vue 2.6 (EOL), `moment`.

---

## 4. Соотнесение с TODO

- **Перенос + npm workspaces.** У трёх частей три разных `.git`. Нужно решить: (а) монорепо
  `packages/bff`, `packages/graphql-clickhouse`, `packages/telegram-bot` с чистым git, или
  (б) перенос историй через subtree/submodule. Иначе workspaces соберётся, но истории разъедутся.
- **e2e.** Тестов нет вообще (`"test": "… && exit 1"` во всех трёх). Нужны реальные зависимости:
  RabbitMQ, ClickHouse, мок Telegram. Разумно Playwright (UI) + vitest/jest (сервисы) + testcontainers.
- **TypeScript.** Удобно послойно: `types`/`model` → `services` → `middleware`/`routes`, затем фронт.
- **Mongo → ClickHouse — НЕ drop-in.** ClickHouse колоночная OLAP: нет транзакций/`findOne`/`updateOne`
  в mongo-смысле, нет `ObjectId`, нет GridFS, нет change streams; `UPDATE/DELETE` — асинхронные
  мутации (`ALTER TABLE ... UPDATE`), «последнее состояние» — через `ReplacingMergeTree(version)`
  + `ORDER BY id`. GridFS → отдельная тема («ClickHouse с файлами»), сессии → Redis/SQLite/таблица.
  Резолверы переписываются на SQL. Поиск — либо Sphinx, либо экспериментальные текстовые индексы CH.
- **RabbitMQ до рабочего состояния.** Починить B1/B2/B20, добавить reconnect, единые
  durable/exclusive, таймауты и очистку `graphqlCorrelation`, dead-letter, типизированный контракт,
  graceful shutdown.

## 5. Открытые вопросы (для обсуждения)

1. Монорепо: обнулять git-историю или переносить (subtree/submodule)?
2. ClickHouse жёстко (убрать Sphinx/GridFS/сессии) или «рядом с Mongo» (dual-write)?
3. Фронт: Vue 2 (EOL, но уже написан) оставить переходно или сразу Vue 3 + TS?
4. e2e-объём: happy-path UI или ещё AMQP-контракт и Telegram-флоу через моки?
5. Приоритеты: сначала «поднять как есть» (модули + workspaces + запуск), потом миграции —
   или сразу TS/ClickHouse?