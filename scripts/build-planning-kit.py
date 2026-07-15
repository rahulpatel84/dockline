"""Generate the My Dock Guide — Tampa Dock Planning Kit PDF.

Run with: python3 scripts/build-planning-kit.py
Outputs:  public/tampa-dock-planning-kit.pdf
"""

from __future__ import annotations

import os
from pathlib import Path

from reportlab.lib.colors import HexColor, Color
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ---------- Brand palette (matches app/globals.css) ----------
OCEAN = HexColor("#0c3b46")
OCEAN_2 = HexColor("#0e4d5c")
OCEAN_DK = HexColor("#082932")
TEAL = HexColor("#15808f")
CORAL = HexColor("#f2683c")
CORAL_DK = HexColor("#d9512a")
SAND = HexColor("#faf5ec")
SAND_2 = HexColor("#f1e8d7")
AQUA = HexColor("#6fc5bc")
AQUA_SOFT = HexColor("#bfe7e0")
GOLD = HexColor("#e8a33d")
INK = HexColor("#102329")
INK_SOFT = HexColor("#3f565c")
LINE = HexColor("#e3dccd")
WHITE = HexColor("#ffffff")

# ---------- Fonts ----------
# ReportLab built-ins are used (Helvetica for sans, Times for serif).
# Helvetica-Bold / Times-Bold / Times-Italic are also available.
SERIF = "Times-Bold"
SERIF_REG = "Times-Roman"
SERIF_IT = "Times-Italic"
SANS = "Helvetica"
SANS_B = "Helvetica-Bold"
SANS_O = "Helvetica-Oblique"

PAGE_W, PAGE_H = LETTER

OUTPUT = Path(__file__).resolve().parent.parent / "public" / "tampa-dock-planning-kit.pdf"


# ---------- Helpers ----------
def draw_logo(c: canvas.Canvas, x: float, y: float, dark_bg: bool = False) -> None:
    """Draw the MyDockGuide logo mark + wordmark."""
    # Rounded square icon w/ dock silhouette
    box = 22
    c.setFillColor(TEAL)
    c.roundRect(x, y - box, box, box, 6, stroke=0, fill=1)
    # Simple dock deck lines inside icon
    c.setStrokeColor(AQUA)
    c.setLineWidth(1.4)
    c.line(x + 4, y - 8, x + box - 4, y - 8)
    c.line(x + 4, y - 12, x + box - 4, y - 12)
    # Vertical piles
    c.line(x + 7, y - 8, x + 7, y - box + 4)
    c.line(x + box - 7, y - 8, x + box - 7, y - box + 4)

    # Wordmark
    c.setFont(SERIF, 13)
    c.setFillColor(WHITE if dark_bg else OCEAN)
    c.drawString(x + box + 8, y - 15, "My Dock Guide")


def draw_wave(c: canvas.Canvas, y: float, color: Color, amplitude: float = 18, fill_below: bool = True) -> None:
    """Draw a decorative wave across the page at height y."""
    p = c.beginPath()
    p.moveTo(0, y)
    # Two smooth bumps across the page
    p.curveTo(PAGE_W * 0.2, y + amplitude, PAGE_W * 0.35, y - amplitude, PAGE_W * 0.5, y)
    p.curveTo(PAGE_W * 0.65, y + amplitude, PAGE_W * 0.8, y - amplitude, PAGE_W, y)
    if fill_below:
        p.lineTo(PAGE_W, 0)
        p.lineTo(0, 0)
        p.close()
    c.setFillColor(color)
    c.setStrokeColor(color)
    c.drawPath(p, stroke=0, fill=1 if fill_below else 0)


def wrap_text(c: canvas.Canvas, text: str, font: str, size: int, max_width: float) -> list[str]:
    """Simple word-wrapper that returns lines fitting max_width."""
    c.setFont(font, size)
    words = text.split()
    lines: list[str] = []
    current: list[str] = []
    for w in words:
        trial = " ".join(current + [w])
        if c.stringWidth(trial, font, size) <= max_width:
            current.append(w)
        else:
            if current:
                lines.append(" ".join(current))
            current = [w]
    if current:
        lines.append(" ".join(current))
    return lines


def draw_page_footer(c: canvas.Canvas, page_num: int) -> None:
    """Consistent footer with page number and URL."""
    c.setFont(SANS, 8.5)
    c.setFillColor(INK_SOFT)
    c.drawString(0.75 * inch, 0.45 * inch, "mydockguide.com  ·  Tampa Dock Planning Kit")
    c.drawRightString(PAGE_W - 0.75 * inch, 0.45 * inch, f"Page {page_num}")
    # Thin coral accent
    c.setStrokeColor(CORAL)
    c.setLineWidth(0.6)
    c.line(0.75 * inch, 0.62 * inch, PAGE_W - 0.75 * inch, 0.62 * inch)


