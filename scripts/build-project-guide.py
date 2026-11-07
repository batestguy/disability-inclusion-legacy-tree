"""Build the illustrated project guide using existing documentation screenshots.
Run from any directory: python scripts/build-project-guide.py
Documentation-only dependencies: reportlab, PyMuPDF (fitz), Pillow.
"""
from pathlib import Path
import shutil
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from PIL import Image
import pymupdf as fitz

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output/pdf'
OUT.mkdir(parents=True, exist_ok=True)
PROOF = ROOT / 'tmp/pdfs'
PROOF.mkdir(parents=True, exist_ok=True)
BASE = 'https://mohammed-abba-isa-legacy.pages.dev'
REPO = 'https://github.com/batestguy/disability-inclusion-legacy-tree'
RELEASE = REPO + '/releases/tag/demo-2026-11-06'
ASSETS = REPO + '/releases/download/demo-2026-11-06/'
GREEN = HexColor('#0B5D3B')
INK = HexColor('#24352D')
MUTED = HexColor('#52695C')
PALE = HexColor('#EDF4EF')
LINE = HexColor('#CCDCD1')
W, H, M = 595.276, 841.89, 46
CW = W - 2*M
font_dir = Path('C:/Windows/Fonts')
# Use locally installed Unicode fonts; no font or service download is needed.
if (font_dir / 'arial.ttf').exists():
    pdfmetrics.registerFont(TTFont('Guide', str(font_dir / 'arial.ttf')))
    pdfmetrics.registerFont(TTFont('GuideBold', str(font_dir / 'arialbd.ttf')))
else:
    import reportlab
    bundled = Path(reportlab.__file__).parent / 'fonts'
    pdfmetrics.registerFont(TTFont('Guide', str(bundled / 'Vera.ttf')))
    pdfmetrics.registerFont(TTFont('GuideBold', str(bundled / 'VeraBd.ttf')))
pdfmetrics.registerFontFamily('Guide', normal='Guide', bold='GuideBold', italic='Guide', boldItalic='GuideBold')
STYLES = {
    'body': ParagraphStyle('body', fontName='Guide', fontSize=10.2, leading=15.3, textColor=INK),
    'small': ParagraphStyle('small', fontName='Guide', fontSize=8.5, leading=12, textColor=MUTED),
    'sub': ParagraphStyle('sub', fontName='GuideBold', fontSize=13, leading=18, textColor=GREEN),
    'title': ParagraphStyle('title', fontName='GuideBold', fontSize=29, leading=34, textColor=GREEN),
    'table': ParagraphStyle('table', fontName='Guide', fontSize=9, leading=12.7, textColor=INK),
}
PDF = OUT / 'Mohammed-Abba-Isa-Project-Guide.pdf'
c = canvas.Canvas(str(PDF), pagesize=(W,H), pageCompression=1)
c.setTitle('Mohammed Abba Isa - The Work in Numbers | Illustrated Project Guide')
c.setAuthor('Jerry Zachary Bannister')
c.setSubject('Website, videos, methods and rationale, evidence boundaries, and development links')
page = 0
y = 0

def p(text, style='body', width=CW, x=M, gap=10):
    global y
    obj = Paragraph(text, STYLES[style])
    _, height = obj.wrap(width, H)
    if y-height < 54:
        raise ValueError(f'Page {page} text overflows: {text[:90]} (y={y}, h={height})')
    obj.drawOn(c, x, y-height)
    y -= height+gap

def link(label, url, style='body'):
    p(f'<link href="{escape(url, {chr(34): "&quot;"})}" color="#0B5D3B"><u>{escape(label)}</u></link>', style)

def begin(kicker, title):
    global page, y
    if page:
        c.showPage()
    page += 1
    c.setFillColor(GREEN)
    c.rect(0,H-14,W,14,fill=1,stroke=0)
    c.setFont('GuideBold',8)
    c.drawString(M,H-41,'THE WORK IN NUMBERS  /  ILLUSTRATED PROJECT GUIDE')
    c.setStrokeColor(LINE)
    c.line(M,42,W-M,42)
    c.setFont('Guide',8)
    c.setFillColor(MUTED)
    c.drawString(M,27,'7 November 2026  |  Owner-authorised hosted draft')
    c.drawRightString(W-M,27,f'{page} / 8')
    y = H-76
    p(kicker.upper(),'small',gap=5)
    p(title,'title',gap=15)

