# Despliegue de Kilómetro Cero en Azure

Arquitectura usada (la misma idea del video del profesor, con Azure SQL):

```
GitHub (PedalaFondo)
        │  push / Deployment Center
        ▼
Azure App Service (Linux, Node 22)
  ├── Angular compilado (dist/myapp/browser)
  └── API Node/Express (/api)
        │  cadena de conexión
        ▼
Azure SQL Database (SQL Server)
  └── Base de datos: pedalafondo
```

La app crea las tablas y los datos iniciales **sola** la primera vez que arranca
(`server/schema.sql` + `server/seed.sql`). No hay que ejecutar scripts a mano.

---

## 1. Crear el grupo de recursos

1. Entra a <https://portal.azure.com> con la cuenta **Azure for Students**.
2. Busca **Grupos de recursos** → **Crear**.
3. Suscripción: *Azure for Students*.
4. Nombre: `rg-pedalafondo`.
5. Región: `East US 2` (si falla por cuota, prueba `Central US` o `Brazil South`).
6. **Revisar y crear**.

> Usa la **misma región** para la base de datos y para el App Service.

---

## 2. Crear Azure SQL Database

1. En el buscador del portal escribe **SQL databases** → **Crear**.
2. Pestaña **Básico**:
   - Grupo de recursos: `rg-pedalafondo`.
   - Nombre de la base de datos: `pedalafondo`.
   - Servidor: **Crear nuevo**.
     - Nombre del servidor: `sql-pedalafondo-TUNOMBRE` (debe ser único en todo Azure, solo minúsculas/números/guiones).
     - Ubicación: la misma región del grupo.
     - Método de autenticación: **Usar autenticación de SQL**.
     - Administrador del servidor: `sqladmin`.
     - Contraseña: una contraseña fuerte. **Sin punto y coma (`;`)**, porque rompe la cadena de conexión.
     - Guarda usuario y contraseña.
3. **Compute + storage** → **Configurar base de datos**:
   - Elige **Basic** (5 DTU, 2 GB). Es la opción más económica (unos USD 5/mes).
4. Pestaña **Redes**:
   - Método de conectividad: **Punto de conexión público**.
   - Reglas de firewall: **Agregar dirección IP del cliente actual**.
   - Activa **Permitir que los servicios y recursos de Azure accedan a este servidor**
     (necesario para que App Service se conecte).
5. **Revisar y crear** → espera a que termine el despliegue.

### Copiar la cadena de conexión

1. Abre el recurso **pedalafondo** (la base de datos).
2. Menú izquierdo → **Cadenas de conexión**.
3. Pestaña **ADO.NET**, copia la cadena. Se ve así:

```
Server=tcp:sql-pedalafondo-tunombre.database.windows.net,1433;Initial Catalog=pedalafondo;Persist Security Info=False;User ID=sqladmin;Password={TU_CLAVE};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```

> Si el portal muestra `{your_password}`, reemplázalo por tu contraseña real.

---

## 3. Crear el App Service

1. Busca **App Services** → **Crear** → **Aplicación web**.
2. Pestaña **Básico**:
   - Grupo de recursos: `rg-pedalafondo`.
   - Nombre: `pedalafondo-tunombre` (define la URL `https://pedalafondo-tunombre.azurewebsites.net`).
   - **Publicar**: Código.
   - **Pila de tiempo de ejecución**: `Node 22 LTS`.
   - **Sistema operativo**: Linux.
   - Región: la misma de antes.
   - **Plan de App Service**: **Crear nuevo** → SKU **B1 (Basic)**.
     (La capa gratuita F1 también sirve para probar, pero tiene poca CPU y se duerme.)
3. Pestaña **Implementación**:
   - **Habilitar implementación continua**: Activado.
   - Proveedor: **GitHub** → autoriza → organización `nico1023364` → repositorio `PedalaFondo` → rama `main`.
   - Proveedor de compilación: **Servicio de compilación de App Service**.
4. **Revisar y crear** → **Crear**.

Azure crea un workflow de GitHub Actions en el repo y despliega automáticamente.
Puedes ver el avance en GitHub → pestaña **Actions** (workflow *Deploy to Azure Web App*).

> Cada `git push` a `main` vuelve a compilar y desplegar. Eso es lo mismo que
> subir archivos en el video, pero automático.

---

## 4. Configurar las variables de entorno

1. Abre el **App Service** → menú **Configuración** → **Variables de entorno**
   (en algunas cuentas aparece como **Configuration**).
