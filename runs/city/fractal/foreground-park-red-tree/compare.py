from pathlib import Path
from PIL import Image,ImageDraw
import sys,json
p=Path(__file__).resolve().parent
name=sys.argv[1]
a=Image.open(p/'target.png').convert('RGB');b=Image.open(p/(name+'.png')).convert('RGB')
assert a.size==b.size==(222,390)
out=Image.new('RGB',(444,414),'white');out.paste(a,(0,24));out.paste(b,(222,24));ImageDraw.Draw(out).text((5,5),f'target | {name} | equal scale 6x',fill='black');out.save(p/(name+'-compare.png'))
