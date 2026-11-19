# Guion de presentación en video (máximo 15 minutos)

Duración recomendada: **12 minutos**. El video debe mostrar la pantalla mientras se explica y, en la parte final, demostrar la aplicación en vivo desde el navegador.

| Tiempo | Diapositiva | Contenido | Qué decir |
| --- | --- | --- | --- |
| 0:00 – 0:30 | 1. Portada | Título, integrantes, URL y repo. | "Presentamos Kilómetro Cero, una aplicación web de ciclismo desplegada en Azure con base de datos." |
| 0:30 – 1:30 | 2. Problema | Imágenes rotas (404), sin base de datos, sin despliegue. | "El proyecto original tenía tres problemas: las fotos no cargaban, el formulario no guardaba nada y no existía una URL pública." |
| 1:30 – 2:30 | 3. Justificación y objetivos | Beneficios de Azure, objetivo general y específicos. | "Mover la solución a Azure permite persistencia, acceso público e integración continua." |
| 2:30 – 3:30 | 4. Marco teórico | Angular, App Service, Azure SQL, REST, GitHub Actions. | "Usamos Angular 20 como frontend, Node y Express como API, y Azure SQLcomo base de datos administrada." |
| 3:30 – 4:45 | 5. Arquitectura | Diagrama GitHub → Actions → App Service → Azure SQL. | "Cada push a main dispara el workflow; el App Service sirve el Angular compilado y la API, y esta se conecta por TLS a Azure SQL." |
| 4:45 – 6:00 | 6. Componentes y BD | Tablas y endpoints. | "La base tiene cinco tablas y la API expone ocho rutas; el formulario usa POST /api/inscripciones y /admin usa GET con token." |
| 6:00 – 7:30 | 7. Despliegue en Azure | Recursos creados, variables de entorno, GitHub Actions. | "Mostramos el grupo de recursos, la base de datos, el App Service y el workflow en verde." |
| 7:30 – 10:30 | 8. Demo en vivo | Navegador (ver pasos abajo). | "Ahora demostramos el funcionamiento real." |
| 10:30 – 11:30 | 9. Resultados | `/api/health`, `/admin` con la inscripción. | "La respuesta database up confirma la conexión; la fila en /admin confirma que el formulario guarda en Azure SQL." |
| 11:30 – 12:30 | 10. Conclusiones y trabajos futuros | Logros y mejoras. | "Cumplimos el objetivo; como trabajo futuro: autenticación real, gráficas y CDN." |
| 12:30 – 13:00 | 11. Aportes y cierre | Tabla CRediT y aclaración de IA. | "Cada integrante aportó en estas áreas; el uso de IA fue de apoyo y siempre supervisado." |

## Demo en vivo — pasos exactos

Abre `https://pedalafondo-jhoan2-cvadddd4fjh8dbdz.chilecentral-01.azurewebsites.net/` y muestra, en este orden:

1. **Portada:** banner "Kilómetro Cero" y fotos cargando (Figura 7).
2. Baja a **Noticias** y **Competencias** para mostrar que el contenido viene de la base.
3. Abre `/api/health` en otra pestaña: muestra `"database": "up"` (Figura 8).
4. Abre `/api/estadisticas`: muestra los conteos `planes: 3, noticias: 2, competencias: 3, multimedia: 8`.
5. Ve a **Inscribirme**, llena el formulario y envíalo (puedes usar datos de prueba).
6. Abre `/admin`, escribe el token `pedalafondo-admin-2026-jhoan` y pulsa **Consultar**.
7. Muestra la fila nueva en la tabla (Figura 9).
8. Opcional: en el portal de Azure, muestra la base de datos `pedalafondo` en línea (Figura 2).

## Grabación

- Usa una herramienta de captura de pantalla con audio (OBS, Loom, Zoom, etc.).
- Resolución recomendada: 1280×720 o superior.
- Habla en voz alta y mantén el video por debajo de 15 minutos.
- Si el sitio tarda en cargar por el plan gratuito F1, espera y comenta: *"el primer acceso despierta la app"*.
