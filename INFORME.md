# Informe — Kilómetro Cero | Pedal a Fondo

**Proyecto:** Aplicación web de ciclismo con base de datos desplegada en Microsoft Azure.
**Repositorio:** https://github.com/nico1023364/PedalaFondo
**Fecha de entrega:** 19 de noviembre de 2026
**Integrantes:** _(completar)_

---

## 1. Objetivo

Implementar una aplicación web de ciclismo colombiano ("Kilómetro Cero — Pedal a Fondo")
con base de datos alojada en Azure. El sitio permite consultar noticias, competencias
internacionales, planes de entrenamiento y galería multimedia, además de registrar
inscripciones que se almacenan en la base de datos.

## 2. Tecnologías utilizadas

| Capa | Tecnología |
|---|---|
| Frontend | Angular 20 (standalone components, control flow `@if`/`@for`) |
| Backend | Node.js + Express (API REST en `server/`) |
| Base de datos | Azure SQL Database (SQL Server), base `pedalafondo` |
| Autenticación de API | Token de administración (`ADMIN_TOKEN`) para consultar inscripciones |
| Despliegue | Azure App Service (Linux, Node 22) + implementación continua desde GitHub |
| Imágenes | Wikimedia Commons, almacenadas localmente en `public/assets` |

## 3. Arquitectura

```
GitHub (nico1023364/PedalaFondo)
        │  push a main / GitHub Actions
        ▼
Azure App Service (Linux · Node 22 LTS · Chile Central)
   ├── Angular compilado  → dist/myapp/browser
   └── API Express        → /api
              │  SQL_CONNECTION_STRING
              ▼
Azure SQL Database  →  servidor sql-pedalafondo-jhoan
                       base de datos pedalafondo
```

La base de datos se inicializa automáticamente al arrancar el servidor: `server/schema.sql`
crea las tablas y `server/seed.sql` carga los datos iniciales. Ambos scripts son idempotentes,
por lo que se pueden ejecutar en cada reinicio sin duplicar información.

## 4. Base de datos

| Tabla | Descripción |
|---|---|
| `dbo.planes` | Planes de entrenamiento (Rodada, Fondo, Pro) con precio. |
| `dbo.noticias` | Noticias con título, resumen, imagen y enlace. |
| `dbo.competencias` | Tour de Francia, Giro de Italia y Vuelta a España. |
| `dbo.multimedia` | Galería de fotos de ciclismo. |
| `dbo.inscripciones` | Inscripciones enviadas desde el formulario web. |

Datos iniciales cargados: **3 planes, 2 noticias, 3 competencias y 8 elementos multimedia**.

## 5. Funcionalidades

- Página principal con banner, secciones y galería de imágenes locales.
- Noticias con carrusel (se alimenta desde la base de datos).
- Competencias internacionales consultadas desde la base de datos.
- Planes de entrenamiento consultados desde la base de datos.
- Formulario de inscripción que guarda cada registro en Azure SQL Database.
- Vista `/admin` protegida por token para consultar las inscripciones guardadas.
- Endpoint `/api/health` que reporta el estado de la conexión con la base de datos.
- Si la API no responde, el frontend usa datos locales de respaldo y sigue funcionando.

## 6. Despliegue realizado en Azure

1. **Grupo de recursos:** `rg-pedalafondo` (Chile Central).
2. **Azure SQL Database:** servidor `sql-pedalafondo-jhoan`, base `pedalafondo`,
   plan Basic, autenticación SQL (usuario `sqladmin`). Firewall con acceso desde
   servicios de Azure y desde la IP del cliente.
3. **App Service:** Linux, Node 22 LTS, plan gratuito F1, región Chile Central,
   nombre `pedalafondo-jhoan`. Implementación continua desde GitHub (rama `main`).
4. **Variables de entorno en App Service:**

| Variable | Uso |
|---|---|
| `SQL_CONNECTION_STRING` | Cadena ADO.NET de conexión a Azure SQL Database. |
| `ADMIN_TOKEN` | Token para la vista `/admin` y `GET /api/inscripciones`. |
| `AUTO_MIGRATE` | Crea tablas y datos iniciales automáticamente al arrancar. |

## 7. API REST

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Estado del servicio y de la base de datos. |
| GET | `/api/planes` | Planes activos. |
| GET | `/api/noticias` | Noticias. |
| GET | `/api/competencias` | Competencias. |
| GET | `/api/multimedia` | Galería. |
| GET | `/api/estadisticas` | Conteo de registros por tabla. |
| POST | `/api/inscripciones` | Registra una inscripción en la base de datos. |
| GET | `/api/inscripciones` | Lista inscripciones (requiere `X-Admin-Token`). |

## 8. Evidencias

> Pega aquí tus capturas de pantalla.

1. Grupo de recursos `rg-pedalafondo` con los recursos creados.
   _[Captura aquí]_

2. Base de datos SQL `pedalafondo` en Azure (panel de información general).
   _[Captura aquí]_

3. App Service con el runtime Node 22 y el plan seleccionado.
   _[Captura aquí]_

4. Variables de entorno configuradas en App Service.
   _[Captura aquí]_

5. GitHub Actions / Deployment Center con el despliegue correcto.
   _[Captura aquí]_

6. Sitio web principal funcionando (URL pública).
   _[Captura aquí]_

7. Respuesta de `/api/health` con `"database": "up"`.
   _[Captura aquí]_

8. Formulario de inscripción enviado correctamente.
   _[Captura aquí]_

9. Vista `/admin` mostrando la inscripción guardada en Azure SQL.
   _[Captura aquí]_

## 9. Costos estimados

| Recurso | Plan | Costo aproximado |
|---|---|---|
| Azure SQL Database | Basic (5 DTU) | ~USD 5/mes |
| App Service | Free F1 | USD 0 |
| **Total** | | **~USD 5/mes** (dentro del crédito Azure for Students) |

## 10. Conclusiones

Se cumplió el objetivo de desplegar una aplicación web con base de datos en Azure.
El frontend Angular y la API Node comparten un único App Service, y toda la información
dinámica (planes, noticias, competencias, multimedia e inscripciones) se almacena en
Azure SQL Database. El uso de imágenes locales eliminó la dependencia de URLs externas
que retornaban error 404.

## 11. Referencias

- Repositorio del proyecto: https://github.com/nico1023364/PedalaFondo
- Guía de despliegue: `README-AZURE.md` dentro del repositorio.
- Documentación de Azure SQL Database: https://learn.microsoft.com/azure/azure-sql/
- Documentación de Azure App Service: https://learn.microsoft.com/azure/app-service/
