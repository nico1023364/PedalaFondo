# Reporte técnico — Kilómetro Cero | Pedal a Fondo

**Asignatura:** Desarrollo de aplicaciones web / Computación en la nube  
**Proyecto:** Aplicación web con base de datos desplegada en Microsoft Azure  
**Repositorio:** https://github.com/nico1023364/PedalaFondo  
**URL de producción:** https://pedalafondo-jhoan2-cvadddd4fjh8dbdz.chilecentral-01.azurewebsites.net/  
**Fecha:** 19 de noviembre de 2026  
**Integrantes:** _(completar nombres)_

---

## 1. Introducción

El proyecto **Kilómetro Cero | Pedal a Fondo** es una aplicación web informativa sobre ciclismo en Colombia. El sitio reúne noticias, competencias internacionales, planes de entrenamiento, una galería multimedia y un formulario de inscripción. La versión inicial del proyecto era un frontend Angular estático cuyas imágenes se cargaban desde un servidor externo que actualmente devuelve error 404, y no contaba con persistencia de datos.

Este trabajo presenta el rediseño y despliegue de la solución en Microsoft Azure, incorporando una API REST y una base de datos Azure SQL Database, de modo que la información del sitio y las inscripciones queden almacenadas en la nube y puedan ser consultadas desde cualquier navegador.

## 2. Planteamiento del problema

El proyecto original presentaba tres problemas principales:

1. **Dependencia de recursos externos caídos:** todas las imágenes apuntaban a URLs del dominio `hosting.renderforestsites.com`, las cuales responden con estado 404. Como consecuencia, el sitio se mostraba sin fotografías.
2. **Ausencia de base de datos:** los planes, noticias y competencias estaban codificados dentro de los componentes Angular, y el formulario de inscripción solo mostraba los datos por consola, sin guardarlos.
3. **Falta de despliegue en la nube:** el aplicación existía únicamente en el repositorio local, sin una URL pública ni un entorno de producción.

Además, durante el despliegue aparecieron restricciones propias de la suscripción **Azure for Students**: una política de regiones permitidas y un límite temporal de creación de App Service Plans (error HTTP 429), lo que obligó a replantear la región y la suscripción utilizadas.

## 3. Justificación

Migrar la aplicación a Azure permite:

- Contar con una **URL pública** accesible para la entrega y para cualquier usuario.
- Almacenar la información en una **base de datos administrada** (Azure SQL Database), evitando la pérdida de datos y permitiendo consultas estructuradas.
- Separar claramente las capas de **presentación, lógica de negocio y datos**, facilitando el mantenimiento.
- Implementar **integración continua** desde GitHub: cada cambio en la rama `main` dispara una compilación y un despliegue automáticos.
- Resolver el problema de las imágenes mediante archivos locales alojados en el propio proyecto, eliminando la dependencia de servidores externos.

La solución se ajusta además a los recursos incluidos en el plan Azure for Students, manteniendo un costo mensual muy bajo.

## 4. Objetivos

### Objetivo general

Diseñar, implementar y desplegar en Microsoft Azure una aplicación web de ciclismo con base de datos, que permita consultar contenidos dinámicos y registrar inscripciones de forma persistente.

### Objetivos específicos

1. Reemplazar las imágenes externas caídas por recursos locales relacionados con el ciclismo.
2. Diseñar e implementar un esquema relacional en Azure SQL Database.
3. Desarrollar una API REST en Node.js/Express para exponer los datos de la base.
4. Adaptar los componentes Angular para consumir la API, con datos locales de respaldo.
5. Desplegar frontend y backend en un App Service de Azure con integración continua desde GitHub.
6. Verificar el funcionamiento completo mediante pruebas funcionales y evidencias.

## 5. Marco teórico

### 5.1 Aplicaciones web estáticas y dinámicas

Una aplicación web estática entrega archivos HTML, CSS y JavaScript tal como están almacenados. Una aplicación dinámica, en cambio, genera parte de su contenido a partir de datos almacenados en una base de datos, normalmente a través de una API. Este proyecto combina ambas: Angular compila a archivos estáticos y la API Node.js provee los datos dinámicos.

### 5.2 Angular

Angular es un framework de JavaScript/TypeScript para construir aplicaciones de una sola página (SPA). En la versión 20 utilizada aquí se emplean componentes *standalone*, control de flujo con `@if` y `@for`, y el módulo `HttpClient` para consumir servicios REST [1].

### 5.3 Azure App Service

Azure App Service es un servicio administrado de Microsoft Azure para hospedar aplicaciones web. Permite elegir el sistema operativo (Linux), el runtime (Node.js 22 LTS) y el plan de precios. Incorpora implementación continua desde repositorios Git y registros de diagnóstico [2].

