'use strict';

const sql = require('mssql');

const rawConnectionString = (process.env.SQL_CONNECTION_STRING || process.env.DATABASE_URL || '').trim();
const looksLikePostgres = /^postgres(ql)?:\/\//i.test(rawConnectionString);

function normalizeConnectionString(value) {
  let connectionString = value.trim();
  if (!/encrypt\s*=/i.test(connectionString)) connectionString += ';Encrypt=true';
  if (!/trustservercertificate\s*=/i.test(connectionString)) connectionString += ';TrustServerCertificate=false';
  return connectionString;
}

let config = null;
let parseError = null;

if (rawConnectionString && !looksLikePostgres) {
  try {
    config = sql.ConnectionPool.parseConnectionString(normalizeConnectionString(rawConnectionString));
    config.options = { ...config.options, encrypt: true, trustServerCertificate: false };
  } catch (error) {
    parseError = error;
    console.error('[db] cadena de conexión inválida:', error.message);
  }
}

const pool = config ? new sql.ConnectionPool(config) : null;
let connectPromise = null;

async function getPool() {
  if (!pool) throw parseError || new Error('SQL_CONNECTION_STRING no está configurada.');
  if (pool.connected) return pool;
  if (!connectPromise) {
    connectPromise = pool
      .connect()
      .then(() => pool)
      .catch((error) => {
        connectPromise = null;
        throw error;
      });
  }
  return connectPromise;
}

async function dbQuery(text, inputs = {}) {
  const currentPool = await getPool();
  const request = currentPool.request();
  for (const [name, value] of Object.entries(inputs)) request.input(name, value);
  const result = await request.query(text);
  return result.recordset || [];
}

module.exports = { sql, getPool, dbQuery, hasDatabase: Boolean(config) };
