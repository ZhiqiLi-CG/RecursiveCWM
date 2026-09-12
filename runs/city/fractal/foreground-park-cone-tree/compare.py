from PIL import Image, ImageDraw
from pathlib import Path
import sys
D=Path(__file__).resolve().parent
name=sys.argv[1]
a=Image.open(D/'target.png').convert('RGB');b=Image.open(D/(name+'.png')).convert('RGB')
assert a.size==b.size==(216,300)
out=Image.new('RGB',(432,322),'white');out.paste(a,(0,22));out.paste(b,(216,22))
ImageDraw.Draw(out).text((4,4),'target | '+name+'  (same 6x scale)',fill='black')
out.save(D/(name+'-compare.png'))
