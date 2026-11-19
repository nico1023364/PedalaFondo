# Kilómetro Cero | Pedal a Fondo

Sitio web de ciclismo colombiano: noticias, competencias internacionales, planes de
entrenamiento, galería multimedia y formulario de inscripción.

- **Frontend:** Angular 20 (standalone components).
- **Backend:** Node.js + Express (`server/`).
- **Base de datos:** Azure SQL Database (SQL Server).
- **Despliegue:** Azure App Service (Linux, Node 22) con GitHub Actions.

## Estructura

```
src/app/
  services/api.service.ts   # Cliente HTTP del API
  admin/                    # Vista de inscripciones (token)
server/
  index.js                  # API + servidor de archivos estáticos
  db.js                     # Pool de conexión a Azure SQL
  schema.sql                # Tablas
  seed.sql                  # Datos iniciales
  init-db.js                # Inicialización manual (opcional)
public/assets/              # Imágenes y logo locales
README-AZURE.md             # Guía de despliegue en Azure
```

## Desarrollo local

```bash
npm install
npm run build      # compila Angular en dist/myapp/browser
npm start          # API + frontend en http://localhost:3000

npm run dev        # Angular con recarga en http://localhost:4200 (proxy /api -> 3000)

npm run test:unit  # pruebas unitarias (Karma)
```

Sin `SQL_CONNECTION_STRING` la web funciona con datos locales de respaldo y el API
responde `503` en las rutas de base de datos.

## Configuración

Copia `.env.example` a `.env` y completa:

- `SQL_CONNECTION_STRING`: cadena ADO.NET de Azure SQL Database.
- `ADMIN_TOKEN`: token para `/admin` y `GET /api/inscripciones`.

## Despliegue en Azure

Sigue **[README-AZURE.md](README-AZURE.md)**: grupo de recursos, Azure SQL Database,
App Service y conexión con GitHub. El servidor crea el esquema y los datos iniciales
automáticamente al arrancar.

## Créditos de imágenes

Las fotografías son de Wikimedia Commons (uso educativo). Ver
[`public/assets/images/CREDITOS.md`](public/assets/images/CREDITOS.md).
