import sys
from pathlib import Path
from PIL import Image, ImageDraw
D = Path(__file__).resolve().parent
stem = sys.argv[1]
a = Image.open(D / 'target.png').convert('RGB')
b = Image.open(D / (stem + '.png')).convert('RGB')
assert a.size == b.size == (554, 438)
c = Image.new('RGB', (a.width * 2, a.height + 24), 'white')
c.paste(a, (0, 24))
c.paste(b, (a.width, 24))
ImageDraw.Draw(c).text((5, 5), 'foreground-park | target / ' + stem + ' | both 554x438, scale 2', fill='black')
c.save(D / (stem + '-compare.png'))