def draw_section_header(c: canvas.Canvas, kicker: str, title: str, y: float) -> float:
    """Draw a kicker + big serif section header. Returns y-position after."""
    c.setFont(SANS_B, 9)
    c.setFillColor(TEAL)
    c.drawString(0.75 * inch, y, kicker.upper())
    y -= 32
    c.setFont(SERIF, 26)
    c.setFillColor(OCEAN)
    c.drawString(0.75 * inch, y, title)
    y -= 10
    # Coral underline
    c.setStrokeColor(CORAL)
    c.setLineWidth(2.2)
    c.line(0.75 * inch, y, 0.75 * inch + 42, y)
    y -= 22
    return y


# ============================================================
# PAGE 1 — COVER
# ============================================================
def cover_page(c: canvas.Canvas) -> None:
    # Solid ocean background
    c.setFillColor(OCEAN)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)

    # Decorative aqua dots (top-right cluster)
    c.setFillColor(AQUA)
    for (dx, dy, r) in [(0, 0, 6), (18, 6, 4), (34, -4, 5), (10, 20, 3.5), (-14, 12, 3)]:
        c.circle(PAGE_W - 1.4 * inch + dx, PAGE_H - 1.4 * inch + dy, r, stroke=0, fill=1)

    # Aqua fine stripe (top-left)
    c.setStrokeColor(AQUA)
    c.setLineWidth(1)
    c.line(0.6 * inch, PAGE_H - 0.62 * inch, 2.2 * inch, PAGE_H - 0.62 * inch)

    # Logo
    draw_logo(c, 0.75 * inch, PAGE_H - 0.75 * inch, dark_bg=True)

    # Eyebrow tag
    c.setFont(SANS_B, 9)
    c.setFillColor(AQUA)
    c.drawString(0.75 * inch, PAGE_H - 3.4 * inch, "TAMPA BAY WATERFRONT · 2026 EDITION")

    # Main title (serif, large, two lines)
    c.setFillColor(WHITE)
    c.setFont(SERIF, 54)
    c.drawString(0.75 * inch, PAGE_H - 4.4 * inch, "Tampa Dock")
    c.setFillColor(AQUA_SOFT)
    c.setFont(SERIF_IT, 54)
    c.drawString(0.75 * inch, PAGE_H - 5.2 * inch, "Planning Kit")

    # Coral rule
    c.setFillColor(CORAL)
    c.rect(0.75 * inch, PAGE_H - 5.55 * inch, 60, 4, stroke=0, fill=1)

    # Subtitle
    c.setFillColor(HexColor("#d4e6e6"))
    c.setFont(SANS, 14)
    subtitle = "The waterfront owner's field guide to permits,"
    subtitle2 = "costs, and hiring the right builder."
    c.drawString(0.75 * inch, PAGE_H - 6.15 * inch, subtitle)
    c.drawString(0.75 * inch, PAGE_H - 6.42 * inch, subtitle2)

    # What's inside — 3 short pillars
    pillar_y = PAGE_H - 7.6 * inch
    pillars = [
        ("PERMITS", "Every agency, every project type"),
        ("COSTS", "Real Tampa numbers + a worksheet"),
        ("BUILDERS", "12 questions before you sign"),
    ]
    col_w = (PAGE_W - 1.5 * inch) / 3
    for i, (kick, body) in enumerate(pillars):
        x = 0.75 * inch + i * col_w
        c.setFillColor(GOLD)
        c.setFont(SANS_B, 8.5)
        c.drawString(x, pillar_y, kick)
        c.setStrokeColor(GOLD)
        c.setLineWidth(1)
        c.line(x, pillar_y - 4, x + 22, pillar_y - 4)
        c.setFillColor(HexColor("#cfe3e3"))
        c.setFont(SANS, 10)
        for j, line in enumerate(wrap_text(c, body, SANS, 10, col_w - 12)):
            c.drawString(x, pillar_y - 18 - j * 13, line)

    # Bottom wave
    draw_wave(c, 1.0 * inch, HexColor("#082932"), amplitude=22)
    draw_wave(c, 0.6 * inch, TEAL, amplitude=16)

    # URL bottom
    c.setFillColor(HexColor("#9fc3c4"))
    c.setFont(SANS_B, 9)
    c.drawCentredString(PAGE_W / 2, 0.4 * inch, "MYDOCKGUIDE.COM")


