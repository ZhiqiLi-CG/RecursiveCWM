from pathlib import Path
from PIL import Image,ImageDraw
import sys
P=Path(__file__).resolve().parent
name=sys.argv[1]
a=Image.open(P/'target.png').convert('RGB');b=Image.open(P/(name+'.png')).convert('RGB')
assert a.size==b.size==(616,440)
out=Image.new('RGB',(1232,464),'white');out.paste(a,(0,24));out.paste(b,(616,24))
d=ImageDraw.Draw(out);d.text((6,6),'target | 4x root pixels',fill='black');d.text((622,6),name+' | locked camera | 4x root pixels',fill='black')
out.save(P/(name+'-compare.png'))
