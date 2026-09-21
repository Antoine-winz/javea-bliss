import fitz
source = '/tmp/stamped-compatible.pdf'
out = '.agents/outputs/stamped-compatible-page.png'
doc = fitz.open(source)
assert doc.page_count == 1
pix = doc[0].get_pixmap(matrix=fitz.Matrix(1, 1), alpha=False)
pix.save(out)
print(f'pages={doc.page_count} output={out} size={len(open(source, "rb").read())}')
