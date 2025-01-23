# NodeJs Express Starter Kit
Node Js Express Starter Kit is perfect for developers who have previously used the Laravel Framework or similar Framework models ORM and MVC, and is easy to modify according to the developer's wishes and needs.

## Install Library ##
```plaintext
npm install
```

## Run App ##
```plaintext
npm run dev
```
OR
```plaintext
node app.js
```

## Structure ##
```plaintext
Project/
├── app/
│   ├── config/
│   │   └── config.js
│   ├── controller/
│   │   ├── authController.js
│   │   ├── roleController.js
│   │   └── userController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── tokenBlackList.js
│   ├── models/
│   │   ├── index.js
│   │   ├── roles.js
│   │   └── users.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── roleRoutes.js
│   │   └── userRoutes.js
│   └── seeders/
│       ├── 20240824062807-users.js
│       └── 20240825024126-roles.js
├── .env.example
├── app.js
├── generate-secret.js
└── package.json
```

## Sequelize ##
Make Migration
```plaintext
npx sequelize-cli migration:generate --name users
```
Run Migration
```plaintext
npx sequelize-cli db:migrate
```

Make Seeder
```plaintext
npx sequelize-cli seed:generate --name users
```
Run Seeder
```plaintext
npx sequelize-cli db:seed:all
```

Sedeer One Run
```plaintext
npx sequelize-cli db:seed --seed 20240825024126-roles.js
```
```plaintext
npx sequelize-cli db:seed --seed 20240824062807-users.js
```

Make Model and Migration
```plaintext
npx sequelize-cli model:generate --name users --attributes name:string,email:string,password:string,role:string
```

# Make JWT Secret
```plaintext
node generate-secret.js
```

## Frontend ##
[Starter Kit Frontend React JS](https://github.com/SyahrulRomadoni/reactjs-vite-starter-kit)

## Library ##
- express
- jsonwebtoken
- bcryptjs
- dotenv
- sequelize
- sequelize-cli
- mysql2 or pg and pg-hstore for connection to MySQL or PostgreSQL.
- CORS