2. En **Configuración de la aplicación** agrega:

| Nombre | Valor |
| --- | --- |
| `SQL_CONNECTION_STRING` | La cadena ADO.NET copiada en el paso 2 (con tu contraseña). |
| `ADMIN_TOKEN` | Un texto largo y secreto, por ejemplo `pedalafondo-2026-cambia-esto`. |
| `AUTO_MIGRATE` | `true` |

3. **Aplicar** / **Guardar** y confirma el reinicio.

### (Opcional) Siempre activo

**Configuración** → **Configuración general** → **Always On** = **Activado**.
Evita el arranque en frío si la app se queda sin tráfico.

---

## 5. Verificar el despliegue

1. Abre `https://TU-APP.azurewebsites.net` → debe cargar el sitio con las imágenes.
2. Abre `https://TU-APP.azurewebsites.net/api/health` → debe responder:

```json
{ "status": "ok", "database": "up", ... }
```

3. Ve a **Inscribirme**, llena el formulario y envíalo.
4. Abre `https://TU-APP.azurewebsites.net/admin`, escribe el `ADMIN_TOKEN` y
   pulsa **Consultar**: debe aparecer la inscripción.

También puedes verlo en el portal: base de datos `pedalafondo` → **Editor de consultas**
→ inicia sesión con `sqladmin` → ejecuta:

```sql
SELECT * FROM dbo.inscripciones ORDER BY creado_en DESC;
```

---

## 6. Costos aproximados (Azure for Students)

| Recurso | SKU | Costo aproximado |
| --- | --- | --- |
| App Service Linux | B1 Basic | ~USD 13/mes |
| Azure SQL Database | Basic 5 DTU | ~USD 5/mes |
| **Total** | | **~USD 18/mes** (cubierto por el crédito de estudiante) |

> El crédito de Azure for Students es de USD 100. Si quieres reducir costos,
> puedes eliminar los recursos al terminar la entrega o usar la capa F1 en App Service.

---

## 7. Solución de problemas

| Síntoma | Causa probable | Solución |
| --- | --- | --- |
| `/api/health` responde `database: not-configured` | Falta `SQL_CONNECTION_STRING` | Agrégala en Variables de entorno y reinicia. |
| `/api/health` responde 503 `database: down` | Contraseña mal copiada, firewall o cadena incompleta | Revisa la cadena, que la contraseña no tenga `;`, y que el firewall permita servicios de Azure + tu IP. |
| La web carga sin datos (planes/noticias de ejemplo) | El frontend usó sus datos locales porque el API falló | Abre `/api/health` y corrige la conexión. |
| Error 500 al iniciar | Revisa **Registro de secuencias de registro** (Log stream) | Casi siempre es la cadena de conexión o el build. |
| El formulario muestra error | El API devolvió 503/400 | Revisa el mensaje; el detalle completo está en Log stream. |
| GitHub Actions falla | `npm ci` o build | Revisa el log del workflow; el proyecto ya compila localmente con `npm run build`. |

---

## 8. Desarrollo local

```powershell
# 1. Instalar dependencias
npm install

# 2. Opcional: crear .env con tu cadena de Azure SQL
Copy-Item .env.example .env
# edita .env con SQL_CONNECTION_STRING y ADMIN_TOKEN

# 3. Terminal A: API + archivos estáticos (requiere "npm run build" antes)
npm run build
npm start

# 4. Terminal B: Angular con recarga en caliente y proxy /api
npm run dev
```

- `npm run dev` abre `http://localhost:4200` y envía `/api` a `http://localhost:3000`.
- Sin `SQL_CONNECTION_STRING`, el API responde 503 y la web usa los datos locales,
  así puedes trabajar el diseño sin base de datos.
- `npm run db:init` crea el esquema manualmente (no es necesario en Azure porque
  el servidor lo hace al arrancar).

---

## 9. Endpoints del API

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/health` | Estado del servicio y de la base de datos. |
| GET | `/api/planes` | Planes activos. |
| GET | `/api/noticias` | Noticias. |
| GET | `/api/competencias` | Competencias. |
| GET | `/api/multimedia` | Galería. |
| GET | `/api/estadisticas` | Conteo de registros por tabla. |
| POST | `/api/inscripciones` | Registra una inscripción. |
| GET | `/api/inscripciones` | Lista inscripciones (requiere cabecera `X-Admin-Token`). |
