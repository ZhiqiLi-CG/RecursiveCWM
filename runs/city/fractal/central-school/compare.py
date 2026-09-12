from pathlib import Path
from PIL import Image,ImageDraw
import sys
p=Path(__file__).resolve().parent
name=sys.argv[1]
a=Image.open(p/'target.png');b=Image.open(p/f'{name}.png');assert a.size==b.size
out=Image.new('RGB',(a.width*2,a.height+24),'white');out.paste(a,(0,24));out.paste(b,(a.width,24));ImageDraw.Draw(out).text((4,5),f'target | {name} : same 574 x 436 view',fill='black');out.save(p/f'{name}-compare.png')
