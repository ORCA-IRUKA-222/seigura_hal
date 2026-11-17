import random, math
random.seed(7)
W,H=1280,720
o=[]
a=o.append
a(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMax slice">')
a('''<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05041a"/><stop offset=".55" stop-color="#1a2150"/><stop offset="1" stop-color="#3b3a5e"/></linearGradient>
<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c1733"/><stop offset="1" stop-color="#0c0a1a"/></linearGradient>
<radialGradient id="moon"><stop offset="0" stop-color="#fff7d6"/><stop offset=".45" stop-color="#f0e2a8"/><stop offset="1" stop-color="#f0e2a8" stop-opacity="0"/></radialGradient>
<radialGradient id="glow"><stop offset="0" stop-color="#ffe56a" stop-opacity=".55"/><stop offset="1" stop-color="#ffe56a" stop-opacity="0"/></radialGradient>
<filter id="blur"><feGaussianBlur stdDeviation="14"/></filter>
</defs>''')
a(f'<rect width="{W}" height="{H}" fill="url(#sky)"/>')
for _ in range(90):
    x,y=random.uniform(0,W),random.uniform(0,330); r=random.choice([.6,.8,1,1.4])
    a(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{r}" fill="#fff" opacity="{random.uniform(.3,.9):.2f}"/>')
a('<circle cx="1010" cy="140" r="150" fill="url(#moon)" opacity=".55"/><circle cx="1010" cy="140" r="46" fill="#f6efc6"/>')
a('<g fill="#24294f" opacity=".7" filter="url(#blur)"><ellipse cx="900" cy="170" rx="260" ry="22"/><ellipse cx="260" cy="120" rx="220" ry="18"/><ellipse cx="1100" cy="260" rx="200" ry="16"/></g>')
# distant hills
a('<path d="M0 520 C200 470 360 500 520 480 C760 450 940 500 1280 470 L1280 720 L0 720Z" fill="#0d0c20"/>')
# house
a('<g transform="translate(-190,0)">')
ROOF='#171329'
RIM='#d99a2e'
a('<g>')
def roof(pts,rim=True):
    s=' '.join(f'{x},{y}' for x,y in pts)
    a(f'<polygon points="{s}" fill="{ROOF}" stroke="{RIM}" stroke-width="2.2" stroke-linejoin="round" opacity="1"/>')
def wall(x,y,w,h): a(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="url(#wall)"/>')
# main body
wall(340,360,560,330)
# tower
wall(540,200,150,200); roof([(520,205),(615,40),(710,205)])
a('<rect x="605" y="10" width="2" height="34" fill="#d99a2e"/>')
# left gable
wall(300,380,150,300); roof([(280,390),(375,260),(470,390)])
# right wing
wall(860,400,170,290); roof([(845,410),(945,310),(1045,410)])
# roof over center
roof([(330,370),(470,300),(540,215),(540,370)])
roof([(690,215),(760,300),(910,370),(690,370)])
# chimneys
for x,y in [(420,270),(800,300),(980,340)]:
    a(f'<rect x="{x}" y="{y}" width="26" height="60" fill="{ROOF}" stroke="{RIM}" stroke-width="1.5"/>')
a('</g>')
# windows
def win(x,y,w,h,col='#ffd94a',glow=True):
    if glow: a(f'<circle cx="{x+w/2}" cy="{y+h/2}" r="{max(w,h)*1.1:.0f}" fill="url(#glow)"/>')
    a(f'<path d="M{x} {y+h} V{y+w/2} A{w/2} {w/2} 0 0 1 {x+w} {y+w/2} V{y+h}Z" fill="{col}"/>')
    a(f'<path d="M{x+w/2} {y} V{y+h} M{x} {y+h*0.5} H{x+w}" stroke="#2a1d08" stroke-width="2.2" fill="none"/>')
dark='#2c2a48'
for (x,y,w,h,c,g) in [
 (360,420,34,70,'#ffd94a',1),(410,420,34,70,dark,0),(360,540,34,70,dark,0),(410,540,34,70,'#b9e65a',1),
 (320,440,30,64,dark,0),
 (570,250,36,74,'#ffd94a',1),(630,250,36,74,dark,0),
 (720,420,34,70,'#b9e65a',1),(770,420,34,70,dark,0),(820,420,34,70,'#ffd94a',1),
 (720,540,34,70,dark,0),(820,540,34,70,'#ffd94a',1),
 (885,450,32,66,dark,0),(940,450,32,66,'#ffd94a',1),(995,450,32,66,dark,0),(940,570,32,66,'#b9e65a',1),
 (352,330,0,0,None,0)]:
    if c: win(x,y,w,h,c,bool(g))
# bay window with figures
a('<circle cx="615" cy="455" r="150" fill="url(#glow)"/>')
a('<rect x="560" y="400" width="110" height="96" rx="4" fill="#ffe36e"/>')
for i,cx in enumerate([583,603,626,648]):
    a(f'<circle cx="{cx}" cy="448" r="7.5" fill="#1a1020"/><rect x="{cx-9}" y="455" width="18" height="41" rx="6" fill="#1a1020"/>')
    if i in(0,2,3): a(f'<polygon points="{cx-11},441 {cx},414 {cx+11},441" fill="#1a1020"/><rect x="{cx-14}" y="439" width="28" height="4" fill="#1a1020"/>')
a('<rect x="556" y="496" width="118" height="8" fill="#171329" stroke="#d99a2e" stroke-width="1.5"/>')
a('<path d="M560 400 H670 M615 400 V496" stroke="#2a1d08" stroke-width="2.5"/>')
# door
a('<circle cx="615" cy="640" r="90" fill="url(#glow)" opacity=".7"/>')
a('<path d="M585 690 V620 A30 30 0 0 1 645 620 V690Z" fill="#2a1608" stroke="#d99a2e" stroke-width="2"/>')
a('<circle cx="615" cy="590" r="6" fill="#ffd94a"/>')
# stairs
for i in range(5):
    a(f'<rect x="{560-i*22}" y="{690+i*7}" width="{110+i*44}" height="8" fill="#1a1630"/>')
a('</g>')
# ground & fence
a(f'<rect x="0" y="690" width="{W}" height="40" fill="#07060f"/>')
for x in range(0,W,38):
    if 520<x<720: continue
    a(f'<rect x="{x}" y="620" width="4" height="86" fill="#05040c"/><polygon points="{x-3},620 {x+2},606 {x+7},620" fill="#05040c"/>')
a(f'<rect x="0" y="650" width="520" height="3" fill="#05040c"/><rect x="720" y="650" width="{W-720}" height="3" fill="#05040c"/>')
# bushes
for cx,cy,r in [(120,690,70),(230,700,60),(310,690,80),(470,700,60),(780,700,70),(900,695,80),(1040,700,70),(1180,690,90)]:
    a(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#08121a"/>')
# bare tree left
def branch(x,y,ang,l,d):
    if d==0 or l<8: return
    x2,y2=x+math.cos(ang)*l,y-math.sin(ang)*l
    a(f'<line x1="{x:.0f}" y1="{y:.0f}" x2="{x2:.0f}" y2="{y2:.0f}" stroke="#05040c" stroke-width="{max(1,d*1.8):.1f}" stroke-linecap="round"/>')
    for da in(-.5,.45):
        branch(x2,y2,ang+da+random.uniform(-.15,.15),l*random.uniform(.68,.8),d-1)
branch(120,700,math.pi/2+.08,150,8)
branch(1190,700,math.pi/2-.1,130,7)
a('</svg>')
open('img/mansion.svg','w').write('\n'.join(o))