### 5.4 Azure SQL Database

Azure SQL Database es un motor de base de datos relacional administrado basado en SQL Server. Provee alta disponibilidad, copias de seguridad automáticas y control de acceso mediante firewall. Se accede desde la aplicación mediante cadenas de conexión ADO.NET y el protocolo TDS sobre TLS [3].

### 5.5 API REST y CI/CD

Una API REST expone recursos mediante rutas HTTP y códigos de estado. GitHub Actions permite automatizar la compilación y el despliegue: cuando se realiza un `push` a `main`, un workflow instala dependencias, compila Angular y publica el artefacto en Azure [4][5].

## 6. Componentes y funcionalidades de la solución

### 6.1 Arquitectura general

```
GitHub (nico1023364/PedalaFondo)  --push main-->  GitHub Actions
                                                        |
                                                        v
Azure App Service (Linux, Node 22 LTS, plan F1, Chile Central)
   |-- Angular compilado  ->  dist/myapp/browser
   `-- API Express        ->  /api/*
                 |
                 | SQL_CONNECTION_STRING (TLS)
                 v
Azure SQL Database (sql-pedalafondo-jhoan.database.windows.net)
   `-- Base de datos pedalafondo
```

### 6.2 Componentes del frontend

| Componente | Función |
| --- | --- |
| `banner` | Cabecera visual principal con imagen local. |
| `home` | Ensambla todas las secciones de la página de inicio. |
| `planes` | Muestra los planes de entrenamiento consultados desde la API. |
| `noticias` | Carrusel de noticias alimentado desde la base de datos. |
| `competencias` | Tour, Giro y Vuelta consultados desde la API. |
| `multimedia` | Galería de fotografías. |
| `comunidad-ciclista` | Tarjetas de la comunidad. |
| `rueda-con-nosotros` | Sección de invitación a rodar en grupo. |
| `adquirir-planes` | Formulario que envía la inscripción a `POST /api/inscripciones`. |
| `admin` | Vista protegida por token para consultar inscripciones. |
| `services/api.service.ts` | Cliente HTTP centralizado hacia `/api`. |

### 6.3 Componentes del backend

| Archivo | Función |
| --- | --- |
| `server/index.js` | Servidor Express: API REST y entrega de archivos estáticos. |
| `server/db.js` | Pool de conexión a Azure SQL con TLS obligatorio. |
| `server/queries.js` | Consultas T-SQL parametrizadas. |
| `server/schema.sql` | Definición de tablas (idempotente). |
| `server/seed.sql` | Datos iniciales (idempotente). |
| `server/init-db.js` | Inicialización manual opcional. |

### 6.4 API REST

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/health` | Estado del servicio y de la base de datos. |
| GET | `/api/planes` | Planes activos. |
| GET | `/api/noticias` | Noticias. |
| GET | `/api/competencias` | Competencias. |
| GET | `/api/multimedia` | Galería. |
| GET | `/api/estadisticas` | Conteo de registros por tabla. |
| POST | `/api/inscripciones` | Crea una inscripción en la base de datos. |
| GET | `/api/inscripciones` | Lista inscripciones; requiere cabecera `X-Admin-Token`. |

### 6.5 Base de datos

| Tabla | Registros iniciales | Descripción |
| --- | --- | --- |
| `dbo.planes` | 3 | Plan Rodada, Plan Fondo y Plan Pro con sus precios. |
| `dbo.noticias` | 2 | Noticias de ciclismo en Colombia e internacionales. |
| `dbo.competencias` | 3 | Tour de Francia, Giro de Italia y Vuelta a España. |
| `dbo.multimedia` | 8 | Fotos de gravel, MTB, ciclismo femenino, pista, etc. |
| `dbo.inscripciones` | Variable | Inscripciones enviadas desde el formulario. |

Las tablas y los datos se crean automáticamente la primera vez que arranca el servidor, mediante los scripts `schema.sql` y `seed.sql`. Ambos son idempotentes, por lo que pueden ejecutarse en cada reinicio sin duplicar información. La columna `plan` se escribe entre corchetes (`[plan]`) porque `PLAN` es una palabra reservada de T-SQL.

### 6.6 Recursos desplegados en Azure

| Recurso | Nombre | Configuración |
| --- | --- | --- |
| Grupo de recursos | `rg-pedalafondo` | Región Chile Central. |
| Servidor SQL | `sql-pedalafondo-jhoan` | Autenticación SQL; firewall con acceso desde servicios de Azure. |
| Base de datos SQL | `pedalafondo` | De uso general, sin servidor, Gen5, 1 núcleo virtual. |
| App Service Plan | `ASP-rg-pedalafondo-b375` | Linux, plan gratuito F1. |
| App Service | `pedalafondo-jhoan2` | Node 22 LTS, Linux, Chile Central. |
| Workflow | `main_pedalafondo-jhoan2.yml` | GitHub Actions: build + deploy. |

Variables de entorno configuradas en el App Service:

| Variable | Propósito |
| --- | --- |
| `SQL_CONNECTION_STRING` | Cadena ADO.NET de conexión a Azure SQL Database. |
| `ADMIN_TOKEN` | Token de acceso a la vista de administración. |
| `AUTO_MIGRATE` | Habilita la creación automática del esquema al arrancar. |

### 6.7 Funcionalidades implementadas

1. Página principal con imágenes locales de ciclismo.
2. Contenidos dinámicos (planes, noticias, competencias y galería) servidos desde Azure SQL.
3. Formulario de inscripción con validación de campos y correo electrónico.
4. Persistencia de inscripciones en la tabla `dbo.inscripciones`.
5. Consulta protegida de inscripciones en `/admin`.
6. Endpoint de salud `/api/health` para supervisión.
7. Respaldo automático: si la API no responde, el frontend muestra datos locales.
8. Despliegue automático desde GitHub en cada `push` a `main`.

## 7. Resultados

La aplicación quedó operativa en la URL pública indicada. A continuación se presentan las evidencias obtenidas durante la verificación.

**Figura 1.** Grupo de recursos `rg-pedalafondo` con los recursos creados en Azure for Students.

> [Pegar aquí captura del grupo de recursos `rg-pedalafondo` — 3 recursos: Base de datos SQL, Application Insights y SQL Server, región Chile Central.]

**Figura 2.** Base de datos `pedalafondo` en Azure SQL Database, estado *Online*, servidor `sql-pedalafondo-jhoan.database.windows.net`.

> [Pegar aquí captura de la base de datos SQL en Azure — panel Información general, estado Online y plan De uso general sin servidor.]

**Figura 3.** Despliegue correcto del App Service `pedalafondo-jhoan2` y su App Service Plan.

> [Pegar aquí captura de "Se completó la implementación" — recursos `pedalafondo-jhoan2` y `ASP-rg-pedalafondo-b375`, ambos en estado OK.]

**Figura 4.** Variables de entorno configuradas en el App Service.

> [Pegar aquí captura de Variables de entorno — `ADMIN_TOKEN`, `AUTO_MIGRATE` y `SQL_CONNECTION_STRING`, origen App Service.]

**Figura 5.** Configuración de integración continua con GitHub.

> [Pegar aquí captura del Deployment Center → Configuración: Origen GitHub, organización `nico1023364`, repositorio `PedalaFondo`, rama `main`, proveedor de compilación GitHub Actions, runtime Node 22-lts.]

**Figura 6.** Registros de despliegue, con las ejecuciones del workflow completadas correctamente.

> [Pegar aquí captura del Deployment Center → Registros — ejecuciones "Se realizó correctamente" correspondientes a los commits del proyecto.]

**Figura 7.** Sitio web principal funcionando con las imágenes locales.

> [Pegar aquí captura de la portada del sitio en la URL pública, con el banner "Kilómetro Cero".]

**Figura 8.** Verificación del estado de la base de datos mediante `/api/health`.

```json
{
  "status": "ok",
  "database": "up",
  "time": "2026-11-19T23:10:42.920Z",
  "uptime": 165.2599043
}
```

> [Pegar aquí captura del navegador mostrando la respuesta JSON de `/api/health`.]

**Figura 9.** Inscripción registrada y consultada desde la vista `/admin`.

 La prueba consistió en enviar el formulario con los datos: nombre `test inscripcion`, teléfono `3046847325`, ciudad `Bogotá`, correo `naifonsole2nick@gmail.com` y plan `Plan Fondo`. El registro aparece con id 3 y fecha 19/11/26, 6:06 PM, lo que confirma que el dato fue persistido en Azure SQL Database.

> [Pegar aquí captura de `/admin` mostrando la tabla de inscripciones con la fila de prueba.]

Además, el endpoint `/api/estadisticas` devolvió los conteos esperados:

```json
{"planes":3,"noticias":2,"competencias":3,"multimedia":8,"inscripciones":1}
```

 lo cual confirma que el frontend está consumiendo los datos almacenados en la base de datos y no los valores de respaldo.

## 8. Conclusiones

- Se cumplió el objetivo general: la aplicación web está desplegada en Azure y cuenta con una base de datos administrada en la nube.
- La separación en capas (Angular · API Express · Azure SQL) permitió resolver el problema de persistencia del proyecto original.
- El reemplazo de las imágenes externas por archivos locales eliminó los errores 404 y mejoró la apariencia del sitio.
- La integración continua desde GitHub simplifica el despliegue: cualquier cambio en `main` se compila y publica automáticamente.
- Las restricciones de la suscripción estudiantil (regiones permitidas y throttling temporal) se superaron cambiando la región y utilizing una segunda suscripción Azure for Students, sin modificar la base de datos ya creada.
- Las pruebas funcionales confirmaron que las inscripciones se guardan y pueden consultarse desde la interfaz de administración.

## 9. Trabajos futuros

1. Incorporar autenticación de usuarios (Azure AD B2C) para el panel de administración, en lugar de un token estático.
2. Agregar un panel analítico con gráficas de inscripciones por plan y por ciudad.
3. Implementar validaciones adicionales y protección contra envíos duplicados.
4. Migrar la API a Azure Functions o Container Apps para reducir aún más el costo y eliminar la dependencia del App Service Plan.
5. Publicar las imágenes en Azure Blob Storage y servirlas mediante CDN.
6. Ampliar el carrusel de noticias con una sección de administración de contenidos (CMS).

## 10. Aportes por integrante (sistema CRediT)

> Reemplazar "Integrante 1" e "Integrante 2" por los nombres reales y ajustar los roles según corresponda.

| Rol CRediT | Integrante 1 | Integrante 2 |
| --- | --- | --- |
| Conceptualización | ✔ | ✔ |
| Curación de datos | ✔ | |
| Análisis formal | | ✔ |
| Financiación | | |
| Investigación | ✔ | ✔ |
| Metodología | ✔ | |
| Administración del proyecto | | ✔ |
| Recursos | ✔ | |
| Software | ✔ | |
| Supervisión | | ✔ |
| Validación | ✔ | ✔ |
| Visualización | ✔ | |
| Redacción — borrador original | ✔ | |
| Redacción — revisión y edición | | ✔ |

## 11. Aclaraciones sobre el uso de IA generativa (LLM)

Para la elaboración de este trabajo se utilizó un asistente conversacional basado en modelos de lenguaje (LLM), integrado en el entorno de desarrollo OpenCode, como herramienta de apoyo en las siguientes actividades:

- Depuración de las rutas de imágenes y generación de consultas y scripts SQL.
- Generación de código del backend Node/Express y de la vista de administración.
- Elaboración de la guía paso a paso de creación de recursos en el portal de Azure.
- Redacción de este borrador de reporte técnico y del guion de presentación.

Todas las sugerencias fueron **revisadas, ejecutadas y validadas por los integrantes** del grupo. Los datos, capturas y resultados reportados son reales y provienen del despliegue efectuado en Azure. Durante el proceso se detectaron y corrigieron errores derivados de las sugerencias automáticas —por ejemplo, el uso de `plan` como nombre de columna, palabra reservada de SQL Server—, lo que evidencia la supervisión humana del trabajo. No se utilizó IA para generar las evidencias ni para inventar resultados.

En cuanto a las imágenes, se intentó inicialmente generar fotografías con una herramienta de IA, pero el servicio no estuvo disponible; por ello se optó por fotografías libres de Wikimedia Commons, declaradas en `public/assets/images/CREDITOS.md`.

## 12. Bibliografía y citación

[1] Angular Team, *Angular Documentation*. [En línea]. Disponible: https://angular.dev/

[2] Microsoft, *Azure App Service documentation*. [En línea]. Disponible: https://learn.microsoft.com/azure/app-service/

[3] Microsoft, *Azure SQL Database documentation*. [En línea]. Disponible: https://learn.microsoft.com/azure/azure-sql/database/

[4] Microsoft, *Deploy a Node.js app to Azure App Service*. [En línea]. Disponible: https://learn.microsoft.com/azure/app-service/quickstart-nodejs

[5] GitHub, *GitHub Actions documentation*. [En línea]. Disponible: https://docs.github.com/actions

[6] Node.js Foundation, *Node.js official site*. [En línea]. Disponible: https://nodejs.org/

[7] Express.js, *Express — Fast, unopinionated, minimalist web framework for Node.js*. [En línea]. Disponible: https://expressjs.com/

[8] tediousjs, *node-mssql: Microsoft SQL Server client for Node.js*. [En línea]. Disponible: https://github.com/tediousjs/node-mssql

[9] Wikimedia Commons, *Media repository*. [En línea]. Disponible: https://commons.wikimedia.org/

[10] CASRAI, *CRediT Taxonomy*. [En línea]. Disponible: https://casrai.org/credit/

[11] Microsoft, *Azure for Students*. [En línea]. Disponible: https://azure.microsoft.com/free/students/

---

**Anexo:** los archivos `README-AZURE.md` y `PLAN-B.md` del repositorio contienen la guía detallada de despliegue y la alternativa diseñada ante las restricciones del App Service Plan.
