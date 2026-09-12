"""District pavement skirts beneath child lots and inherited road surfaces."""
import json
from pathlib import Path
D = Path(__file__).resolve().parent
C = json.loads((D.parent.parent/'camera-contract.json').read_text())
def polygon(name, points, color='#e4e4df', y=0.0):
    def world(u, v):
        a=(u-470.5)/30
        b=(v-260+C['vertical_pixels_per_world_unit']*y)/16.35
        return [(a+b)/2, (b-a)/2]
    return {'id':'west-civic/'+name, 'type':'polygon',
            'points':[world(*p) for p in points], 'y':y, 'color':color}
components = [
    polygon('office-pavement-edge', [[0,277],[37,297],[139,244],[147,248],[37,306],[0,285]]),
    polygon('police-pavement-edge', [[85,324],[190,263],[244,291],[244,301],[140,353],[85,327]]),
    polygon('residential-pavement-edge', [[202,263],[337,194],[388,220],[388,228],[241,304],[202,284]]),
    polygon('shop-pavement-edge', [[295,272],[348,242],[397,269],[401,275],[344,302]]),
    polygon('plaza-lawn-connection', [[190,266],[207,263.5],[207,280.75],[241,297.75],[240.5,291.5]], '#7b7a96', 0.014),
]
(D/'local.json').write_text(json.dumps({'node':'west-civic','components':components},indent=2)+'\n')
print(len(components), 'district components: four pavement skirts and one plaza connection')
