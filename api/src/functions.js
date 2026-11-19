'use strict';

const crypto = require('crypto');
const { app } = require('@azure/functions');
const { dbQuery, hasDatabase } = require('./db');
const queries = require('./queries');

const ADMIN_TOKEN = (process.env.ADMIN_TOKEN || '').trim();
const priceFormatter = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });

function toDateString(value) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function iso(value) {
  return value instanceof Date ? value.toISOString() : value;
}

function unauthorized() {
  return {
    status: 401,
    jsonBody: { error: 'unauthorized', message: 'Envía el token en la cabecera X-Admin-Token.' },
  };
}

function dbError(context, error) {
  context.log.error('Error de base de datos:', error.message);
  return {
    status: 503,
    jsonBody: { error: 'database_unavailable', message: 'No fue posible consultar la base de datos.' },
  };
}

function noDatabase() {
  return {
    status: 503,
    jsonBody: { error: 'database_unavailable', message: 'Falta SQL_CONNECTION_STRING.' },
  };
}

function safeTokenEquals(received) {
  if (!ADMIN_TOKEN) return false;
  const a = Buffer.from(String(received || ''));
  const b = Buffer.from(ADMIN_TOKEN);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function cleanString(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

app.http('health', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'health',
  handler: async (request, context) => {
    context.log('health');
    if (!hasDatabase) {
      return { status: 200, jsonBody: { status: 'ok', database: 'not-configured' } };
    }
    try {
      const rows = await dbQuery('SELECT GETDATE() AS ahora');
      return { status: 200, jsonBody: { status: 'ok', database: 'up', time: rows[0]?.ahora } };
    } catch (error) {
      return { status: 503, jsonBody: { status: 'degraded', database: 'down', message: error.message } };
    }
  },
});

app.http('planes', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'planes',
  handler: async (request, context) => {
    if (!hasDatabase) return noDatabase();
    try {
      const rows = await dbQuery(queries.planes);
      return {
        status: 200,
        jsonBody: rows.map((row) => ({
          id: row.id,
          name: row.nombre,
          description: row.descripcion,
          price: priceFormatter.format(Number(row.precio)),
        })),
      };
    } catch (error) {
      return dbError(context, error);
    }
  },
});

app.http('noticias', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'noticias',
  handler: async (request, context) => {
    if (!hasDatabase) return noDatabase();
    try {
      const rows = await dbQuery(queries.noticias);
      return {
        status: 200,
        jsonBody: rows.map((row) => ({
          id: row.id,
          title: row.titulo,
          content: row.resumen,
          image: row.imagen,
          link: row.enlace || null,
          date: toDateString(row.publicado_en),
        })),
      };
    } catch (error) {
      return dbError(context, error);
    }
  },
});

app.http('competencias', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'competencias',
  handler: async (request, context) => {
    if (!hasDatabase) return noDatabase();
    try {
      const rows = await dbQuery(queries.competencias);
      return {
        status: 200,
        jsonBody: rows.map((row) => ({
          id: row.id,
          name: row.nombre,
          date: String(row.anio),
          description: row.descripcion,
          image: row.imagen,
        })),
      };
    } catch (error) {
      return dbError(context, error);
    }
  },
});

app.http('multimedia', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'multimedia',
  handler: async (request, context) => {
    if (!hasDatabase) return noDatabase();
    try {
      const rows = await dbQuery(queries.multimedia);
      return {
        status: 200,
        jsonBody: rows.map((row) => ({
          id: row.id,
          title: row.titulo,
          image: row.imagen,
          link: row.enlace || '#',
        })),
      };
    } catch (error) {
      return dbError(context, error);
    }
  },
});

app.http('estadisticas', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'estadisticas',
  handler: async (request, context) => {
    if (!hasDatabase) return noDatabase();
    try {
      const rows = await dbQuery(queries.estadisticas);
      const row = rows[0] || {};
      return {
        status: 200,
        jsonBody: {
          planes: Number(row.planes || 0),
          noticias: Number(row.noticias || 0),
          competencias: Number(row.competencias || 0),
          multimedia: Number(row.multimedia || 0),
          inscripciones: Number(row.inscripciones || 0),
        },
      };
    } catch (error) {
      return dbError(context, error);
    }
  },
});

app.http('crearInscripcion', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'inscripciones',
  handler: async (request, context) => {
    if (!hasDatabase) return noDatabase();
    let body;
    try {
      body = await request.json();
    } catch {
      return { status: 400, jsonBody: { error: 'invalid_request', message: 'JSON inválido.' } };
    }

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
      return {
        status: 400,
        jsonBody: { error: 'invalid_request', message: `Faltan campos: ${missing.join(', ')}.` },
      };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return { status: 400, jsonBody: { error: 'invalid_email', message: 'Correo no válido.' } };
    }

    try {
      const planRows = await dbQuery(queries.planActivo, { plan });
      if (!planRows.length) {
        return { status: 400, jsonBody: { error: 'invalid_plan', message: 'El plan no existe.' } };
      }
      const created = await dbQuery(queries.insertInscripcion, {
        nombre,
        apellidos,
        telefono,
        ciudad,
        email,
        plan,
      });
      return {
        status: 201,
        jsonBody: {
          id: Number(created[0].id),
          creadoEn: iso(created[0].creado_en),
          message: 'Inscripción registrada correctamente.',
        },
      };
    } catch (error) {
      return dbError(context, error);
    }
  },
});

app.http('listarInscripciones', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'inscripciones',
  handler: async (request, context) => {
    if (!safeTokenEquals(request.headers.get('x-admin-token'))) return unauthorized();
    if (!hasDatabase) return noDatabase();
    try {
      const limit = Math.min(Math.max(Number(request.query.get('limit')) || 50, 1), 200);
      const rows = await dbQuery(queries.inscripciones, { limit });
      return {
        status: 200,
        jsonBody: rows.map((row) => ({
          id: Number(row.id),
          nombre: row.nombre,
          apellidos: row.apellidos,
          telefono: row.telefono,
          ciudad: row.ciudad,
          email: row.email,
          plan: row.plan,
          creadoEn: iso(row.creado_en),
        })),
      };
    } catch (error) {
      return dbError(context, error);
    }
  },
});
