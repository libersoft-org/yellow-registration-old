const Database = require('./database');

const db = new Database();

async function createDatabase() {
  await db.open();
  db.close();
}

async function createUsersTable() {
  const createTableSql = `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    username VARCHAR(100) NOT NULL UNIQUE, 
    pass VARCHAR(255) NOT NULL, 
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    phone VARCHAR(100) NOT NULL UNIQUE,
    countryCode VARCHAR(15) NOT NULL,
    birthdate VARCHAR(50) NOT NULL,
    gender VARCHAR(32) NOT NULL,
    optId VARCHAR(100) NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

  await db.write(createTableSql);
}

async function createVerificationTable() {
  const createTableSql = `CREATE TABLE IF NOT EXISTS verifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    countryCode VARCHAR(20) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    confirmed BIT,
    confirmedTimestamp TIMESTAMP,
    optId VARCHAR(50),
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

  await db.write(createTableSql);
}

async function initDB() {
  await createDatabase();
  await createUsersTable();
  await createVerificationTable();
  console.log('DB initialized');
}

initDB();
