from pathlib import Path

import fitz


INPUT_DIR = Path("attached_assets")
OUTPUT_DIR = Path(".agents/outputs/sales-brochures")
PDF_NAMES = [
    "Javea_Bliss_One_Page_Agency_Sheet_EN_1789545933911.pdf",
    "Javea_Bliss_Fiche_Agence_FR_1789545933911.pdf",
    "Javea_Bliss_Ficha_Agencia_ES_1789545933911.pdf",
    "Javea_Bliss_Maklerexpose_DE_1789545933911.pdf",
    "Javea_Bliss_Makelaarsfiche_NL_1789545933911.pdf",
]


OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

for pdf_name in PDF_NAMES:
    pdf_path = INPUT_DIR / pdf_name
    document = fitz.open(pdf_path)
    print(f"{pdf_name}: {document.page_count} page(s)")
    for page_number, page in enumerate(document):
        pixmap = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
        output_path = OUTPUT_DIR / f"{pdf_path.stem}-page-{page_number + 1}.png"
        pixmap.save(output_path)
        print(f"  rendered {output_path} ({pixmap.width}x{pixmap.height})")