"""Rebuild the original decorative tree. Seeded; no remote assets required."""
from pathlib import Path
import random, math
rng=random.Random(221026)
out=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 1000" fill="none"><defs><linearGradient id="wood"><stop stop-color="#423624"/><stop offset=".36" stop-color="#967344"/><stop offset=".6" stop-color="#6a5134"/><stop offset="1" stop-color="#3c3325"/></linearGradient><radialGradient id="crown"><stop stop-color="#53724c"/><stop offset=".75" stop-color="#334f35"/><stop offset="1" stop-color="#243c2c" stop-opacity="0"/></radialGradient><linearGradient id="leaf"><stop stop-color="#193c29"/><stop offset=".48" stop-color="#6d8c4d"/><stop offset="1" stop-color="#344d31"/></linearGradient><path id="l" d="M0 0 Q-9 -8 -2 -23 Q10 -17 0 0Z" fill="url(#leaf)"/><path id="s" d="M0 0 Q-8 -7 -2 -20 Q9 -14 0 0Z" fill="#a7ad65"/></defs>']
# A broad, irregular crown, never a ring of identical leaves.
clusters=[(310,260,200,120),(500,190,220,140),(700,160,210,130),(885,180,235,135),(1080,255,215,140),(260,410,200,130),(490,340,230,160),(730,310,240,170),(960,380,230,150),(1160,420,160,120)]
for x,y,rx,ry in clusters:out.append(f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="url(#crown)" opacity=".75"/>')
# Branches taper recursively, with irregular forks and twig tips.
def twig(x,y,angle,length,width,depth):
 ex=x+math.cos(angle)*length;ey=y+math.sin(angle)*length
 cx=(x+ex)/2+rng.uniform(-12,12);cy=(y+ey)/2+rng.uniform(-12,12)
 out.append(f'<path d="M{x:.1f} {y:.1f} Q{cx:.1f} {cy:.1f} {ex:.1f} {ey:.1f}" stroke="#625039" stroke-width="{width:.1f}" stroke-linecap="round"/>')
 if depth:
  twig(ex,ey,angle-rng.uniform(.25,.65),length*rng.uniform(.61,.77),width*.63,depth-1)
  twig(ex,ey,angle+rng.uniform(.25,.65),length*rng.uniform(.61,.77),width*.63,depth-1)
for args in [(700,615,-2.1,210,46,4),(690,570,-1.7,210,42,4),(720,580,-1.04,225,42,4),(740,630,-.64,220,35,4),(640,650,-2.65,220,32,4)]:twig(*args)
# Individually oriented, clustered foliage; transparent gaps retain visible limbs.
for n in range(1550):
 x,y,rx,ry=rng.choice(clusters);a=rng.uniform(0,math.tau);r=math.sqrt(rng.random())
 px=x+math.cos(a)*r*rx*.9;py=y+math.sin(a)*r*ry*.9
 sc=rng.uniform(.65,1.3);angle=rng.uniform(-155,155)
 out.append(f'<use href="#{"s" if n%11==0 else "l"}" transform="translate({px:.1f} {py:.1f}) rotate({angle:.1f}) scale({sc:.2f})" opacity="{rng.uniform(.66,.96):.2f}"/>')
# The four explorable limbs connect to the locations of their area labels.
paths=[('M690 640 C575 565 425 375 230 210',46),('M720 640 C830 500 1010 380 1170 210',46),('M640 740 C510 645 360 590 225 550',38),('M755 745 C900 650 1025 585 1175 550',38)]
for d,w in paths:
 out.append(f'<path d="{d}" stroke="#493a27" stroke-width="{w}" stroke-linecap="round"/><path d="{d}" stroke="url(#wood)" stroke-width="{w-5}" stroke-linecap="round"/>')
# Wide stump, buttress roots, bark fissures and an organic light-facing edge.
out.append('<path d="M538 904 C585 841 596 779 608 718 C621 655 637 600 678 540 C669 609 700 632 721 586 C736 637 744 667 766 700 C791 756 776 834 861 916 C793 902 774 892 747 898 C715 921 668 926 635 901 C600 908 571 913 538 904Z" fill="url(#wood)"/>')
for i in range(28):
 x=rng.uniform(602,787);y=rng.uniform(685,885)
 out.append(f'<path d="M{x:.1f} {y:.1f} q{rng.uniform(-20,20):.1f} -40 {rng.uniform(-15,15):.1f} -90" stroke="{rng.choice(["#342e23","#c9a677","#463b2a"])}" stroke-width="{rng.uniform(1,3):.1f}" opacity=".4"/>')
for i in range(13):
 x=350+i*58;mid=630+(i-6)*12
 out.append(f'<path d="M700 868 Q{mid} 942 {x} {945+rng.uniform(-14,18):.1f}" stroke="url(#wood)" stroke-width="{rng.uniform(5,16):.1f}" stroke-linecap="round"/>')
out.append('</svg>')
Path('apps/web/public/tree.svg').write_text(''.join(out))
