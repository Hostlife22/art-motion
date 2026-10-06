// Original Canvas pixel adventure. All scenery and effects are deterministic;
// Milo's sprites come from the generated atlas and share the long-scroll anchors.
(() => {
const {clamp,lerp}=U, meta={};
for(const key of ['8bit_walk','8bit_act']) {
  const request=new XMLHttpRequest(); request.open('GET',`demos/long_scroll/frames/${key}/meta.json`,false); request.send();
  if(request.status!==200) throw new Error(`Missing Milo metadata: ${key}`);
  meta[key]=JSON.parse(request.responseText);
}
const canvas=PAINT.canvas(240,135),g=canvas.getContext('2d');
const text=(s,x,y,col='#fff',size=5)=>{g.fillStyle=col;g.font=`${size}px "PressStart2P-400"`;g.textBaseline='top';g.fillText(s,x,y);};
function scenery(t,night=false) {
  g.fillStyle=night?'#171d39':'#649cd8';g.fillRect(0,0,240,135);
  if(!night) for(const [x,y] of [[16,32],[130,25],[210,43]]) {g.fillStyle='#f8f6e8';g.fillRect(x,y,23,5);g.fillRect(x+4,y-4,15,5);g.fillRect(x+9,y-7,6,4);}
  g.fillStyle=night?'#263344':'#447434';
  for(const [x,w,h] of [[-8,45,22],[170,65,30]]) {g.beginPath();g.moveTo(x,115);g.lineTo(x+w/2,115-h);g.lineTo(x+w,115);g.fill();}
  g.fillStyle='#2c261f';g.fillRect(0,115,240,20);
  for(let y=115;y<135;y+=7) for(let x=(y===122?-7:0);x<240;x+=14) {g.fillStyle='#b77946';g.fillRect(x+1,y+1,12,5);g.fillStyle='#e7ad68';g.fillRect(x+1,y+1,12,1);}
  g.fillStyle='#e6c784';g.fillRect(0,114,240,1);
}
function hud(score=200,coins=1) {text('MILO',8,5);text(String(score).padStart(6,'0'),8,12);text('WORLD',112,5);text('1-1',119,12);text('TIME',198,5);text('390',201,12);text('x'+String(coins).padStart(2,'0'),69,12,'#fbe077');}
function actor(x,y,t,{key='8bit_walk',frame=null,h=36,flip=false}={}) {
  const i=frame==null?Math.floor(t*10)%8:frame,f=meta[key].frames[i],im=IMG[`demos/long_scroll/frames/${key}/${f.file}`],s=h/meta[key].ref_h;
  g.save();g.translate(Math.round(x),Math.round(y));if(flip)g.scale(-1,1);g.drawImage(im,Math.round(-f.ax*s),Math.round(-f.ay*s),Math.round(im.width*s),Math.round(im.height*s));g.restore();
}
function block(x,y,bump=0,used=false) {y-=bump;g.fillStyle='#38291d';g.fillRect(x,y,11,11);g.fillStyle=used?'#90613c':'#eeb65e';g.fillRect(x+1,y+1,9,9);g.fillStyle='#f8db96';g.fillRect(x+1,y+1,9,1);if(!used)text('?',x+3,y+3,'#6a361d',6);}
function pipe(x,y=87) {g.fillStyle='#183522';g.fillRect(x-1,y,21,28);g.fillStyle='#3bb54c';g.fillRect(x,y+6,19,22);g.fillStyle='#a1df69';g.fillRect(x+2,y+6,4,22);g.fillStyle='#1a6b2d';g.fillRect(x+15,y+6,3,22);g.fillStyle='#75d055';g.fillRect(x-3,y,25,7);g.fillStyle='#164b23';g.fillRect(x-3,y+6,25,1);}
function star(x,y,t) {g.save();g.translate(x,y);g.rotate(t*2);g.fillStyle='#ffe78b';g.beginPath();for(let k=0;k<10;k++){const a=k*Math.PI/5-Math.PI/2,r=k%2?3:7;g.lineTo(Math.cos(a)*r,Math.sin(a)*r);}g.closePath();g.fill();g.restore();}
function enemy(x,y,ball=false) {g.fillStyle='#764338';g.fillRect(x-5,y-(ball?7:11),10,ball?7:10);if(!ball){g.fillStyle='#edb57a';g.fillRect(x-4,y-7,8,5);g.fillStyle='#151b23';g.fillRect(x-3,y-7,2,2);g.fillRect(x+1,y-7,2,2);g.fillRect(x-6,y-1,5,2);g.fillRect(x+1,y-1,5,2);}}
function caption(s){g.fillStyle='rgba(17,24,36,.85)';g.fillRect(12,127,216,7);text(s,18,129,'#fff5d9',3);}
function output(c,draw) {g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,240,135);g.imageSmoothingEnabled=false;draw();c.save();c.imageSmoothingEnabled=false;c.drawImage(canvas,0,0,1920,1080);c.restore();}
SCENES.milo_choice={draw(c,lt){output(c,()=>{
  scenery(lt);hud(lt>3.4?1200:200);pipe(208);
  const jump=lt>0.45&&lt<1?Math.sin((lt-.45)/.55*Math.PI)*22:0,x=lerp(35,77,clamp(lt/.65));
  block(73,49,lt>0.72&&lt<1.05?Math.sin((lt-.72)/.33*Math.PI)*3:0,lt>1);
  if(lt>1&&lt<3.1){g.fillStyle='#14233e';g.fillRect(107,40,118,46);text('Choose a subscription?',112,45,'#fff',3);for(const [s,y]of [['OpenAI',58],['Claude',73]])text(s,124,y,'#fff',5);text('>',113,lt<1.7?58:73,'#f8d45d');}
  if(lt>2.6&&lt<3.55){const q=clamp((lt-2.6)/.95);star(lerp(160,77,q),lerp(78,87,q)-Math.sin(q*Math.PI)*18,lt);}
  const growth=1+0.6*clamp((lt-3.45)/.5);actor(x,114-jump,lt,{key:lt<1?'8bit_walk':'8bit_act',frame:lt<1?null:lt>3.8?7:0,h:36*growth});
  caption('Choose Claude. Collect a spark. Grow!');
});}};
SCENES.milo_combo={draw(c,lt){output(c,()=>{
  scenery(lt);hud(lt>2?1700:1200);const x=lerp(35,173,clamp(lt/4.5));
  const jump=lt>.65&&lt<1.45?Math.sin((lt-.65)/.8*Math.PI)*26:lt>3.2&&lt<4?Math.sin((lt-3.2)/.8*Math.PI)*22:0;
  if(lt<1.25)enemy(91,114);else if(lt<2.25)enemy(91+(lt-1.25)*58,114,true);
  if(lt<2.2)enemy(146,114);else if(lt<2.8)enemy(146+(lt-2.2)*35,114-Math.sin((lt-2.2)/.6*Math.PI)*20);
  for(const bx of [146,158,170])if(lt<3.6)block(bx,49);else {const q=lt-3.6;for(let k=0;k<4;k++){g.fillStyle='#e6a36b';g.fillRect(bx+(k%2?1:-1)*q*12,49+Math.floor(k/2)*5-q*22+q*q*30,4,4);}}
  actor(x,114-jump,lt,{key:jump?'8bit_act':'8bit_walk',frame:jump?3:null});caption('Stomp, kick, and break the blocks.');
});}};
SCENES.milo_pipe={draw(c,lt){output(c,()=>{
  if(lt<2||lt>6.6){scenery(lt);hud(1800,lt>6.6?9:1);const q=clamp(lt/1.15);actor(lerp(40,120,q),lt<1.25?114:114+(lt-1.25)*60,lt,{key:'8bit_walk'});pipe(111);if(lt>6.6){actor(173,114,lt);caption('Back outside with a backpack full of coins.');}else caption('A pipe leads to a secret room.');}
  else if(lt<4.1){g.fillStyle='#0c2a20';g.fillRect(0,0,240,135);for(let k=0;k<9;k++){const q=((k/9+(lt-2)*.7)%1),w=15+q*260,h=8+q*145;g.strokeStyle=k%2?'#50a955':'#246938';g.lineWidth=3;g.strokeRect(120-w/2,67-h/2,w,h);}hud(1800);caption('Through the green tunnel...');}
  else {scenery(lt,true);hud(1800+Math.floor((lt-4.1)*250),1+Math.min(8,Math.floor((lt-4.1)*4)));const x=lerp(45,177,clamp((lt-4.1)/2.3));for(let k=0;k<8;k++){const cx=70+k*16;if(cx>x){g.fillStyle='#f5c64a';g.fillRect(cx,84,5,9);g.fillStyle='#ffe9a0';g.fillRect(cx+1,85,1,6);}}actor(x,114,lt);caption('...to a room full of gold coins.');}
});}};
})();
