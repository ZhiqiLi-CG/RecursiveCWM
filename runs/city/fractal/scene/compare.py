from PIL import Image,ImageDraw
from pathlib import Path
import sys
D=Path(__file__).resolve().parent
n=sys.argv[1];a=Image.open(D/'target.png').convert('RGB');b=Image.open(D/(n+'.png')).convert('RGB');assert a.size==b.size==(941,520)
c=Image.new('RGB',(1882,544),'white');ImageDraw.Draw(c).text((8,5),'TARGET 1x | '+n+' 1x',fill='black');c.paste(a,(0,24));c.paste(b,(941,24));c.save(D/(n+'-compare.png'));Image.blend(a,b,.5).save(D/(n+'-overlay.png'))
for suffix,box in [('west',(0,240,375,425)),('east',(600,216,856,425)),('school',(348,266,668,451))]:
 x=a.crop(box).resize(((box[2]-box[0])*2,(box[3]-box[1])*2));y=b.crop(box).resize(x.size);o=Image.new('RGB',(x.width*2,x.height),'white');o.paste(x);o.paste(y,(x.width,0));o.save(D/(n+'-'+suffix+'.png'))
