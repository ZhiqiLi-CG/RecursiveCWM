from pathlib import Path
from PIL import Image,ImageDraw
import sys
p=Path(__file__).resolve().parent
name=sys.argv[1]
a=Image.open(p/'target.png').convert('RGB');b=Image.open(p/(name+'.png')).convert('RGB')
assert a.size==b.size==(352,344)
out=Image.new('RGB',(704,368),'white');out.paste(a,(0,24));out.paste(b,(352,24))
d=ImageDraw.Draw(out);d.text((5,5),'target / 4x',fill='black');d.text((357,5),name+' / locked camera / 4x',fill='black')
out.save(p/(name+'-compare.png'))
