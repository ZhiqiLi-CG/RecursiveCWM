from PIL import Image, ImageDraw
from pathlib import Path
import sys
P=Path(__file__).resolve().parent
r=sys.argv[1]
a=Image.open(P/'target.png').convert('RGB');b=Image.open(P/(r+'.png')).convert('RGB')
assert a.size==b.size==(736,580)
c=Image.new('RGB',(1472,604),'white');c.paste(a,(0,24));c.paste(b,(736,24));d=ImageDraw.Draw(c);d.text((6,5),'target (4x)',fill='black');d.text((742,5),r+' locked camera (4x)',fill='black');c.save(P/(r+'-compare.png'))
