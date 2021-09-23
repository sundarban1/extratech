require('dotenv').config();

export default {
  client: process.env.DB_CLIENT || 'mysql',
  connection: {
    host: process.env.DB_HOST || 'us-cdbr-east-02.cleardb.com',
    user: process.env.DB_USER || 'b1745730ce732e',
    password: process.env.DB_PASSWORD || '576e55e0',
    database: process.env.DB_NAME || 'heroku_7fc69e57bb86943',
    charset: 'utf8',
    socketPath: process.env.SOCKET_PATH,
  },
  migrations: {
    tableName: 'migrations',
    directory: process.cwd() + '/src/migrations',
  },
  seeds: {
    directory: process.cwd() + '/src/seeds',
  },
  debug: true,
};