# ============================================================
# PAGE 2 — WELCOME + CONTENTS
# ============================================================
def welcome_page(c: canvas.Canvas, page_num: int) -> None:
    c.setFillColor(SAND)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)

    # Header bar
    c.setFillColor(OCEAN)
    c.rect(0, PAGE_H - 0.9 * inch, PAGE_W, 0.9 * inch, stroke=0, fill=1)
    draw_logo(c, 0.75 * inch, PAGE_H - 0.35 * inch, dark_bg=True)

    y = PAGE_H - 1.7 * inch
    y = draw_section_header(c, "Start here", "Welcome — you're in the right place.", y)

    body = (
        "Building or repairing something on Tampa Bay water is easy to mess up. "
        "This kit is the shortcut: a checklist of every permit you'll need, real cost "
        "numbers you can plug into a worksheet, and the exact questions to ask any "
        "builder before you hand over a deposit."
    )
    c.setFont(SANS, 11.5)
    c.setFillColor(INK)
    for line in wrap_text(c, body, SANS, 11.5, PAGE_W - 1.5 * inch):
        c.drawString(0.75 * inch, y, line)
        y -= 16

    y -= 20

    # "Inside this kit" panel
    panel_x = 0.75 * inch
    panel_w = PAGE_W - 1.5 * inch
    panel_h = 3.2 * inch
    panel_y = y - panel_h
    c.setFillColor(WHITE)
    c.setStrokeColor(LINE)
    c.setLineWidth(1)
    c.roundRect(panel_x, panel_y, panel_w, panel_h, 14, stroke=1, fill=1)

    # Coral corner tab
    c.setFillColor(CORAL)
    c.roundRect(panel_x - 4, panel_y + panel_h - 32, 60, 32, 8, stroke=0, fill=1)
    c.setFillColor(WHITE)
    c.setFont(SANS_B, 8.5)
    c.drawString(panel_x + 6, panel_y + panel_h - 20, "INSIDE")

    c.setFont(SERIF, 18)
    c.setFillColor(OCEAN)
    c.drawString(panel_x + 24, panel_y + panel_h - 60, "Inside this kit")

    contents = [
        ("01", "Permit Checklist by Project Type", "p. 3"),
        ("02", "Dock Cost Worksheet", "p. 5"),
        ("03", "12 Questions to Ask Any Builder", "p. 6"),
        ("04", "Red Flags to Watch For", "p. 8"),
        ("05", "Next Steps", "p. 8"),
    ]
    row_y = panel_y + panel_h - 92
    for num, label, pg in contents:
        c.setFont(SERIF, 15)
        c.setFillColor(TEAL)
        c.drawString(panel_x + 24, row_y, num)
        c.setFont(SANS_B, 11)
        c.setFillColor(INK)
        c.drawString(panel_x + 60, row_y, label)
        c.setFont(SANS, 10)
        c.setFillColor(INK_SOFT)
        c.drawRightString(panel_x + panel_w - 20, row_y, pg)
        # Dotted separator
        c.setStrokeColor(LINE)
        c.setLineWidth(0.6)
        c.setDash(1, 3)
        c.line(panel_x + 24, row_y - 8, panel_x + panel_w - 20, row_y - 8)
        c.setDash()
        row_y -= 32

    # Callout below
    y = panel_y - 30
    c.setFillColor(AQUA_SOFT)
    c.roundRect(0.75 * inch, y - 60, PAGE_W - 1.5 * inch, 58, 10, stroke=0, fill=1)
    c.setFillColor(OCEAN)
    c.setFont(SANS_B, 10)
    c.drawString(0.9 * inch, y - 24, "HOW TO USE THIS KIT")
    c.setFont(SANS, 10.5)
    c.setFillColor(INK)
    tip = "Print the checklist. Fill in the worksheet with quotes as they come in. Read the 12 questions before your first builder call."
    line_y = y - 40
    for line in wrap_text(c, tip, SANS, 10.5, PAGE_W - 1.8 * inch):
        c.drawString(0.9 * inch, line_y, line)
        line_y -= 13

    draw_page_footer(c, page_num)


# ============================================================
# PAGE 3-4 — PERMIT CHECKLIST
# ============================================================
PERMIT_PROJECTS = [
    {
        "label": "New dock construction",
        "agencies": [
            ("County building dept", True),
            ("County environmental / EPC", True),
            ("Florida DEP (submerged lands)", True),
            ("US Army Corps of Engineers", True),
        ],
        "typical": "10–20 weeks total",
        "notes": [
            "Small single-family docks often qualify for an FDEP exemption but still need county sign-off.",
            "Docks over 500 sq ft or in seagrass beds trigger longer FDEP + ACOE review.",
        ],
    },
    {
        "label": "Dock repair / rebuild in-kind",
        "agencies": [
            ("County building dept", True),
            ("County environmental / EPC", False),
            ("Florida DEP", False),
            ("US Army Corps of Engineers", False),
        ],
        "typical": "3–6 weeks",
        "notes": [
            "'In-kind' means same footprint, same materials. Any expansion bumps you to full new-dock permitting.",
        ],
    },
    {
        "label": "Boat lift installation",
        "agencies": [
            ("County building dept", True),
            ("County environmental / EPC", False),
            ("Florida DEP", True),
            ("US Army Corps of Engineers", True),
        ],
        "typical": "6–14 weeks",
        "notes": [
            "Lifts occupy submerged land, so ACOE + FDEP always review.",
            "Bundle with a dock permit if you're building both — most builders will.",
        ],
    },
    {
        "label": "New seawall / full replacement",
        "agencies": [
            ("County building dept", True),
            ("County environmental / EPC", True),
            ("Florida DEP", True),
            ("US Army Corps of Engineers", True),
        ],
        "typical": "12–24 weeks",
        "notes": [
            "Replacement in the same footprint is faster than a brand-new install.",
            "Seagrass mitigation and endangered species review can add 8–16 weeks.",
        ],
    },
    {
        "label": "Seawall cap-only refresh",
        "agencies": [
            ("County building dept", True),
            ("County environmental / EPC", False),
            ("Florida DEP", False),
            ("US Army Corps of Engineers", False),
        ],
        "typical": "2–5 weeks",
        "notes": [
            "Cap-only usually needs only a county building permit.",
            "If panels are compromised, expect to be pushed to full replacement.",
        ],
    },
    {
        "label": "Post-storm rebuild (declared disaster)",
        "agencies": [
            ("County building dept", True),
            ("County environmental / EPC", True),
            ("Florida DEP", True),
            ("US Army Corps of Engineers", True),
        ],
        "typical": "6–18 weeks (expedited path exists)",
        "notes": [
            "Post-disaster expedited review is available — declare intent to rebuild within 90 days for the fastest track.",
            "FEMA 50% rule: if repair cost exceeds 50% of the structure's pre-storm value, current code applies (BFE, wind, elevation).",
        ],
    },
]


