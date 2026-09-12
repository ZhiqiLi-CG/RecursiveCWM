import sys
from pathlib import Path
from PIL import Image, ImageDraw
D = Path(__file__).resolve().parent
name = sys.argv[1]
a = Image.open(D/'target.png').convert('RGB')
b = Image.open(D/(name+'.png')).convert('RGB')
assert a.size == b.size == (776, 458)
out = Image.new('RGB', (a.width*2, a.height+24), 'white')
out.paste(a, (0,24)); out.paste(b, (a.width,24))
ImageDraw.Draw(out).text((5,5), 'west-civic target | '+name+'; both 2x root scale', fill='black')
out.save(D/(name+'-compare.png'))
