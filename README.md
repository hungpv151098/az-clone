# Node-Typescript-Base

![Nodejs][nodejs-image]
![Expressjs][expressjs-image]
![Typescript][typescript-image]
![Mysql][mysql-image]

# Cấu trúc thư mục

```
|—— api
|    |—— config
|        |—— index.ts
|    |—— constants
|    |—— controllers
|        |—— index.controller.ts
|    |—— databases
|        |—— index.ts
|    |—— dtos
|    |—— exceptions
|        |—— HttpException.ts
|    |—— interfaces
|        |—— routes.interface.ts
|    |—— logs
|        |—— debug
|        |—— error
|    |—— middlewares
|        |—— error.middleware.ts
|        |—— validation.middleware.ts
|    |—— models
|    |—— routes
|        |—— index.routes.ts
|    |—— services
|    |—— utils
|        |—— logger.ts
|        |—— morgan.ts
|        |—— rateLimiter.ts
|        |—— redis.ts
|        |—— utils.ts
|        |—— validateEnv.ts
|—— app.ts
|—— infrastructure
|    |—— cronjobs
|        |—— index.cron.ts
|    |—— queues
|        |—— queueBase.queue.ts
|—— server.ts
```

- Folder API chứa các chức năng chính bao gồm : controllers , model, routes, services, utils.
- Folder Infrastructure chứa các chức năng bao gồm job và queue.

# Luồng code

```
route -> middleware -> controller -> services -> controllers ->return
```

## Route

```
- Điều hướng
- CRUD : get , post, put ,delete , patch
```

## Middleware

```
- Xác thực auth
- Phân quyền
```

## Controller

```
- Xử lý dữ liệu từ request để gửi vào Services
```

## Services

```
- Nhận request phía controllers
- Xử lý business logic phía models : Query , update , delete dữ liệu DB
```

# Launch

Cài đặt các dependencies của project

```
- yarn install
```

## Chạy dev

```
- yarn dev
```

## migration

- Command: yarn database +
- Danh sách command for database:

```
  db:migrate                                    Run pending migrations
  db:migrate:status                             List the status of all migrations
  db:migrate:undo                               Reverts a migration
  db:migrate:undo:all                           Revert all migrations ran
  db:seed                                       Run specified seeder
  db:seed:undo                                  Deletes data from the database
  db:seed:all                                   Run every seeder
  db:seed:undo:all                              Deletes data from the database
  migration:generate  --name=migration_name     Generates a new migration file      [aliases: migration:create]
  seed:generate       --name=seeder_name        Generates a new seed file
```

-Tài liệu: https://www.npmjs.com/package/sequelize-cli

<!-- Markdown link && image -->

[nodejs-image]: https://user-content.gitlab-static.net/7be55d2c332a186f74008afa6e7f827287994f46/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6e6f64652e6a732d3644413535463f7374796c653d666f722d7468652d6261646765266c6f676f3d6e6f64652e6a73266c6f676f436f6c6f723d7768697465
[expressjs-image]: https://user-content.gitlab-static.net/a6cf16ca1b3463c1be7b7a4ce33796a6dac40ada/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f657870726573732e6a732d2532333430346435392e7376673f7374796c653d666f722d7468652d6261646765266c6f676f3d65787072657373266c6f676f436f6c6f723d253233363144414642
[typescript-image]: https://user-content.gitlab-static.net/b9c6e2d6dc605277866e1946ad6b2c1619dd0dc6/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f747970657363726970742d2532333030374143432e7376673f7374796c653d666f722d7468652d6261646765266c6f676f3d74797065736372697074266c6f676f436f6c6f723d7768697465
[mysql-image]: https://user-content.gitlab-static.net/ef0f46b0615395264f55e389c1b3c766b48b3137/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6d7973716c2d2532333030662e7376673f7374796c653d666f722d7468652d6261646765266c6f676f3d6d7973716c266c6f676f436f6c6f723d7768697465

## Build model

```
yarn build:models
```

## Env dev  

Install the dependencies

```
yarn install
```
- Update .env
```
cp .env.example .env
```

Migration database
```
yarn database:local db:migrate
```

- Start development server
```
yarn dev
```
# Env production

Install the dependencies

```
yarn install
```
- Update .env
```
cp .env.example .env
```
- Config and update .env to production : Add NODE_ENV=prod
Migration database
```
yarn database db:migrate
```

- Start production server
```
yarn format && node index.js
```


