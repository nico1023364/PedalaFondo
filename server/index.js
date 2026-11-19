'use strict';

require('dotenv').config();

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const express = require('express');

const { sql, hasDatabase, getPool } = require('./db');
const queries = require('./queries');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DIST_DIR = process.env.STATIC_DIR || path.join(__dirname, '..', 'dist', 'myapp', 'browser');
const ADMIN_TOKEN = (process.env.ADMIN_TOKEN || '').trim();
const AUTO_MIGRATE = (process.env.AUTO_MIGRATE || 'true').toLowerCase() !== 'false';

app.disable('x-powered-by');
app.use(express.json({ limit: '64kb' }));

// CORS: en producción el front y el API comparten origen; esto permite probar el API aparte.
app.use('/api', (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Token');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

const priceFormatter = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });

function toDateString(value) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function mapPlan(row) {
  return {
    id: row.id,
    name: row.nombre,
    description: row.descripcion,
    price: priceFormatter.format(Number(row.precio)),
  };
}

function mapNoticia(row) {
  return {
    id: row.id,
    title: row.titulo,
    content: row.resumen,
    image: row.imagen,
    link: row.enlace || null,
    date: toDateString(row.publicado_en),
  };
}

function mapCompetencia(row) {
  return {
    id: row.id,
    name: row.nombre,
    date: String(row.anio),
    description: row.descripcion,
    image: row.imagen,
  };
}

function mapMultimedia(row) {
  return {
    id: row.id,
    title: row.titulo,
    image: row.imagen,
    link: row.enlace || '#',
  };
}

function mapInscripcion(row) {
  return {
    id: Number(row.id),
    nombre: row.nombre,
    apellidos: row.apellidos,
    telefono: row.telefono,
    ciudad: row.ciudad,
    email: row.email,
    plan: row.plan,
    creadoEn: row.creado_en instanceof Date ? row.creado_en.toISOString() : row.creado_en,
  };
}

async function dbQuery(text, inputs = {}) {
  const currentPool = await getPool();
  const request = currentPool.request();
  for (const [name, value] of Object.entries(inputs)) {
    request.input(name, value);
  }
  const result = await request.query(text);
  return result.recordset || [];
}

function dbUnavailable(res, message) {
  return res.status(503).json({
    error: 'database_unavailable',
    message: message || 'La base de datos no está configurada o no responde.',
  });
}

function dbRoute(handler) {
  return async (req, res) => {
    if (!hasDatabase) return dbUnavailable(res, 'Falta la variable SQL_CONNECTION_STRING.');
    try {
      await handler(req, res);
    } catch (error) {
      console.error(`[api] ${req.method} ${req.originalUrl}:`, error.message);
      if (!res.headersSent) dbUnavailable(res, 'No fue posible consultar la base de datos.');
    }
  };
}

