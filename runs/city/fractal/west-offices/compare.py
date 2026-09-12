from pathlib import Path
from PIL import Image, ImageDraw
import sys
p=Path(__file__).resolve().parent
name=sys.argv[1]
a=Image.open(p/'target.png').convert('RGB');b=Image.open(p/(name+'.png')).convert('RGB')
assert a.size==b.size==(580,676)
im=Image.new('RGB',(1160,700),'white');im.paste(a,(0,24));im.paste(b,(580,24))
ImageDraw.Draw(im).text((5,5),f'west-offices target | {name}; both 4x root scale',fill='black')
im.save(p/(name+'-compare.png'))