def draw_project_card(c: canvas.Canvas, project: dict, x: float, y: float, w: float) -> float:
    """Draw a project checklist card. Returns y-position after (bottom)."""
    # Compute needed height
    notes = project["notes"]
    notes_lines = 0
    for note in notes:
        notes_lines += len(wrap_text(c, note, SANS, 9.5, w - 40))
    card_h = 96 + 18 * len(project["agencies"]) + notes_lines * 12 + 18

    # Card background
    c.setFillColor(WHITE)
    c.setStrokeColor(LINE)
    c.setLineWidth(1)
    c.roundRect(x, y - card_h, w, card_h, 12, stroke=1, fill=1)

    # Teal top accent bar
    c.setFillColor(TEAL)
    c.roundRect(x, y - 6, w, 6, 3, stroke=0, fill=1)
    # Fill the bottom corners flat
    c.rect(x, y - 6, w, 3, stroke=0, fill=1)

    # Title
    c.setFont(SERIF, 14)
    c.setFillColor(OCEAN)
    c.drawString(x + 16, y - 26, project["label"])

    # Typical timing chip
    chip_text = project["typical"]
    c.setFont(SANS_B, 8)
    tw = c.stringWidth(chip_text, SANS_B, 8)
    chip_pad = 8
    c.setFillColor(GOLD)
    c.roundRect(x + w - tw - chip_pad * 2 - 16, y - 32, tw + chip_pad * 2, 16, 8, stroke=0, fill=1)
    c.setFillColor(WHITE)
    c.drawString(x + w - tw - chip_pad - 16, y - 22, chip_text)

    # Agencies list w/ checkboxes
    row_y = y - 52
    c.setFont(SANS_B, 8.5)
    c.setFillColor(INK_SOFT)
    c.drawString(x + 16, row_y, "AGENCIES REQUIRED")
    row_y -= 14
    for agency, required in project["agencies"]:
        # Checkbox
        c.setStrokeColor(TEAL if required else LINE)
        c.setLineWidth(1.2)
        c.setFillColor(AQUA_SOFT if required else WHITE)
        c.roundRect(x + 16, row_y - 3, 12, 12, 2, stroke=1, fill=1)
        if required:
            # Check mark
            c.setStrokeColor(TEAL)
            c.setLineWidth(1.6)
            c.line(x + 19, row_y + 2, x + 22, row_y - 1)
            c.line(x + 22, row_y - 1, x + 26, row_y + 5)
        c.setFont(SANS, 10)
        c.setFillColor(INK if required else INK_SOFT)
        label = agency if required else f"{agency}  (typically not required)"
        c.drawString(x + 34, row_y + 1, label)
        row_y -= 16

    # Notes
    row_y -= 6
    c.setFont(SANS_B, 8.5)
    c.setFillColor(INK_SOFT)
    c.drawString(x + 16, row_y, "NOTES")
    row_y -= 12
    c.setFillColor(INK)
    for note in notes:
        c.setFillColor(CORAL)
        c.circle(x + 20, row_y + 3, 2, stroke=0, fill=1)
        c.setFillColor(INK)
        c.setFont(SANS, 9.5)
        for i, line in enumerate(wrap_text(c, note, SANS, 9.5, w - 40)):
            c.drawString(x + 28, row_y + (0 if i == 0 else -12 * i), line)
        row_y -= 12 * len(wrap_text(c, note, SANS, 9.5, w - 40)) + 3

    return y - card_h - 14