def shot(name, caption, maxh=255):
    global y
    path = ROOT / 'docs/images' / name
    with Image.open(path) as im:
        iw, ih = im.size
    scale = min(CW/iw,maxh/ih)
    dw,dh = iw*scale,ih*scale
    c.setStrokeColor(LINE)
    c.rect(M-1,y-dh-1,dw+2,dh+2,fill=0,stroke=1)
    c.drawImage(str(path),M,y-dh,width=dw,height=dh,mask='auto')
    y -= dh+9
    p(caption,'small',gap=15)

def note(title, text):
    p(title,'sub',gap=4)
    p(text)

def rows(items, left=143):
    global y
    for title, body in items:
        a=Paragraph(title,STYLES['table'])
        b=Paragraph(body,STYLES['table'])
        _,ha=a.wrap(left-16,H)
        _,hb=b.wrap(CW-left-16,H)
        rh=max(ha,hb)+18
        if y-rh < 57:
            raise ValueError(f'Page {page} table overflow')
        c.setFillColor(PALE)
        c.rect(M,y-rh,left,rh,fill=1,stroke=0)
        c.setStrokeColor(LINE)
        c.line(M,y-rh,M+CW,y-rh)
        a.drawOn(c,M+8,y-9-ha)
        b.drawOn(c,M+left+8,y-9-hb)
        y-=rh
    y-=12

begin('01 / The project','Mohammed Abba Isa<br/>The Work in Numbers')
p('An independent appreciation project about disability inclusion, told through documented contributions and the reports behind them.')
shot('home.png','Actual desktop viewport: Isa\'s portrait is surrounded by green and white rings, orbiting destinations and advocacy concepts. This is a still from the animated home page.',245)
link('Open the website',BASE+'/')
link('Open the source repository',REPO)
note('A tribute you can investigate','Start with Figures, Themes, Connections or the Chat assistant. Follow a number, phrase or relationship back to its source instead of treating the interface as proof of impact.')
note('Who it is for','Members of the public, journalists and researchers who want a readable starting point for exploring reported disability-inclusion work.')
p('English is the original language. Hausa, Yoruba and Igbo translations remain draft. The site is a publicly accessible preview with search indexing discouraged. It does not imply official endorsement.','small')

begin('02 / Figures','Read a number.<br/>Keep its context.')
shot('figures.png','Reported achievements appear above planned support. Cards preserve bounds such as greater-than, approximations, and separate units for people and households.')
note('What to do','Choose a contribution category, read the programme label and unit, then open <b>Source +</b> for the supporting report and qualifications.')
note('Why the layout matters','A target is an intention, not delivery. A report of training, a placement and a household-support plan describe different things. Showing stage and unit alongside each number helps prevent misleading comparisons.')
note('How to interpret it','Do not add overlapping cohorts or follow-up reports into a unique-person total. Reported delivery is attributed to its source; it is not independently audited programme impact or a complete career record.')
link('Open the figures section',BASE+'/explore/?section=overview')
link('Read metric definitions',REPO+'/blob/main/docs/CONTRIBUTION_METRICS.md','small')

begin('03 / Themes','See the language.<br/>Find the reports.')
shot('themes.png','A documentary speaking photograph sits beside phrases of different sizes. Superscripts express relative frequency; each concept can reveal matching source records.')
note('What the cloud shows','Larger phrases occur in more of the selected canonical reports. Activity mode uses matching recorded activities instead. A list alternative gives another way to inspect the terms.')
note('Why we use phrase counts','A defined phrase list and one count per report make the displayed size explainable. Repeating a phrase many times inside one article does not give that article extra votes.')
note('What the superscripts mean','A value such as 0.43 means a rounded share of the selected reports or activities, depending on the mode. Themes overlap, so their shares do not have to sum to one.')
p('The displayed cloud is not an NMF topic-weight visualisation, a public-opinion measure or an impact ranking. TF-IDF and NMF support a separate descriptive exploration of the text.','small')
link('Open themes and matching records',BASE+'/explore/?section=advocacy')

begin('04 / Connections','Follow a partner.<br/>Inspect an initiative.')
shot('connections.png','Desktop uses three columns: Isa and his office, people/organisations, and initiatives. A selected DataLead Africa path is highlighted; this viewport shows part of the larger network.',235)
# Mobile screenshot and explanation sit side by side, preserving the screenshot aspect ratio.
image_path=ROOT/'docs/images/mobile-connections.png'
with Image.open(image_path) as im:
    iw,ih=im.size
