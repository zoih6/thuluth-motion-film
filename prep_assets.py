import numpy as np, cv2
from PIL import Image
from scipy import ndimage as ndi
from collections import deque

# ---- 1. calligraphy: alpha from luminance + writing-order map
im=np.asarray(Image.open('gen_thuluth_word.png').convert('L')).astype(np.float32)/255
a=np.clip((0.82-im)/0.5,0,1)            # ink alpha
mask=a>0.35
lab,n=ndi.label(mask)
objs=ndi.find_objects(lab)
comps=[]
for i,sl in enumerate(objs):
    area=(lab[sl]==i+1).sum()
    if area<60: continue
    y0,y1,x0,x1=sl[0].start,sl[0].stop,sl[1].start,sl[1].stop
    comps.append(dict(id=i+1,area=int(area),x0=x0,x1=x1,y0=y0,y1=y1,cx=(x0+x1)/2))
comps.sort(key=lambda c:-c['area'])
for c in comps: print(c)
body=comps[0]
# alif: tall, thin, rightmost
rest=comps[1:]
alif=max(rest,key=lambda c:(c['y1']-c['y0'])/(c['x1']-c['x0']+1)*(c['x1']>1150))
others=[c for c in rest if c is not alif]
# dots (big squares) before harakat (small/top)
dots=[c for c in others if c['area']>3000]; marks=[c for c in others if c['area']<=3000]
dots.sort(key=lambda c:-c['cx']); marks.sort(key=lambda c:(-c['cx']))
byid={c['id']:c for c in comps}
IDS=[4,3,8,6,9,5,2,1]
order=[(byid[4],'top'),(byid[3],'body')]+[(byid[i],'right') for i in IDS[2:]]
nd=3; nm=3
# time segments in 0..1
segs=[(0.00,0.13)]+[(0.13,0.62)]
t=0.62
for i in range(nd): segs.append((t,t+0.055)); t+=0.045
for i in range(nm): segs.append((t,t+0.07)); t+=0.06
scale=1/max(1,segs[-1][1])
H,W=mask.shape
orderMap=np.full((H,W),255,np.float32)
def geodesic(m,start):
    d=np.full(m.shape,-1,np.int32); q=deque([start]); d[start]=0
    while q:
        y,x=q.popleft()
        for dy,dx in ((1,0),(-1,0),(0,1),(0,-1),(1,1),(1,-1),(-1,1),(-1,-1)):
            yy,xx=y+dy,x+dx
            if 0<=yy<m.shape[0] and 0<=xx<m.shape[1] and m[yy,xx] and d[yy,xx]<0:
                d[yy,xx]=d[y,x]+1; q.append((yy,xx))
    return d
grow=ndi.binary_dilation(mask,iterations=3)
lab2=lab.copy()
for (c,mode),(s0,s1) in zip(order,segs):
    cm=(lab==c['id'])
    cmg=ndi.binary_dilation(cm,iterations=4)&grow
    ys,xs=np.nonzero(cmg)
    if mode=='top': k=np.argmin(ys)
    elif mode=='body':
        # start at the top of the first (rightmost) lam stem
        sel=xs>xs.max()-0.33*(xs.max()-xs.min()); k=np.argmin(np.where(sel,ys,1e9))
    else: k=np.argmax(xs-0.5*ys)
    d=geodesic(cmg,(ys[k],xs[k]))
    dd=d[cmg].astype(np.float32); dd/=dd.max()
    vals=(s0+(s1-s0)*dd)*scale
    om=orderMap[cmg]; orderMap[cmg]=np.minimum(om,vals*254)
# fill ink antialias pixels outside dilation with nearest value
far=orderMap>=255
idx=ndi.distance_transform_edt(far,return_distances=False,return_indices=True)
orderMap=orderMap[idx[0],idx[1]]
# crop
ys,xs=np.nonzero(a>0.02); pad=20
y0,y1,x0,x1=max(ys.min()-pad,0),min(ys.max()+pad,H),max(xs.min()-pad,0),min(xs.max()+pad,W)
rgba=np.zeros((y1-y0,x1-x0,4),np.uint8); rgba[...,3]=(a[y0:y1,x0:x1]*255).astype(np.uint8)
rgba[...,:3]=(18,14,12)
dm=ndi.binary_dilation(lab==7,iterations=3)[y0:y1,x0:x1]
r2=rgba.copy(); r2[...,3]=np.where(dm,r2[...,3],0); Image.fromarray(r2).save('thuluth_dot.png')
rgba[...,3]=np.where(dm,0,rgba[...,3])
ys7,xs7=np.nonzero(dm); print('DOT7 center crop coords',xs7.mean(),ys7.mean(),'size',np.ptp(xs7),np.ptp(ys7))
print('crop origin',x0,y0)
Image.fromarray(rgba).save('thuluth_ink.png')
Image.fromarray(orderMap[y0:y1,x0:x1].astype(np.uint8)).save('thuluth_order.png')
print('calligraphy',rgba.shape,'segments',len(segs))

# ---- 2. cutouts on white background: crown, qalam
def cutout(src,dst,tol=26):
    rgb=np.asarray(Image.open(src).convert('RGB')).astype(np.int16)
    bg=np.median(np.concatenate([rgb[:8].reshape(-1,3),rgb[-8:].reshape(-1,3),rgb[:,:8].reshape(-1,3),rgb[:,-8:].reshape(-1,3)]),0)
    dist=np.abs(rgb-bg).max(-1)
    cand=dist<tol
    lab,_=ndi.label(cand)
    border=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
    bgm=np.isin(lab,list(border))
    fg=~bgm
    fg=ndi.binary_opening(fg,iterations=1)
    al=cv2.GaussianBlur(fg.astype(np.float32),(3,3),0)
    ys,xs=np.nonzero(fg); pad=6
    y0,y1,x0,x1=ys.min()-pad,ys.max()+pad,xs.min()-pad,xs.max()+pad
    out=np.dstack([rgb.astype(np.uint8),(al*255).astype(np.uint8)])[y0:y1,x0:x1]
    Image.fromarray(out).save(dst); print(dst,out.shape)
cutout('gen_crown.png','crown.png')
cutout('gen_qalam.png','qalam.png',tol=18)
