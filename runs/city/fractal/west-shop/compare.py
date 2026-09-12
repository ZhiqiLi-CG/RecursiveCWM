from PIL import Image, ImageDraw
from pathlib import Path
import sys
p=Path(__file__).parent
r=sys.argv[1]
a=Image.open(p/'target.png').convert('RGB');b=Image.open(p/f'{r}.png').convert('RGB')
assert a.size==b.size==(336,364)
o=Image.new('RGB',(672,388),'white');o.paste(a,(0,24));o.paste(b,(336,24));ImageDraw.Draw(o).text((4,4),f'target | {r}; both 4x root scale',fill='black');o.save(p/f'{r}-compare.png')