mobile_h=210
mobile_w=mobile_h*iw/ih
c.drawImage(str(image_path),M+CW-mobile_w,y-mobile_h,width=mobile_w,height=mobile_h,mask='auto')
start_y=y
p('A simpler path on phones','sub',width=CW-mobile_w-20,gap=5)
p('Choose a partner first, then follow the highlighted path to its initiative tiles. Show all connections and List remain available. The image at right is an actual portrait-mobile viewport.','body',width=CW-mobile_w-20)
p('We map source-bound roles so visitors can explore who appears in a record and what connects them. A meeting, intention, agreement and programme are different claims. Co-occurrence in an article alone does not prove partnership.','body',width=CW-mobile_w-20)
y=min(y,start_y-mobile_h)-15
link('Open the connections section',BASE+'/explore/?section=collaborations')

begin('05 / Guided questions','Choose a question.<br/>Follow the evidence.')
shot('chat.png','The prepared question tree offers programme choices with planned/reported labels, Back, Start again, further options and source-detail access.',245)
note('Why a deterministic question tree','Prepared answers and follow-up options are predictable and reviewable. They support guided exploration without requiring a paid inference API. The assistant does not impersonate Isa and does not promise unrestricted free-text understanding.')
note('One language control','Page and chat share the selected language and supported conversation/record context. English, Hausa, Yoruba and Igbo remain visibly ordered rather than hidden in a menu. All translated locales are draft.')
link('English guided chat',BASE+'/chat/')
link('Hausa guided chat - draft',BASE+'/ha/chat/')
link('Yoruba guided chat - draft',BASE+'/yo/chat/')
link('Igbo guided chat - draft',BASE+'/ig/chat/')
p('Keyboard/focus support, list alternatives, motion preferences and image fallbacks are implemented. Automated checks do not establish full accessibility certification or human translation approval.','small')

begin('06 / Research methods','What we used.<br/>Why we used it.')
# A simple vector pipeline remains sharp at any zoom level.
boxw=(CW-28)/3
for i,(a,b) in enumerate([('COLLECT','Public reports + source URLs'),('CHECK','Text, repeats + claim context'),('PRESENT','Figures, themes + source actions')]):
    xx=M+i*(boxw+14)
    c.setFillColor(PALE)
    c.roundRect(xx,y-62,boxw,62,7,fill=1,stroke=0)
    c.setFillColor(GREEN)
    c.setFont('GuideBold',9)
    c.drawString(xx+10,y-20,a)
    c.setFont('Guide',7.3)
    c.drawString(xx+10,y-39,b)
    if i<2:
        c.setStrokeColor(GREEN)
        c.line(xx+boxw+2,y-31,xx+boxw+12,y-31)
        c.line(xx+boxw+9,y-28,xx+boxw+12,y-31)
        c.line(xx+boxw+9,y-34,xx+boxw+12,y-31)
y-=82
rows([
('<b>Python + WordPress API</b>','Collect public office reports repeatedly while preserving URLs and publication metadata. <b>Why:</b> traceability and reproducible collection.'),
('<b>Beautiful Soup</b>','Extract readable article text from HTML. <b>Why:</b> webpage markup should not become analysis content.'),
('<b>Deduplication + aliases</b>','Identify exact text copies and preserve references to canonical records. <b>Why:</b> exact repeats should not inflate text counts.'),
('<b>Source-context review</b>','Check units, bounds, stages, attribution and overlap against reports. <b>Why:</b> avoid combining plans, delivery and repeated cohorts.'),
('<b>TF-IDF</b>','Weight distinctive words/phrases in selected English reports. <b>Why:</b> reduce common-term dominance and build inspectable text features.'),
('<b>NMF</b>','Group weighted terms into eight recurring topics in the selected v1 fit. <b>Why:</b> inspect additive textual patterns alongside source reports.'),
('<b>Manual categories</b>','Read and label activities, allowing multiple categories. <b>Why:</b> meaningful filters need activity context, separate from model topics.'),
('<b>Phrase counts</b>','Count each defined phrase once per canonical report. <b>Why:</b> make cloud size and relative frequency explainable and reproducible.'),
])
p('Selected v1 fit: 30 distinct texts and eight topics, separate from the wider archive exploratory model. Source-context checks are not independent verification. Topics describe text; they are not sentiment, certified categories or causal effects.','small')
link('Read the plain-language methodology',BASE+'/about/methodology/','small')

