'use strict';

// Inicializa el esquema y los datos iniciales en Azure SQL Database.
// Uso local:
//   $env:SQL_CONNECTION_STRING="Server=tcp:...;Initial Catalog=pedalafondo;..."
//   npm run db:init
// En Azure no hace falta: el servidor ejecuta esto automáticamente al arrancar.

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { sql, hasDatabase, getPool } = require('./db');

async function main() {
  if (!hasDatabase) {
    console.error('Falta SQL_CONNECTION_STRING. Ejemplo:');
    console.error('  Server=tcp:mi-servidor.database.windows.net,1433;Initial Catalog=pedalafondo;Persist Security Info=False;User ID=adminuser;Password=CLAVE;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;');
    process.exitCode = 1;
    return;
  }

  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');

  const pool = await getPool();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();
    const request = new sql.Request(transaction);
    await request.batch(schema);
    await request.batch(seed);
    await transaction.commit();
    console.log('Base de datos inicializada correctamente.');
  } catch (error) {
    await transaction.rollback().catch(() => {});
    console.error('Error al inicializar la base de datos:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.close();
  }
}

main();
