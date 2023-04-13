/* original file / database_sqllite.js */

const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const Encryption = require('./encryption');

class Database {
  constructor() {
    this.dbFilePath = 'nemp_registration.db';
    this.db = null;
  }

  async open() {
    this.db = await sqlite.open({ filename: this.dbFilePath, driver: sqlite3.Database });
  }

  close() {
    this.db.close();
  }

  async read(query, params = []) {
    try {
      await this.open();
      const res = await this.db.all(query, params, (err, success) => {
        if (err) throw new Error(err);
      });
      this.close();
      return res;
    } catch (error) {
      console.error(`[DB][READ] ${error.message}`);
    }
  }

  async write(query, params = []) {
    try {
      await this.open();
      await this.db.run(query, params, (err) => {
        if (err) {
          throw new Error(err.message);
        }
      });
      this.close();
    } catch (err) {
      console.error(`[DB][WRITE] ${err.message}`);
      return {
        error: err,
      };
    }
  }

  async delete(query, params = []) {
    try {
      await this.open();
      await this.db.run(query, params, (err) => {
        if (err) {
          throw new Error(err.message);
        }
      });
      this.close();
    } catch (err) {
      console.error(`[DB][DELETE] ${err.message}`);
      return {
        error: err,
      };
    }
  }
}

module.exports = Database;