begin('07 / Engineering and verification','How the pieces<br/>become a website.')
rows([
('<b>Source-bound relationships</b>','Map actors to initiatives and documented roles. <b>Why:</b> discover connections while distinguishing meetings, intentions and reported programmes.'),
('<b>Guided question tree</b>','Use prepared source-linked answers. <b>Why:</b> predictable reviewable navigation without paid runtime inference.'),
('<b>Static export</b>','Next.js, React and TypeScript produce prebuilt pages; free Cloudflare Pages serves them. <b>Why:</b> simple free hosting without a model server.'),
('<b>AI coding agents</b>','Support collection/analysis scripts, interface work, draft translations and checks under owner feedback. <b>Why:</b> help build and iterate across the workflow.'),
])
note('Repository map','<b>apps/web</b>: public app and guided flows. <b>content</b>: evidence bundles, presentation additions, translations and provenance. <b>research / scripts</b>: review and automation. <b>studio</b>: optional standalone Sanity editor; no live dataset is connected for this release.')
note('Run and validate','Node 22.12+ and npm 11. On Windows: <b>npm.cmd ci</b>, <b>npm.cmd run preflight</b>, then <b>npm.cmd run dev</b>. Required checks: <b>npm.cmd run lint</b>, <b>npm.cmd run typecheck</b>, <b>npm.cmd test</b>, <b>npm.cmd run build</b>.')
note('Recorded evidence, 6 November','Preflight, lint, typecheck, 76 tests, language coverage and web/Studio builds passed. Live landing/mobile-network checks recorded zero axe violations across 13 tested states. These results have a defined test scope and do not certify universal accessibility.')
p('GitHub pushes do not deploy the website automatically. Credentials stay outside the repository. Static output does not establish full offline reload support. Agent work does not establish evidence validity, language approval or reuse rights.','small')
link('Validation evidence and limitations',REPO+'/blob/main/docs/VALIDATION.md','small')
link('Operations and publication procedure',REPO+'/blob/main/docs/OPERATIONS.md','small')

begin('08 / Links, videos and creator','Explore. Watch.<br/>Keep the limits visible.')
link('Website: Home',BASE+'/')
link('Explore: figures, themes and connections',BASE+'/explore/')
link('About and creator contact',BASE+'/about/')
link('Methodology and technical disclosure',BASE+'/about/methodology/')
link('Public video release and downloads',RELEASE)
link('Desktop video - 1920 x 1080 MP4',ASSETS+'Hon-Mohammed-Abba-Isa-desktop.mp4')
link('Mobile video - 1080 x 1920 MP4',ASSETS+'Hon-Mohammed-Abba-Isa-mobile.mp4')
p('Both walkthroughs run 3:16, with 40 English caption cues, music and no narration. Tribute opening: 0:00-0:06. Methods: 2:18-2:58. Author ending: 3:06-3:16. Owner permission to publish the supplied music was recorded on 7 November 2026.','small')
note('Creator','Jerry Zachary Bannister is a statistician, data scientist and researcher in Statistics at Abubakar Tafawa Balewa University, Bauchi, and the creator of JJMB Datascience Hub. His work applies statistics, ML and AI to local problems. His vision is accessible, affordable tools shaped by disabled people\'s needs and choices.')
note('Current release boundary','The site is an owner-authorised hosted draft. Translations remain draft; stricter indexed-public-release gates remain. Photo/logo publication permission is owner-attested, not independently licensed here. Human language review, remaining human accessibility checks and fresh performance evidence must be recorded honestly.')
p('No official endorsement, causal impact finding, unique-beneficiary total or blanket code/media licence is claimed. The earlier adapted baobab artwork has a separate CC BY-SA 4.0 notice. Video publication permission is not a licence for others to reuse the music.','small')
link('Source repository and README',REPO,'small')
link('Publication record and scope',REPO+'/blob/main/docs/PUBLICATION_2026-11-06.md','small')
p('Screenshots: actual hosted-site captures from the 6 November demo, application checkpoint 0b55bdd. Visual descriptions accompany the images; screenshot provenance is in docs/images/README.md. This guide is descriptive documentation, not a tagged-PDF accessibility certification.','small')
c.save()
shutil.copyfile(PDF,ROOT/'docs/PROJECT_GUIDE.pdf')
doc=fitz.open(PDF)
assert len(doc)==8, len(doc)
links=sum(len(pg.get_links()) for pg in doc)
assert links>=20,links
for i,pg in enumerate(doc):
    assert pg.get_text().strip(),i
    pg.get_pixmap(matrix=fitz.Matrix(1,1)).save(PROOF/f'guide-page-{i+1}.png')
thumbs=[]
for i in range(8):
    img=Image.open(PROOF/f'guide-page-{i+1}.png').convert('RGB')
    img.thumbnail((298,421))
    thumbs.append(img)
contact=Image.new('RGB',(4*310,2*445),'#DCE5DF')
for i,img in enumerate(thumbs):
    contact.paste(img,((i%4)*310+6,(i//4)*445+6))
contact.save(PROOF/'guide-contact-sheet.png')
print(f'Built {PDF}; {len(doc)} pages; {links} clickable links; {PDF.stat().st_size:,} bytes')

