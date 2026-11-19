-- Datos iniciales para Azure SQL Database (idempotente).
-- Se puede ejecutar en cada arranque: solo inserta lo que falta.

INSERT INTO dbo.planes (nombre, descripcion, precio)
SELECT N'Plan Rodada', N'Inicia en el ciclismo con rutinas básicas y progresivas. Incluye: rutinas básicas, tips de nutrición y progresión semanal.', 20000
WHERE NOT EXISTS (SELECT 1 FROM dbo.planes WHERE nombre = N'Plan Rodada');

INSERT INTO dbo.planes (nombre, descripcion, precio)
SELECT N'Plan Fondo', N'Aumenta tu resistencia con entrenos de fuerza y rutas largas. Incluye: entrenos de fuerza, rutas largas guiadas y seguimiento mensual.', 30000
WHERE NOT EXISTS (SELECT 1 FROM dbo.planes WHERE nombre = N'Plan Fondo');

INSERT INTO dbo.planes (nombre, descripcion, precio)
SELECT N'Plan Pro', N'El nivel más alto, para quienes buscan competir o alcanzar su mejor versión. Incluye: planificación avanzada, asesoría en potencia y análisis de datos.', 50000
WHERE NOT EXISTS (SELECT 1 FROM dbo.planes WHERE nombre = N'Plan Pro');

INSERT INTO dbo.noticias (titulo, resumen, imagen, enlace)
SELECT N'Ciclismo en Colombia', N'Nuevos talentos emergentes en el ciclismo nacional.', N'/assets/images/fans.jpg', N'/noticias'
WHERE NOT EXISTS (SELECT 1 FROM dbo.noticias WHERE titulo = N'Ciclismo en Colombia');

INSERT INTO dbo.noticias (titulo, resumen, imagen, enlace)
SELECT N'Competencias internacionales', N'Tour de Francia 2025: resultados, análisis de etapas y desempeño de los colombianos.', N'/assets/images/tour.jpg', N'/noticias'
WHERE NOT EXISTS (SELECT 1 FROM dbo.noticias WHERE titulo = N'Competencias internacionales');

INSERT INTO dbo.competencias (nombre, anio, descripcion, imagen)
SELECT N'Tour de Francia', 2025,
  N'Considerado la competencia más importante del ciclismo de ruta. Cada año reúne a los mejores equipos y corredores del mundo. Sus etapas incluyen montaña, contrarreloj y recorridos planos que ponen a prueba todas las habilidades de un ciclista. Fue la edición 112 del Tour de Francia, disputada del 5 al 27 de julio de 2025. El recorrido cubrió 21 etapas y aproximadamente 3.320 km. Ganador del Tour: Tadej Pogačar (UAE Team Emirates-XRG), seguido por Jonas Vingegaard (Visma-Lease a Bike) en segundo lugar, y Florian Lipowitz (Red Bull-BORA-Hansgrohe) tercero.',
  N'/assets/images/tour.jpg'
WHERE NOT EXISTS (SELECT 1 FROM dbo.competencias WHERE nombre = N'Tour de Francia');

INSERT INTO dbo.competencias (nombre, anio, descripcion, imagen)
SELECT N'Giro de Italia', 2025,
  N'La edición 108 del Giro corrió del 9 de mayo al 1 de junio, comenzando en Durrës (Albania) y terminando en Roma. Fueron 21 etapas con ~3.443 kilómetros, un desnivel acumulado de unos 52.350-52.500 metros. Tuvo dos contrarrelojes individuales, varias etapas de montaña clave y tramos de sterato (terrenos de tierra), lo que añadió dificultad adicional para los ciclistas. Favoritos: se mencionaba a Primož Roglič, Juan Ayuso, Richard Carapaz y Mikel Landa entre otros. También sobresale la ausencia de Tadej Pogacar, lo que abrió más posibilidades para otros.',
  N'/assets/images/giro.jpg'
WHERE NOT EXISTS (SELECT 1 FROM dbo.competencias WHERE nombre = N'Giro de Italia');

INSERT INTO dbo.competencias (nombre, anio, descripcion, imagen)
SELECT N'Vuelta a España', 2025,
  N'Última gran vuelta de la temporada, conocida por sus rampas extremas y el protagonismo de los ciclistas latinoamericanos. La Vuelta de 2025 es la edición 80 y promete ser una carrera montaña-pendiente, con muchos finales en alto, contrarrelojes (CRI) y etapas decisivas que favorecen a los escaladores. Algunos tramos clave que definirían la carrera: La Bola del Mundo (etapa de montaña exigente en la sierra de Guadarrama), el Angliru, etapas en Asturias, y una CRI importante. Favoritos y aspirantes: Jonas Vingegaard llega como candidato fuerte; Juan Ayuso y João Almeida también son nombres a tener en cuenta; Egan Bernal está en recuperación y equipo, intentando pelear.',
  N'/assets/images/vuelta.jpg'
WHERE NOT EXISTS (SELECT 1 FROM dbo.competencias WHERE nombre = N'Vuelta a España');

INSERT INTO dbo.multimedia (titulo, imagen, enlace)
SELECT N'Gravel', N'/assets/images/gravel.jpg', N'#salvaje'
WHERE NOT EXISTS (SELECT 1 FROM dbo.multimedia WHERE titulo = N'Gravel');

INSERT INTO dbo.multimedia (titulo, imagen, enlace)
SELECT N'MTB', N'/assets/images/mtb.jpg', N'#gf-bogota'
WHERE NOT EXISTS (SELECT 1 FROM dbo.multimedia WHERE titulo = N'MTB');

INSERT INTO dbo.multimedia (titulo, imagen, enlace)
SELECT N'Ciclismo femenino', N'/assets/images/women.jpg', N'#hikers'
WHERE NOT EXISTS (SELECT 1 FROM dbo.multimedia WHERE titulo = N'Ciclismo femenino');

INSERT INTO dbo.multimedia (titulo, imagen, enlace)
SELECT N'Ciclismo urbano', N'/assets/images/urban.jpg', N'#urban'
WHERE NOT EXISTS (SELECT 1 FROM dbo.multimedia WHERE titulo = N'Ciclismo urbano');

INSERT INTO dbo.multimedia (titulo, imagen, enlace)
SELECT N'Pista', N'/assets/images/track.jpg', N'#pista'
WHERE NOT EXISTS (SELECT 1 FROM dbo.multimedia WHERE titulo = N'Pista');

INSERT INTO dbo.multimedia (titulo, imagen, enlace)
SELECT N'Rodada en grupo', N'/assets/images/group-ride.jpg', N'#grupo'
WHERE NOT EXISTS (SELECT 1 FROM dbo.multimedia WHERE titulo = N'Rodada en grupo');

INSERT INTO dbo.multimedia (titulo, imagen, enlace)
SELECT N'Taller', N'/assets/images/workshop.jpg', N'#taller'
WHERE NOT EXISTS (SELECT 1 FROM dbo.multimedia WHERE titulo = N'Taller');

INSERT INTO dbo.multimedia (titulo, imagen, enlace)
SELECT N'Entrenamiento', N'/assets/images/training.jpg', N'#entrenamiento'
WHERE NOT EXISTS (SELECT 1 FROM dbo.multimedia WHERE titulo = N'Entrenamiento');
