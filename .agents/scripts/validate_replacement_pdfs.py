import fitz
from pathlib import Path
files = [
    Path('attached_assets/Javea_Bliss_Fiche_Agence_FR_1789558533000.pdf'),
    Path('attached_assets/Javea_Bliss_Scheda_Agenzia_IT_1789558533000.pdf'),
]
for source in files:
    doc = fitz.open(source)
    print(f'{source}: pages={doc.page_count}, metadata={doc.metadata}')
    for index in range(doc.page_count):
        output = Path('.agents/outputs') / f'{source.stem}-page-{index + 1}.png'
        doc[index].get_pixmap(matrix=fitz.Matrix(1, 1), alpha=False).save(output)
        print(f'rendered={output}')
