"""Convierte INFORME.md en un documento .docx con formato básico.

Uso: python scripts/generar_docx.py
"""

from __future__ import annotations

import re
from pathlib import Path

from docx import Document
from docx.shared import Pt, RGBColor

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "INFORME.md"
OUTPUT = ROOT / "INFORME.docx"

INLINE_PATTERN = re.compile(r"(\*\*.*?\*\*|`[^`]+`)")


def add_inline(paragraph, text: str) -> None:
    for part in INLINE_PATTERN.split(text):
        if not part:
            continue
        if part.startswith("**") and part.endswith("**"):
            run = paragraph.add_run(part[2:-2])
            run.bold = True
        elif part.startswith("`") and part.endswith("`"):
            run = paragraph.add_run(part[1:-1])
            run.font.name = "Consolas"
            run.font.size = Pt(9)
        else:
            paragraph.add_run(part)


def is_separator(cells: list[str]) -> bool:
    return bool(cells) and all(re.fullmatch(r":?-{3,}:?", cell) for cell in cells)


def split_row(line: str) -> list[str]:
    return [cell.strip() for cell in line.strip().strip("|").split("|")]


def main() -> None:
    lines = SOURCE.read_text(encoding="utf-8").splitlines()
    doc = Document()

    styles = doc.styles
    styles["Normal"].font.name = "Calibri"
    styles["Normal"].font.size = Pt(11)
    styles["Title"].font.color.rgb = RGBColor(0x25, 0x25, 0x25)
    for name in ("Heading 1", "Heading 2"):
        styles[name].font.color.rgb = RGBColor(0x25, 0x25, 0x25)

    doc.core_properties.title = "Reporte técnico — Kilómetro Cero | Pedal a Fondo"
    doc.core_properties.subject = "Aplicación web con base de datos desplegada en Azure"
    doc.core_properties.author = "Kilómetro Cero"

    i = 0
    in_code = False
    code_lines: list[str] = []

    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        if stripped.startswith("```"):
            if in_code:
                for code_line in code_lines:
                    paragraph = doc.add_paragraph()
                    run = paragraph.add_run(code_line)
                    run.font.name = "Consolas"
                    run.font.size = Pt(9)
                code_lines = []
                in_code = False
            else:
                in_code = True
            i += 1
            continue

        if in_code:
            code_lines.append(line)
            i += 1
            continue

        if not stripped or stripped == "---":
            i += 1
            continue

        if stripped.startswith("# "):
            doc.add_heading(stripped[2:], level=0)
        elif stripped.startswith("## "):
            doc.add_heading(stripped[3:], level=1)
        elif stripped.startswith("### "):
            doc.add_heading(stripped[4:], level=2)
        elif stripped.startswith("> "):
            paragraph = doc.add_paragraph()
            run = paragraph.add_run(stripped[2:])
            run.italic = True
            run.font.color.rgb = RGBColor(0x60, 0x60, 0x60)
        elif stripped.startswith("|") and stripped.endswith("|"):
            rows: list[list[str]] = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                cells = split_row(lines[i])
                if not is_separator(cells):
                    rows.append(cells)
                i += 1
            if rows:
                table = doc.add_table(rows=1, cols=len(rows[0]))
                table.style = "Light Grid Accent 1"
                for index, value in enumerate(rows[0]):
                    table.rows[0].cells[index].text = value
                for row in rows[1:]:
                    cells = table.add_row().cells
                    for index, value in enumerate(row):
                        if index < len(cells):
                            cells[index].text = value
            continue
        elif re.match(r"^\d+\.\s", stripped):
            doc.add_paragraph(stripped)
        elif stripped.startswith("- "):
            paragraph = doc.add_paragraph(style="List Bullet")
            add_inline(paragraph, stripped[2:])
        else:
            paragraph = doc.add_paragraph()
            add_inline(paragraph, stripped)

        i += 1

    doc.save(OUTPUT)
    print(f"Generado: {OUTPUT}")


if __name__ == "__main__":
    main()