def permit_pages(c: canvas.Canvas, start_page: int) -> int:
    """Render permit checklist across three pages, 2 cards per page."""
    page_num = start_page

    def new_page(header: str):
        c.setFillColor(SAND)
        c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
        c.setFillColor(OCEAN)
        c.rect(0, PAGE_H - 0.9 * inch, PAGE_W, 0.9 * inch, stroke=0, fill=1)
        draw_logo(c, 0.75 * inch, PAGE_H - 0.35 * inch, dark_bg=True)
        c.setFillColor(AQUA)
        c.setFont(SANS_B, 9)
        c.drawRightString(PAGE_W - 0.75 * inch, PAGE_H - 0.5 * inch, header)

    # Two cards per page, 3 pages total (6 project types)
    for idx in range(0, len(PERMIT_PROJECTS), 2):
        new_page("SECTION 01 · PERMITS")
        y = PAGE_H - 1.7 * inch

        if idx == 0:
            y = draw_section_header(c, "Section 01", "Permit Checklist by Project", y)
            c.setFont(SANS, 10.5)
            c.setFillColor(INK_SOFT)
            intro = "Six common Tampa Bay projects and the agencies that touch each one. Print this and check off each approval as it lands."
            for line in wrap_text(c, intro, SANS, 10.5, PAGE_W - 1.5 * inch):
                c.drawString(0.75 * inch, y, line)
                y -= 14
            y -= 12
        else:
            y = draw_section_header(c, "Section 01 · continued", "Permit Checklist by Project", y)

        for project in PERMIT_PROJECTS[idx : idx + 2]:
            y = draw_project_card(c, project, 0.75 * inch, y, PAGE_W - 1.5 * inch)

        draw_page_footer(c, page_num)
        c.showPage()
        page_num += 1

    return page_num


# ============================================================
# PAGE 5 — COST WORKSHEET
# ============================================================
COST_RANGES = [
    ("Permit fees (all agencies)", "$800", "$3,500"),
    ("Site survey & design drawings", "$1,200", "$4,000"),
    ("Pilings (per piling, installed)", "$450", "$900"),
    ("Decking — pressure-treated pine", "$28/sqft", "$42/sqft"),
    ("Decking — composite (Trex / TimberTech)", "$45/sqft", "$70/sqft"),
    ("Decking — ipe or cumaru hardwood", "$60/sqft", "$95/sqft"),
    ("Boat lift (4,500–10,000 lb capacity)", "$5,500", "$14,000"),
    ("Electrical / dock lighting package", "$1,800", "$6,000"),
    ("Water line + shore power pedestal", "$1,200", "$3,500"),
    ("Seawall cap refresh (per linear ft)", "$120/ft", "$220/ft"),
    ("New seawall (per linear ft)", "$550/ft", "$1,100/ft"),
]


