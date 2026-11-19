'use strict';

const sql = require('mssql');

const rawConnectionString = (process.env.SQL_CONNECTION_STRING || process.env.DATABASE_URL || '').trim();

// Ignora cadenas de PostgreSQL para no confundir configuraciones antiguas.
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
    config.options = {
      ...config.options,
      // Azure SQL Database siempre exige TLS con certificado válido.
      encrypt: true,
      trustServerCertificate: false,
    };
  } catch (error) {
    parseError = error;
    console.error('[db] cadena de conexión inválida:', error.message);
  }
}

const hasDatabase = Boolean(config);
const pool = config ? new sql.ConnectionPool(config) : null;
let connectPromise = null;

if (pool) {
  pool.on('error', (error) => {
    console.error('[db] error inesperado en el pool:', error.message);
  });
}

/**
 * Devuelve el pool conectado. Reintenta la conexión si Azure SQL la cerró por inactividad.
 */
async function getPool() {
  if (!pool) {
    throw parseError || new Error('SQL_CONNECTION_STRING no está configurada.');
  }
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

module.exports = { sql, pool, hasDatabase, getPool };
