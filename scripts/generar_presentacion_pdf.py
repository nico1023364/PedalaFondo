"""Genera PRESENTACION.pdf: una diapositiva por página, lista para subir.

Uso: python scripts/generar_presentacion_pdf.py
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "PRESENTACION.pdf"

WIDTH, HEIGHT = 1280, 720
BG = (37, 37, 37)
PANEL = (48, 48, 48)
ACCENT = (255, 214, 10)
WHITE = (245, 245, 245)
GRAY = (205, 205, 205)

FONT_BOLD = Path("C:/Windows/Fonts/arialbd.ttf")
FONT_REGULAR = Path("C:/Windows/Fonts/arial.ttf")
FONT_MONO = Path("C:/Windows/Fonts/consola.ttf")


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size)


def wrap(text: str, draw: ImageDraw.ImageDraw, used_font: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if draw.textlength(candidate, font=used_font) <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def base_slide(title: str, number: int) -> tuple[Image.Image, ImageDraw.ImageDraw]:
    image = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, WIDTH, 8), fill=ACCENT)
    draw.text((60, 44), title, font=font(FONT_BOLD, 46), fill=WHITE)
    draw.text((WIDTH - 110, HEIGHT - 46), str(number), font=font(FONT_REGULAR, 20), fill=GRAY)
    draw.text((60, HEIGHT - 46), "Kilómetro Cero | Pedal a Fondo", font=font(FONT_REGULAR, 18), fill=GRAY)
    return image, draw


def bullets_slide(title: str, number: int, items: list[str], size: int = 25) -> Image.Image:
    image, draw = base_slide(title, number)
    body_font = font(FONT_REGULAR, size)
    y = 145
    for item in items:
        lines = wrap(item, draw, body_font, WIDTH - 160)
        draw.ellipse((66, y + 9, 78, y + 21), fill=ACCENT)
        for line in lines:
            draw.text((98, y), line, font=body_font, fill=WHITE)
            y += size + 12
        y += 18
    return image


def main() -> None:
    slides: list[Image.Image] = []

    # 1. Portada
    image, draw = base_slide("Kilómetro Cero | Pedal a Fondo", 1)
    draw.rectangle((60, 190, WIDTH - 60, 520), fill=PANEL)
    draw.text((95, 230), "Aplicación web con base de datos desplegada en Microsoft Azure",
              font=font(FONT_REGULAR, 30), fill=ACCENT)
    draw.text((95, 300), "Angular 20  •  Node.js / Express  •  Azure SQL Database",
              font=font(FONT_REGULAR, 24), fill=WHITE)
    draw.text((95, 360), "Integrantes: _(completar nombres)_", font=font(FONT_REGULAR, 22), fill=GRAY)
    draw.text((95, 405), "19 de noviembre de 2026", font=font(FONT_REGULAR, 22), fill=GRAY)
    draw.text((95, 455), "pedalafondo-jhoan2-cvadddd4fjh8dbdz.chilecentral-01.azurewebsites.net",
              font=font(FONT_MONO, 17), fill=WHITE)
    slides.append(image)

    # 2. Problema
    slides.append(bullets_slide("1. Planteamiento del problema", 2, [
        "Las imágenes del sitio apuntaban a URLs externas que hoy devuelven error 404.",
        "Los contenidos estaban codificados en Angular: no había base de datos.",
        "El formulario de inscripción solo mostraba los datos por consola.",
        "No existía una URL pública ni un entorno de producción.",
        "La suscripción Azure for Students limita regiones y creación de App Service Plans.",
    ]))

    # 3. Justificación y objetivos
    slides.append(bullets_slide("2. Justificación y objetivos", 3, [
        "Justificación: persistencia, acceso público y separación de capas.",
        "Objetivo general: desplegar en Azure una aplicación web con base de datos.",
        "Reemplazar las imágenes caídas por recursos locales de ciclismo.",
        "Diseñar el esquema en Azure SQL Database y crear la API REST.",
        "Adaptar Angular para consumir la API y desplegar con GitHub Actions.",
    ]))

    # 4. Marco teórico
    slides.append(bullets_slide("3. Marco teórico", 4, [
        "Angular 20: SPA con componentes standalone y HttpClient.",
        "Azure App Service: hosting administrado de aplicaciones web en Linux.",
        "Azure SQL Database: motor relacional administrado basado en SQL Server.",
        "API REST: recursos expuestos por rutas y códigos de estado HTTP.",
        "GitHub Actions: integración continua build + deploy en cada push a main.",
    ]))

    # 5. Arquitectura
    image, draw = base_slide("4. Arquitectura de la solución", 5)
    mono = font(FONT_MONO, 19)
    diagram = [
        "GitHub (nico1023364/PedalaFondo)",
        "        |  push a main",
        "        v",
        "GitHub Actions  ->  npm install + npm run build",
        "        |",
        "        v",
        "Azure App Service (Linux, Node 22 LTS, F1, Chile Central)",
        "        |-- Angular estatico  ->  dist/myapp/browser",
        "        `-- API Express       ->  /api/*",
        "        |  SQL_CONNECTION_STRING (TLS)",
        "        v",
        "Azure SQL Database  ->  servo sql-pedalafondo-jhoan",
        "                        BD pedalafondo",
    ]
    for index, line in enumerate(diagram):
        draw.text((70, 140 + index * 37), line, font=mono,
                  fill=ACCENT if index in (0, 6, 12) else WHITE)
    slides.append(image)

    # 6. Base de datos y API
    slides.append(bullets_slide("5. Componentes y base de datos", 6, [
        "Tablas: planes (3), noticias (2), competencias (3), multimedia (8), inscripciones.",
        "API: GET /health, /planes, /noticias, /competencias, /multimedia, /estadisticas.",
        "POST /inscripciones guarda el formulario; GET /inscripciones requiere token.",
        "El esquema y los datos iniciales se crean automáticamente al arrancar.",
        "La columna [plan] usa corchetes por ser palabra reservada de T-SQL.",
    ]))

    # 7. Despliegue
    slides.append(bullets_slide("6. Despliegue en Azure", 7, [
        "Grupo de recursos rg-pedalafondo (Chile Central).",
        "SQL Server sql-pedalafondo-jhoan + base de datos pedalafondo.",
        "App Service pedalafondo-jhoan2, Linux, Node 22 LTS, plan F1.",
        "Variables: SQL_CONNECTION_STRING, ADMIN_TOKEN, AUTO_MIGRATE.",
        "Deployment Center conectado a GitHub; workflow en verde.",
    ]))

    # 8. Demo
    slides.append(bullets_slide("7. Demostración en vivo", 8, [
        "Abrir la URL pública y mostrar el banner y las fotos.",
        "Abrir /api/health: responderá database = up.",
        "Abrir /api/estadisticas: 3 planes, 2 noticias, 3 competencias, 8 multimedia.",
        "Enviar el formulario de Inscribirme con datos de prueba.",
        "Abrir /admin, escribir el token y mostrar la inscripción guardada.",
    ]))

    # 9. Resultados
    image, draw = base_slide("8. Resultados", 9)
    draw.text((70, 150), "GET /api/health", font=font(FONT_BOLD, 28), fill=ACCENT)
    for index, line in enumerate([
        '{ "status": "ok",',
        '  "database": "up",',
        '  "time": "2026-11-19T23:10:42.920Z" }',
    ]):
        draw.text((90, 205 + index * 38), line, font=font(FONT_MONO, 20), fill=WHITE)
    draw.text((70, 360), "Inscripción de prueba persistida en Azure SQL", font=font(FONT_BOLD, 28), fill=ACCENT)
    for index, line in enumerate([
        "id 3  |  test inscripcion  |  Bogotá  |  Plan Fondo",
        "correo: naifonsole2nick@gmail.com",
        "fecha: 19/11/26, 6:06 PM",
    ]):
        draw.text((90, 415 + index * 42), line, font=font(FONT_REGULAR, 23), fill=WHITE)
    slides.append(image)

    # 10. Conclusiones
    slides.append(bullets_slide("9. Conclusiones y trabajos futuros", 10, [
        "Se cumplió el objetivo: app web con base de datos en Azure.",
        "Las inscripciones se persisten y se consultan desde /admin.",
        "Las imágenes locales eliminaron los errores 404.",
        "Futuro: autenticación real, gráficas, CDN y Functions/Container Apps.",
    ]))

    # 11. Aportes e IA
    slides.append(bullets_slide("10. Aportes e IA generativa", 11, [
        "Tabla de aportes por integrante con roles CRediT (ver informe, sección 10).",
        "Integrante 1: software, datos, validación y redacción del borrador.",
        "Integrante 2: investigación, recursos, supervisión y revisión final.",
        "El LLM se usó como apoyo para código y borradores; siempre fue supervisado.",
        "Las evidencias y resultados son reales, obtenidos del despliegue en Azure.",
    ]))

    # 12. Cierre
    image, draw = base_slide("Gracias", 12)
    draw.text((80, 260), "Kilómetro Cero | Pedal a Fondo", font=font(FONT_BOLD, 44), fill=ACCENT)
    draw.text((80, 340), "URL: https://pedalafondo-jhoan2-cvadddd4fjh8dbdz.chilecentral-01.azurewebsites.net/",
              font=font(FONT_MONO, 17), fill=WHITE)
    draw.text((80, 390), "Repo: https://github.com/nico1023364/PedalaFondo",
              font=font(FONT_MONO, 17), fill=WHITE)
    slides.append(image)

    slides[0].save(
        OUTPUT,
        "PDF",
        resolution=150.0,
        save_all=True,
        append_images=slides[1:],
    )
    print(f"Generado: {OUTPUT} ({len(slides)} diapositivas)")


if __name__ == "__main__":
    main()
