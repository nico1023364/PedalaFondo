'use strict';

const queries = {
  planes: `SELECT id, nombre, descripcion, precio FROM dbo.planes WHERE activo = 1 ORDER BY id`,
  noticias: `SELECT id, titulo, resumen, imagen, enlace, publicado_en FROM dbo.noticias ORDER BY publicado_en DESC, id DESC`,
  competencias: `SELECT id, nombre, anio, descripcion, imagen FROM dbo.competencias ORDER BY id`,
  multimedia: `SELECT id, titulo, imagen, enlace FROM dbo.multimedia ORDER BY id`,
  planActivo: `SELECT id FROM dbo.planes WHERE nombre = @plan AND activo = 1`,
  insertInscripcion: `
    INSERT INTO dbo.inscripciones (nombre, apellidos, telefono, ciudad, email, [plan])
    OUTPUT INSERTED.id, INSERTED.creado_en
    VALUES (@nombre, @apellidos, @telefono, @ciudad, @email, @plan)
  `,
  inscripciones: `
    SELECT id, nombre, apellidos, telefono, ciudad, email, [plan], creado_en
    FROM dbo.inscripciones
    ORDER BY creado_en DESC, id DESC
    OFFSET 0 ROWS FETCH NEXT @limit ROWS ONLY
  `,
  estadisticas: `
    SELECT
      (SELECT COUNT(*) FROM dbo.planes) AS planes,
      (SELECT COUNT(*) FROM dbo.noticias) AS noticias,
      (SELECT COUNT(*) FROM dbo.competencias) AS competencias,
      (SELECT COUNT(*) FROM dbo.multimedia) AS multimedia,
      (SELECT COUNT(*) FROM dbo.inscripciones) AS inscripciones
  `,
};

module.exports = queries;
