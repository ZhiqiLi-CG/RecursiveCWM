from pathlib import Path
from PIL import Image,ImageDraw
import sys
p=Path(__file__).resolve().parent
r=sys.argv[1]
a=Image.open(p/'target.png').convert('RGB');b=Image.open(p/(r+'.png')).convert('RGB')
assert a.size==b.size==(678,720)
c=Image.new('RGB',(1356,750),'white');c.paste(a,(0,30));c.paste(b,(678,30));d=ImageDraw.Draw(c)
d.text((12,9),'TARGET 6x',fill='black');d.text((690,9),r.upper()+' 6x',fill='black');c.save(p/(r+'-compare.png'))
