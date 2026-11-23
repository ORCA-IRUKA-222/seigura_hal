"""ダミー画像の生成（実在の人物・ロゴ・公式画像は一切使用しない）。
画像が入る場所が分かればよいので、「IMAGE」と書いた灰色の枠だけを作る。"""
from PIL import Image, ImageDraw, ImageFont
FONT='/usr/share/fonts/opentype/ipafont-gothic/ipag.ttf'
SS=2
def f(sz): return ImageFont.truetype(FONT, sz*SS)

def dummy(w,h,caption,tone,path):
    W,H=w*SS,h*SS
    bg={'light':(224,224,228),'dark':(120,120,130)}[tone]
    fg={'light':(150,150,158),'dark':(70,70,80)}[tone]
    tx={'light':(110,110,120),'dark':(235,235,240)}[tone]
    im=Image.new('RGB',(W,H),bg); d=ImageDraw.Draw(im)
    d.line([(0,0),(W,H)],fill=fg,width=2*SS); d.line([(0,H),(W,0)],fill=fg,width=2*SS)
    d.rectangle([0,0,W-1,H-1],outline=fg,width=3*SS)
    s=int(min(W,H)*.12/SS)
    font=f(max(s,20)); t='IMAGE'; tw=d.textlength(t,font=font)
    bw,bh=tw+60*SS,font.size+30*SS
    d.rectangle([(W-bw)/2,(H-bh)/2,(W+bw)/2,(H+bh)/2],fill=bg)
    d.text(((W-tw)/2,(H-font.size)/2-4*SS),t,font=font,fill=tx)
    if caption:
        f2=f(max(int(min(W,H)*.035/SS),14)); cw=d.textlength(caption,font=f2)
        d.text(((W-cw)/2,(H+bh)/2+14*SS),caption,font=f2,fill=tx)
    im=im.resize((w,h),Image.LANCZOS); im.save(path,quality=88)

o='img/'
for k in ['aoki','aoyama','asami','yakushiji']:
    port=(k=='asami'); w,h=(800,1200) if port else (1200,800)
    dummy(w,h,'昼の部（ダミー）','light',f'{o}day-{k}.jpg')
    dummy(w,h,'夜の部（ダミー）','dark',f'{o}night-{k}.jpg')
dummy(800,652,'全身タペストリー','light',o+'g2.jpg')
dummy(800,1000,'アクリルスタンド','light',o+'g3.jpg')
dummy(800,546,'ランダム缶バッジ','light',o+'g4.jpg')
dummy(800,452,'フォトパンフレット','light',o+'g5.jpg')
dummy(800,560,'メインビジュアル（ダミー）','dark',o+'goods-key.jpg')
dummy(1200,300,'タイトルロゴ（ダミー）','light',o+'logo.jpg')
