-- Esquema de Kilómetro Cero (Pedal a Fondo) para Azure SQL Database.
-- Se ejecuta automáticamente al arrancar el servidor (server/index.js).
-- Es idempotente: si las tablas ya existen no hace cambios.

IF OBJECT_ID(N'dbo.planes', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.planes (
        id          INT IDENTITY(1,1) CONSTRAINT PK_planes PRIMARY KEY,
        nombre      NVARCHAR(80)  NOT NULL CONSTRAINT UQ_planes_nombre UNIQUE,
        descripcion NVARCHAR(1000) NOT NULL,
        precio      DECIMAL(12,2) NOT NULL CONSTRAINT CK_planes_precio CHECK (precio >= 0),
        activo      BIT NOT NULL CONSTRAINT DF_planes_activo DEFAULT (1)
    );
END;
IF OBJECT_ID(N'dbo.noticias', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.noticias (
        id           INT IDENTITY(1,1) CONSTRAINT PK_noticias PRIMARY KEY,
        titulo       NVARCHAR(160) NOT NULL CONSTRAINT UQ_noticias_titulo UNIQUE,
        resumen      NVARCHAR(500) NOT NULL,
        imagen       NVARCHAR(300) NOT NULL,
        enlace       NVARCHAR(300) NULL,
        publicado_en DATE NOT NULL CONSTRAINT DF_noticias_publicado DEFAULT (CAST(GETDATE() AS date))
    );
END;
IF OBJECT_ID(N'dbo.competencias', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.competencias (
        id          INT IDENTITY(1,1) CONSTRAINT PK_competencias PRIMARY KEY,
        nombre      NVARCHAR(120) NOT NULL CONSTRAINT UQ_competencias_nombre UNIQUE,
        anio        INT NOT NULL,
        descripcion NVARCHAR(2000) NOT NULL,
        imagen      NVARCHAR(300) NOT NULL
    );
END;
IF OBJECT_ID(N'dbo.multimedia', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.multimedia (
        id     INT IDENTITY(1,1) CONSTRAINT PK_multimedia PRIMARY KEY,
        titulo NVARCHAR(120) NOT NULL CONSTRAINT UQ_multimedia_titulo UNIQUE,
        imagen NVARCHAR(300) NOT NULL,
        enlace NVARCHAR(300) NULL
    );
END;
IF OBJECT_ID(N'dbo.inscripciones', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.inscripciones (
        id        BIGINT IDENTITY(1,1) CONSTRAINT PK_inscripciones PRIMARY KEY,
        nombre    NVARCHAR(80)  NOT NULL,
        apellidos NVARCHAR(80)  NOT NULL,
        telefono  NVARCHAR(30)  NOT NULL,
        ciudad    NVARCHAR(80)  NOT NULL,
        email     NVARCHAR(160) NOT NULL,
        plan      NVARCHAR(80)  NOT NULL,
        creado_en DATETIMEOFFSET(0) NOT NULL CONSTRAINT DF_inscripciones_creado DEFAULT (SYSDATETIMEOFFSET())
    );
END;

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = N'IX_inscripciones_creado_en' AND object_id = OBJECT_ID(N'dbo.inscripciones')
)
    CREATE INDEX IX_inscripciones_creado_en ON dbo.inscripciones (creado_en DESC);
