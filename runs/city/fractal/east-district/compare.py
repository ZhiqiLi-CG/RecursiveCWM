from pathlib import Path
from PIL import Image,ImageDraw
import sys
D=Path(__file__).resolve().parent; name=sys.argv[1]
a=Image.open(D/'target.png').convert('RGB'); b=Image.open(D/(name+'.png')).convert('RGB'); assert a.size==b.size
w,h=a.size; out=Image.new('RGB',(2*w,h+24),'white');out.paste(a,(0,24));out.paste(b,(w,24));draw=ImageDraw.Draw(out);draw.text((8,5),'TARGET | fixed root scale 2x',fill='black');draw.text((w+8,5),name+' | fixed root scale 2x',fill='black');out.save(D/(name+'-compare.png'))
# Panels retain the original 2x root scale on both sides.
for label,box in [('west-seam',(0,0,460,300)),('tower-seam',(620,100,1172,490)),('hospital-seam',(470,310,900,588))]:
 aa=a.crop(box);bb=b.crop(box); ww,hh=aa.size;panel=Image.new('RGB',(ww*2,hh+24),'white');panel.paste(aa,(0,24));panel.paste(bb,(ww,24));ImageDraw.Draw(panel).text((6,5),label+' target | render; equal 2x root scale',fill='black');panel.save(D/(name+'-'+label+'.png'))
