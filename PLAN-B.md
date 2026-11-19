# Plan B — Despliegue sin App Service Plan

Se usa **solo si Azure sigue bloqueando la creación del App Service Plan (error 429)**.
La base de datos Azure SQL ya está creada y cargada, así que no hay que tocarla.

Arquitectura:

```
GitHub (PedalaFondo)
   ├── Angular  → Azure Static Web Apps (plan Free)
   └── /api     → Azure Functions (Consumption, gratis)
                       │
                       ▼
              Azure SQL Database (pedalafondo)
```

El frontend no cambia: sigue llamando a `/api/...`, que ahora resuelve a Azure Functions.

## Archivos añadidos para este plan

- `api/package.json`, `api/host.json`.
- `api/src/functions.js`: expone health, planes, noticias, competencias, multimedia,
  estadisticas, POST/GET inscripciones.
- `api/src/db.js` y `api/src/queries.js`: copia de la conexión y consultas T-SQL.
- `staticwebapp.config.json`: fallback a `index.html` para las rutas de Angular.

## Pasos en el portal

1. Portal → **Static Web Apps** → **Crear**.
2. Suscripción: Azure for Students. Grupo: `rg-pedalafondo`.
3. Nombre: `pedalafondo-web`. Región: **Chile Central** (o la que permita tu suscripción).
4. **Plan de hospedaje: Free**.
5. En **Implementación** elige **GitHub** → `nico1023364` → `PedalaFondo` → rama `main`.
6. En **Detalles de compilación**:
   - Ubicación de la aplicación: `/`
   - Ubicación de la API: `api`
   - Comando de compilación: `npm install && npm run build`
   - Ubicación del resultado de la compilación: `dist/myapp/browser`
   - (Opcional) Versión de Node: 20.
7. **Revisar y crear**.
8. Cuando termine, en el Static Web App → **Configuración** → **Variables de entorno**
   (o *Application settings*) agrega las mismas tres variables:

| Nombre | Valor |
|---|---|
| `SQL_CONNECTION_STRING` | Cadena ADO.NET de tu Azure SQL. |
| `ADMIN_TOKEN` | `pedalafondo-admin-2026-jhoan` |
| `AUTO_MIGRATE` | `true` (no es usado por Functions; la BD ya está inicializada) |

9. Abre la URL que da Azure (termina en `.azurestaticapps.net`) y prueba:
   - `/` → sitio con imágenes.
   - `/api/health` → `"database": "up"`.
   - `/admin` → token → lista de inscripciones.

## Notas

- La base ya tiene las tablas creadas. Si hiciera falta recrearlas en otro servidor SQL,
  se puede ejecutar `npm run db:init` desde la carpeta raíz del repo con la variable
  `SQL_CONNECTION_STRING` apuntando al servidor nuevo.
- Los plan Free de Static Web Apps y Consumption de Functions tienen capa gratuita,
  cubierta por el crédito de estudiante.
- Este plan **no se activa** si el App Service se crea correctamente; los archivos
  de `api/` y `staticwebapp.config.json` no afectan al despliegue en App Service.