def cost_worksheet_page(c: canvas.Canvas, page_num: int) -> None:
    c.setFillColor(SAND)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    c.setFillColor(OCEAN)
    c.rect(0, PAGE_H - 0.9 * inch, PAGE_W, 0.9 * inch, stroke=0, fill=1)
    draw_logo(c, 0.75 * inch, PAGE_H - 0.35 * inch, dark_bg=True)
    c.setFillColor(AQUA)
    c.setFont(SANS_B, 9)
    c.drawRightString(PAGE_W - 0.75 * inch, PAGE_H - 0.5 * inch, "SECTION 02 · COSTS")

    y = PAGE_H - 1.7 * inch
    y = draw_section_header(c, "Section 02", "Dock Cost Worksheet", y)

    intro = "Reference numbers from real Tampa Bay quotes (2026). Use the worksheet below to plug in what each builder tells you and compare side-by-side."
    c.setFont(SANS, 10.5)
    c.setFillColor(INK_SOFT)
    for line in wrap_text(c, intro, SANS, 10.5, PAGE_W - 1.5 * inch):
        c.drawString(0.75 * inch, y, line)
        y -= 14
    y -= 8

    # Reference table
    tbl_x = 0.75 * inch
    tbl_w = PAGE_W - 1.5 * inch
    row_h = 18

    c.setFillColor(OCEAN)
    c.roundRect(tbl_x, y - row_h, tbl_w, row_h, 6, stroke=0, fill=1)
    # Flatten bottom corners of the header
    c.rect(tbl_x, y - row_h, tbl_w, 6, stroke=0, fill=1)
    c.setFont(SANS_B, 9)
    c.setFillColor(WHITE)
    c.drawString(tbl_x + 12, y - 12, "COMPONENT")
    c.drawString(tbl_x + tbl_w * 0.6, y - 12, "LOW")
    c.drawString(tbl_x + tbl_w * 0.78, y - 12, "HIGH")
    y -= row_h

    for i, (label, low, high) in enumerate(COST_RANGES):
        if i % 2 == 0:
            c.setFillColor(WHITE)
        else:
            c.setFillColor(SAND_2)
        c.rect(tbl_x, y - row_h, tbl_w, row_h, stroke=0, fill=1)
        c.setFont(SANS, 9.5)
        c.setFillColor(INK)
        c.drawString(tbl_x + 12, y - 12, label)
        c.setFont(SANS_B, 9.5)
        c.setFillColor(TEAL)
        c.drawString(tbl_x + tbl_w * 0.6, y - 12, low)
        c.setFillColor(CORAL)
        c.drawString(tbl_x + tbl_w * 0.78, y - 12, high)
        y -= row_h

    # Frame around table
    c.setStrokeColor(LINE)
    c.setLineWidth(0.8)
    c.rect(tbl_x, y, tbl_w, row_h * (len(COST_RANGES) + 1), stroke=1, fill=0)

    y -= 22

    # Blank worksheet section
    c.setFillColor(OCEAN)
    c.setFont(SERIF, 15)
    c.drawString(0.75 * inch, y, "Your quote worksheet")
    y -= 8
    c.setStrokeColor(CORAL)
    c.setLineWidth(2)
    c.line(0.75 * inch, y, 0.75 * inch + 34, y)
    y -= 16

    # Worksheet columns: Line item | Builder A | Builder B | Builder C
    ws_x = 0.75 * inch
    ws_w = PAGE_W - 1.5 * inch
    col_widths = [ws_w * 0.4, ws_w * 0.2, ws_w * 0.2, ws_w * 0.2]

    # Header row
    c.setFillColor(AQUA_SOFT)
    c.rect(ws_x, y - 18, ws_w, 18, stroke=0, fill=1)
    c.setFont(SANS_B, 9)
    c.setFillColor(OCEAN)
    headers = ["LINE ITEM", "BUILDER A", "BUILDER B", "BUILDER C"]
    cx = ws_x + 8
    for i, h in enumerate(headers):
        c.drawString(cx, y - 12, h)
        cx += col_widths[i]
    y -= 18

    fill_rows = ["Permits & design", "Pilings", "Decking", "Boat lift", "Electrical", "Water / power", "Extras", "TOTAL"]
    for i, item in enumerate(fill_rows):
        rh = 22 if item != "TOTAL" else 26
        c.setFillColor(SAND if item != "TOTAL" else GOLD)
        c.rect(ws_x, y - rh, ws_w, rh, stroke=0, fill=1)
        c.setFont(SANS_B if item == "TOTAL" else SANS, 10 if item == "TOTAL" else 9.5)
        c.setFillColor(OCEAN if item == "TOTAL" else INK)
        c.drawString(ws_x + 8, y - rh / 2 - 3, item)
        # Vertical dividers
        cx = ws_x + col_widths[0]
        for cw in col_widths[1:]:
            c.setStrokeColor(LINE if item != "TOTAL" else OCEAN)
            c.setLineWidth(0.6)
            c.line(cx, y, cx, y - rh)
            cx += cw
        y -= rh
    # Bottom & outer border
    c.setStrokeColor(OCEAN)
    c.setLineWidth(0.8)
    total_h = 18 + sum(22 for it in fill_rows if it != "TOTAL") + 26
    c.rect(ws_x, y, ws_w, total_h, stroke=1, fill=0)

    draw_page_footer(c, page_num)


# ============================================================
# PAGE 6-7 — 12 QUESTIONS
# ============================================================
QUESTIONS = [
    ("Are you licensed in Florida and insured for marine construction?",
     "Ask for the CBC/CGC number + a certificate of insurance naming you as certificate holder."),
    ("How many Tampa Bay dock permits have you pulled in the last 12 months?",
     "You want a real number, not 'lots'. 20+ is healthy for a busy builder."),
    ("Which agencies will YOU handle vs. which do I handle?",
     "The right answer is 'all of them'. If they punt FDEP or ACOE to you, that's a red flag."),
    ("Can I see three finished projects nearby I can visit?",
     "Drive-by evidence beats Instagram. Ask for addresses, not just photos."),
    ("What's the payment schedule and what triggers each draw?",
     "You should never pay more than 30% up front. Draws should tie to milestones, not calendar dates."),
    ("What are you not including in this price?",
     "Get the exclusions in writing: permits, mobilization, tie-off pilings, electric, water, lift, cleanup."),
    ("What's the warranty on labor vs. materials, in writing?",
     "1 year labor is standard. Material warranties vary — composite decking often has 25 years."),
    ("How do you handle change orders?",
     "Written change orders, priced in advance, signed before work starts. Verbal changes will burn you."),
    ("What's your worst-case delay if permits slip?",
     "A good builder has real numbers. 'It'll be fine' is not a real answer."),
    ("Who is my day-to-day point of contact?",
     "Not the sales person. A project manager or foreman who returns texts within a business day."),
    ("What's your protocol if a hurricane hits mid-build?",
     "Materials tied down, site secured, timeline reset in writing. Ask what happened during Ian/Idalia."),
    ("Can I see a sample contract before I sign?",
     "Yes is the only right answer. Read it. Look for auto-renewal, liquidated damages, and arbitration clauses."),
]


