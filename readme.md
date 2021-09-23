Express and MySQL Application

## Get Started

### 1. Prerequisites

- [NodeJs](https://nodejs.org/en/)
- [NPM](https://npmjs.org/) - Node package manager
- [MySQL](https://www.mysql.com/downloads/) - Relational database management system (RDBMS)

### 2. Installation

On the command prompt run the following commands:

``` 
 $ git clone https://github.com/Bikranshu/mome-web-app.git
 $ cd mome-web-app
 $ cp .env.example .env (edit it with your secret key and database information)
 $ npm install
 $ npm run migrate
 $ npm run seed
 ```
 Finally, start and build the application:
 
 ```
 $ npm run start (production)
 $ npm run start:dev (development)
```

List of NPM Commands:
 
  ```
  $ npm run lint       # linting
  $ npm run clean      # remove dist and node_modules folder and install dependencies
 ```

MailTrap Setup

  ```
  Create an account on mailtrap
  Copy the config params in the .env file
  ```

### 3. Usage

URL : http://localhost:3000/

Navigate to http://localhost:3000/swagger/ for the API documentation.

### 4. Useful Link
- Web framework for Node.js - [Express](http://expressjs.com/)
- JavaScript ORM  for Node.js - [Bookshelf](http://bookshelfjs.org/)
- SQL Query Builder for Postgres, MSSQL, MySQL, MariaDB, SQLite3, and Oracle - [Knex](http://knexjs.org/)
- JSON Web Tokens(jwt) - [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- Logging Library - [Winston](https://www.npmjs.com/package/winston)
- Object schema validation  - [Joi](https://www.npmjs.com/package/joi)
- API documentation using [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc) and [swagger-ui](https://www.npmjs.com/package/swagger-ui)
- Environment configuration - [dotenv](https://www.npmjs.com/package/dotenv)
- Code linting tool - [ESLint](http://eslint.org/)
- Code formatter - [Prettier](https://www.npmjs.com/package/prettier)
- Fake SMPT - [Mailtrap](https://mailtrap.io/r)