const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/verdevital.sqlite');

module.exports = db;