def draw_question(c: canvas.Canvas, num: int, q: str, follow_up: str, y: float, w: float, x: float) -> float:
    """Draw a numbered question with note space. Returns new y."""
    # Number circle
    c.setFillColor(TEAL if num % 2 == 1 else CORAL)
    c.circle(x + 12, y - 12, 12, stroke=0, fill=1)
    c.setFillColor(WHITE)
    c.setFont(SANS_B, 11)
    label = f"{num:02d}"
    tw = c.stringWidth(label, SANS_B, 11)
    c.drawString(x + 12 - tw / 2, y - 15, label)

    # Question text
    c.setFont(SERIF, 12)
    c.setFillColor(OCEAN)
    q_lines = wrap_text(c, q, SERIF, 12, w - 40)
    q_y = y - 8
    for line in q_lines:
        c.drawString(x + 34, q_y, line)
        q_y -= 15

    # Follow-up
    c.setFont(SANS_O, 9.5)
    c.setFillColor(INK_SOFT)
    fu_lines = wrap_text(c, follow_up, SANS_O, 9.5, w - 40)
    fu_y = q_y - 2
    for line in fu_lines:
        c.drawString(x + 34, fu_y, line)
        fu_y -= 12

    # Notes line
    fu_y -= 4
    c.setStrokeColor(LINE)
    c.setLineWidth(0.6)
    c.line(x + 34, fu_y, x + w - 8, fu_y)

    return fu_y - 14


def questions_pages(c: canvas.Canvas, start_page: int) -> int:
    page_num = start_page

    def render_page(qs_slice, section_text: str) -> None:
        c.setFillColor(SAND)
        c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
        c.setFillColor(OCEAN)
        c.rect(0, PAGE_H - 0.9 * inch, PAGE_W, 0.9 * inch, stroke=0, fill=1)
        draw_logo(c, 0.75 * inch, PAGE_H - 0.35 * inch, dark_bg=True)
        c.setFillColor(AQUA)
        c.setFont(SANS_B, 9)
        c.drawRightString(PAGE_W - 0.75 * inch, PAGE_H - 0.5 * inch, section_text)

        y = PAGE_H - 1.7 * inch
        if qs_slice[0][0] == 1:
            y = draw_section_header(c, "Section 03", "12 Questions to Ask Any Builder", y)
            intro = (
                "The single best filter you have is a written Q&A. Ask every builder these before signing. "
                "The ones who give straight answers usually build straight docks."
            )
            c.setFont(SANS, 10.5)
            c.setFillColor(INK_SOFT)
            for line in wrap_text(c, intro, SANS, 10.5, PAGE_W - 1.5 * inch):
                c.drawString(0.75 * inch, y, line)
                y -= 14
            y -= 8
        else:
            y = draw_section_header(c, "Section 03 (cont.)", "12 Questions (continued)", y)

        for (num, q, fu) in qs_slice:
            y = draw_question(c, num, q, fu, y, PAGE_W - 1.5 * inch, 0.75 * inch)

    numbered = [(i + 1, q, fu) for i, (q, fu) in enumerate(QUESTIONS)]
    render_page(numbered[:6], "SECTION 03 · BUILDER Q&A")
    draw_page_footer(c, page_num)
    c.showPage()
    page_num += 1
    render_page(numbered[6:], "SECTION 03 · BUILDER Q&A")
    draw_page_footer(c, page_num)
    c.showPage()
    page_num += 1
    return page_num


# ============================================================
# PAGE 8 — RED FLAGS + NEXT STEPS
# ============================================================
RED_FLAGS = [
    "Asks for more than 30% up front, or wants full payment before permits are pulled.",
    "Won't share a certificate of insurance or license number.",
    "Only shows photos — refuses to give addresses of finished nearby projects.",
    "Verbal quote only, refuses to put exclusions in writing.",
    "Vague warranty ('we stand behind our work') without a written term.",
    "Pressures you to sign 'today' for a special price.",
    "No project manager or single point of contact after the sale.",
    "Won't handle FDEP or ACOE permits ('you do that part').",
]