function safeTokenEquals(received) {
  if (!ADMIN_TOKEN) return false;
  const a = Buffer.from(String(received || ''));
  const b = Buffer.from(ADMIN_TOKEN);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function cleanString(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

// ------------------------------- API ---------------------------------------

app.get('/api/health', async (req, res) => {
  if (!hasDatabase) {
    return res.json({ status: 'ok', database: 'not-configured', uptime: process.uptime() });
  }
  try {
    const rows = await dbQuery('SELECT GETDATE() AS ahora');
    return res.json({
      status: 'ok',
      database: 'up',
      time: rows[0] ? rows[0].ahora : null,
      uptime: process.uptime(),
    });
  } catch (error) {
    console.error('[api] health:', error.message);
    return res.status(503).json({ status: 'degraded', database: 'down', message: error.message });
  }
});

app.get('/api/planes', dbRoute(async (req, res) => {
  const rows = await dbQuery(queries.planes);
  res.json(rows.map(mapPlan));
}));

app.get('/api/noticias', dbRoute(async (req, res) => {
  const rows = await dbQuery(queries.noticias);
  res.json(rows.map(mapNoticia));
}));

app.get('/api/competencias', dbRoute(async (req, res) => {
  const rows = await dbQuery(queries.competencias);
  res.json(rows.map(mapCompetencia));
}));

app.get('/api/multimedia', dbRoute(async (req, res) => {
  const rows = await dbQuery(queries.multimedia);
  res.json(rows.map(mapMultimedia));
}));

app.get('/api/estadisticas', dbRoute(async (req, res) => {
  const rows = await dbQuery(queries.estadisticas);
  const row = rows[0] || {};
  res.json({
    planes: Number(row.planes || 0),
    noticias: Number(row.noticias || 0),
    competencias: Number(row.competencias || 0),
    multimedia: Number(row.multimedia || 0),
    inscripciones: Number(row.inscripciones || 0),
  });
}));

app.post('/api/inscripciones', dbRoute(async (req, res) => {
  const body = req.body || {};
  const nombre = cleanString(body.nombre ?? body.name, 80);
  const apellidos = cleanString(body.apellidos ?? body.lastname, 80);
  const telefono = cleanString(body.telefono ?? body.phone, 30);
  const ciudad = cleanString(body.ciudad ?? body.city, 80);
  const email = cleanString(body.email, 160);
  const plan = cleanString(body.plan ?? body.selectedPlan, 80);

  const missing = [];
  if (!nombre) missing.push('nombre');
  if (!apellidos) missing.push('apellidos');
  if (!telefono) missing.push('telefono');
  if (!ciudad) missing.push('ciudad');
  if (!email) missing.push('email');
  if (!plan) missing.push('plan');

  if (missing.length) {
    return res.status(400).json({
      error: 'invalid_request',
      message: `Faltan campos obligatorios: ${missing.join(', ')}.`,
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res.status(400).json({ error: 'invalid_email', message: 'El correo electrónico no es válido.' });
  }

  const planRows = await dbQuery(queries.planActivo, { plan });
  if (planRows.length === 0) {
    return res.status(400).json({ error: 'invalid_plan', message: 'El plan seleccionado no existe.' });
  }

  const createdRows = await dbQuery(queries.insertInscripcion, {
    nombre,
    apellidos,
    telefono,
    ciudad,
    email,
    plan,
  });

  const created = createdRows[0] || {};
  res.status(201).json({
    id: Number(created.id),
    creadoEn: created.creado_en instanceof Date ? created.creado_en.toISOString() : created.creado_en,
    message: 'Inscripción registrada correctamente.',
  });
}));

app.get('/api/inscripciones', dbRoute(async (req, res) => {
  if (!safeTokenEquals(req.get('x-admin-token'))) {
    return res.status(401).json({
      error: 'unauthorized',
      message: 'Envía el token de administración en la cabecera X-Admin-Token.',
    });
  }
  const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200);
  const rows = await dbQuery(queries.inscripciones, { limit });
  res.json(rows.map(mapInscripcion));
}));

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'not_found', message: 'Ruta de API no encontrada.' });
});

// ---------------------------- Frontend estático ----------------------------

const indexFile = path.join(DIST_DIR, 'index.html');

app.use(express.static(DIST_DIR, { index: false, maxAge: '1h' }));

app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  if (!fs.existsSync(indexFile)) {
    return res
      .status(404)
      .type('text/plain')
      .send('Compila el frontend con "npm run build" o ejecuta "npm run dev" para desarrollo.');
  }
  return res.sendFile(indexFile);
});

// ------------------------------ Arranque -----------------------------------

async function migrate() {
  if (!hasDatabase || !AUTO_MIGRATE) return;

  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');

  const currentPool = await getPool();
  const transaction = new sql.Transaction(currentPool);

  await transaction.begin();
  try {
    const request = new sql.Request(transaction);
    // Evita carreras si arrancan varias instancias a la vez.
    await request.batch(`
      EXEC sp_getapplock
        @Resource = N'pedalafondo_init',
        @LockMode = 'Exclusive',
        @LockOwner = 'Transaction',
        @LockTimeout = 60000;
    `);
    await request.batch(schema);
    await request.batch(seed);
    await transaction.commit();
    console.log('[db] esquema y datos iniciales listos');
  } catch (error) {
    await transaction.rollback().catch(() => {});
    throw error;
  }
}

app.listen(PORT, () => {
  console.log(`[web] Kilómetro Cero escuchando en el puerto ${PORT}`);
  if (!hasDatabase) {
    console.warn('[db] SQL_CONNECTION_STRING no definida: el API responderá 503 y el front usará datos locales.');
    return;
  }
  migrate().catch((error) => console.error('[db] error al inicializar:', error.message));
});

module.exports = app;