def final_page(c: canvas.Canvas, page_num: int) -> None:
    c.setFillColor(SAND)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    c.setFillColor(OCEAN)
    c.rect(0, PAGE_H - 0.9 * inch, PAGE_W, 0.9 * inch, stroke=0, fill=1)
    draw_logo(c, 0.75 * inch, PAGE_H - 0.35 * inch, dark_bg=True)
    c.setFillColor(AQUA)
    c.setFont(SANS_B, 9)
    c.drawRightString(PAGE_W - 0.75 * inch, PAGE_H - 0.5 * inch, "SECTIONS 04 & 05")

    y = PAGE_H - 1.7 * inch
    y = draw_section_header(c, "Section 04", "Red Flags to Watch For", y)

    c.setFont(SANS, 10.5)
    c.setFillColor(INK_SOFT)
    intro = "If a builder does any of these, keep shopping. Docks are a 20-year investment; take the extra week."
    for line in wrap_text(c, intro, SANS, 10.5, PAGE_W - 1.5 * inch):
        c.drawString(0.75 * inch, y, line)
        y -= 14
    y -= 6

    for flag in RED_FLAGS:
        # Red X badge
        c.setFillColor(CORAL)
        c.circle(0.9 * inch, y - 5, 6, stroke=0, fill=1)
        c.setStrokeColor(WHITE)
        c.setLineWidth(1.4)
        c.line(0.9 * inch - 3, y - 2, 0.9 * inch + 3, y - 8)
        c.line(0.9 * inch - 3, y - 8, 0.9 * inch + 3, y - 2)
        c.setFont(SANS, 10.5)
        c.setFillColor(INK)
        lines = wrap_text(c, flag, SANS, 10.5, PAGE_W - 1.9 * inch)
        for i, line in enumerate(lines):
            c.drawString(1.15 * inch, y - i * 13, line)
        y -= 13 * len(lines) + 8

    y -= 18

    # Big CTA panel — compute height from actual content
    cta_body = "Fill out one form. We match you with two or three licensed Tampa Bay builders. No spam, no auto-dialers, no fees to you — ever."
    body_lines = wrap_text(c, cta_body, SANS, 11, PAGE_W - 2.0 * inch)

    pad_top = 26
    kicker_h = 12
    title_h = 32
    body_h = 14 * len(body_lines)
    gap = 18
    btn_h = 40
    pad_bot = 26
    cta_h = pad_top + kicker_h + title_h + body_h + gap + btn_h + pad_bot

    panel_x = 0.75 * inch
    panel_w = PAGE_W - 1.5 * inch
    panel_top = y
    panel_bot = y - cta_h

    c.setFillColor(OCEAN)
    c.roundRect(panel_x, panel_bot, panel_w, cta_h, 16, stroke=0, fill=1)

    # Aqua dot cluster (decorative, upper-right)
    c.setFillColor(AQUA)
    for (dx, dy, r) in [(0, 0, 5), (14, 6, 3.5), (26, -3, 4), (10, 18, 3)]:
        c.circle(panel_x + panel_w - 40 + dx, panel_top - 30 + dy, r, stroke=0, fill=1)

    # Kicker
    cursor_y = panel_top - pad_top
    c.setFont(SANS_B, 9)
    c.setFillColor(AQUA)
    c.drawString(panel_x + 22, cursor_y, "SECTION 05 · NEXT STEPS")
    cursor_y -= kicker_h + 6

    # Title
    c.setFont(SERIF, 24)
    c.setFillColor(WHITE)
    c.drawString(panel_x + 22, cursor_y - 8, "Ready to get real quotes?")
    cursor_y -= title_h

    # Body
    c.setFont(SANS, 11)
    c.setFillColor(HexColor("#cfe3e3"))
    for line in body_lines:
        c.drawString(panel_x + 22, cursor_y, line)
        cursor_y -= 14
    cursor_y -= gap - 14

    # Coral button (clickable)
    btn_w = 210
    btn_x = panel_x + 22
    btn_y = cursor_y - btn_h
    c.setFillColor(CORAL)
    c.roundRect(btn_x, btn_y, btn_w, btn_h, 20, stroke=0, fill=1)
    c.setFont(SANS_B, 12)
    c.setFillColor(WHITE)
    c.drawCentredString(btn_x + btn_w / 2, btn_y + 15, "Get matched  →")
    c.linkURL(
        "https://mydockguide.com/quote",
        (btn_x, btn_y, btn_x + btn_w, btn_y + btn_h),
        relative=0,
    )

    # URL text on right, vertically aligned with button
    c.setFont(SANS, 10)
    c.setFillColor(AQUA)
    c.drawRightString(panel_x + panel_w - 22, btn_y + 15, "mydockguide.com/quote")

    draw_page_footer(c, page_num)


# ============================================================
# ORCHESTRATE
# ============================================================
def build() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(
        str(OUTPUT),
        pagesize=LETTER,
        pageCompression=1,
    )
    c.setTitle("Tampa Dock Planning Kit — My Dock Guide")
    c.setAuthor("My Dock Guide")
    c.setSubject("Permits, costs, and builder questions for Tampa Bay waterfront owners")
    c.setKeywords(["Tampa", "dock", "permit", "seawall", "boat lift", "cost", "checklist"])

    # Page 1 — Cover (no footer/page num)
    cover_page(c)
    c.showPage()

    # Page 2 — Welcome + Contents
    welcome_page(c, 2)
    c.showPage()

    # Page 3-4 — Permits
    next_pg = permit_pages(c, 3)  # returns page after last

    # Page 5 — Cost worksheet
    cost_worksheet_page(c, next_pg)
    c.showPage()
    next_pg += 1

    # Page 6-7 — Questions
    next_pg = questions_pages(c, next_pg)

    # Page 8 — Red flags + CTA
    final_page(c, next_pg)
    c.showPage()

    c.save()
    size_kb = OUTPUT.stat().st_size / 1024
    print(f"Built {OUTPUT} ({size_kb:.1f} KB)")


if __name__ == "__main__":
    build()
