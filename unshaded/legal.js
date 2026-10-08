/* UNSHADED support pages: shared behaviour. Everything here is decoration; the pages read fine without it. */
(function(){'use strict';
var d=document,h=d.documentElement,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
var $=function(s,r){return(r||d).querySelector(s)},$$=function(s,r){return[].slice.call((r||d).querySelectorAll(s))};
function safe(fn){try{fn()}catch(e){if(window.console)console.warn('legal.js:',e)}}
h.classList.add('js');
/* failsafe: if anything below dies, or the browser can't observe scrolling, show everything */
setTimeout(function(){if(!window.__lready)h.classList.add('show-all')},4500);
if(!('IntersectionObserver' in window))h.classList.add('show-all');

/* one shared pointer for every light: it holds its last spot and fades when you leave, it never wanders off */
var P={x:innerWidth/2,y:innerHeight/2,in:false,has:false},aura=$('#aura');
addEventListener('pointermove',function(e){P.x=e.clientX;P.y=e.clientY;P.in=true;P.has=true;if(aura)aura.classList.add('on')},{passive:true});
function away(){P.in=false;if(aura)aura.classList.remove('on')}
d.addEventListener('mouseleave',away);d.addEventListener('mouseout',function(e){if(!e.relatedTarget)away()});addEventListener('blur',away);addEventListener('touchend',away);

/* title: words rise in one by one */
safe(function(){var t=$('main h1');if(!t||reduce)return;var txt=t.textContent.trim();t.setAttribute('aria-label',txt);
  t.innerHTML=txt.split(/\s+/).map(function(w,i){return'<span class="w" aria-hidden="true" style="--i:'+i+'">'+w.replace(/&/g,'&amp;')+'</span>'}).join(' ')});

/* reveal on scroll */
safe(function(){
  $$('main .lede,main .updated,main .qn,main section,main .grid .card,main .fine,main .center,main > .box,main > .btns,.fbrand,.flinks a,.fbase').forEach(function(el){el.classList.add('rv')});
  $$('main section li').forEach(function(li,i){li.classList.add('rv');li.style.transitionDelay=(i%7)*55+'ms'});
  $$('main .grid .card,.flinks a').forEach(function(el,i){el.style.transitionDelay=(i%5)*90+'ms'});
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var el=e.target;el.classList.add('in');io.unobserve(el);
    setTimeout(function(){el.classList.add('done');el.style.transitionDelay=''},1500)})},{threshold:.1,rootMargin:'0px 0px -5% 0px'});
  $$('.rv').forEach(function(el){io.observe(el)})});

/* reading progress + header + scroll spy on the contents list */
safe(function(){var bar=$('#prog'),hdr=$('header'),links=$$('.qn a[href^="#"]'),secs=links.map(function(a){return $(a.getAttribute('href'))}),tick=false;
  function upd(){tick=false;var m=h.scrollHeight-innerHeight;bar.style.transform='scaleX('+(m>0?Math.min(1,scrollY/m):0)+')';hdr.classList.toggle('solid',scrollY>16);
    var y=innerHeight*.32,cur=-1;secs.forEach(function(s,i){if(s&&s.getBoundingClientRect().top<=y)cur=i});links.forEach(function(a,i){a.classList.toggle('on',i===cur)})}
  addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});addEventListener('resize',upd);upd()});

/* panels light up under the cursor; buttons lean toward it */
safe(function(){if(matchMedia('(hover:none)').matches)return;
  addEventListener('pointermove',function(e){var c=e.target.closest&&e.target.closest('.card,.box,.lede,.flinks a');
    if(c){var r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')}
    if(reduce)return;var b=e.target.closest&&e.target.closest('.btn,.email');
    if(b){var q=b.getBoundingClientRect();b.style.translate=((e.clientX-q.left)/q.width-.5)*10+'px '+((e.clientY-q.top)/q.height-.5)*8+'px'}},{passive:true});
  addEventListener('pointerout',function(e){var b=e.target.closest&&e.target.closest('.btn,.email');if(b)b.style.translate=''},{passive:true})});

/* the glow that follows the cursor */
safe(function(){if(!aura||reduce||matchMedia('(hover:none)').matches)return;var ax=P.x,ay=P.y;
  (function f(){ax+=(P.x-ax)*.12;ay+=(P.y-ay)*.12;aura.style.transform='translate('+ax.toFixed(1)+'px,'+ay.toFixed(1)+'px)';requestAnimationFrame(f)})()});

/* drifting pixel motes, brighter near the cursor */
safe(function(){var cv=$('#motes');if(!cv||!cv.getContext)return;var g=cv.getContext('2d'),M=[],W=0,H=0,k=0,last=0,col='183,156,255';
  var hex=getComputedStyle(h).getPropertyValue('--glow').trim();if(/^#[0-9a-f]{6}$/i.test(hex))col=[1,3,5].map(function(i){return parseInt(hex.substr(i,2),16)}).join(',');
  function size(){var dpr=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W+'px';cv.style.height=H+'px';g.setTransform(dpr,0,0,dpr,0,0);
    var n=Math.max(28,Math.min(90,Math.round(W*H/22000)));M=[];for(var i=0;i<n;i++)M.push({x:Math.random()*W,y:Math.random()*H,s:2+Math.floor(Math.random()*3),vy:-(.08+Math.random()*.24),vx:(Math.random()-.5)*.12,a:.16+Math.random()*.4,p:Math.random()*6.28})}
  function draw(t){g.clearRect(0,0,W,H);k+=((P.in?1:P.has?.3:0)-k)*.08;
    for(var i=0;i<M.length;i++){var m=M[i];m.x+=m.vx;m.y+=m.vy;if(m.y<-8){m.y=H+8;m.x=Math.random()*W}if(m.x<-8)m.x=W+8;if(m.x>W+8)m.x=-8;
      var dx=m.x-P.x,dy=m.y-P.y,dist=Math.sqrt(dx*dx+dy*dy),near=Math.max(0,1-dist/230)*k;
      if(near>0&&dist>1){m.x+=dx/dist*near*.5;m.y+=dy/dist*near*.5}
      var a=Math.min(1,m.a*(.55+.45*Math.sin(t/900+m.p))+near*.85);g.fillStyle='rgba('+col+','+a.toFixed(3)+')';g.fillRect(Math.round(m.x),Math.round(m.y),m.s,m.s)}}
  function loop(t){requestAnimationFrame(loop);if(d.hidden||t-last<33)return;last=t;draw(t)}
  size();var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(size,200)});
  if(reduce)draw(0);else requestAnimationFrame(loop)});

/* a little burst of pixels, used when you copy the email */
window.uBurst=function(el){if(reduce||!el.animate)return;var r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
  for(var i=0;i<20;i++)(function(){var p=d.createElement('i');p.className='bp';var a=Math.random()*6.283,dist=70+Math.random()*120;p.style.left=cx+'px';p.style.top=cy+'px';d.body.appendChild(p);
    var an=p.animate([{transform:'translate(-50%,-50%) scale(1)',opacity:1},{transform:'translate(calc(-50% + '+Math.cos(a)*dist+'px),calc(-50% + '+Math.sin(a)*dist+'px)) scale(.2)',opacity:0}],{duration:700+Math.random()*500,easing:'cubic-bezier(.1,.7,.2,1)'});an.onfinish=function(){p.remove()}})()};

safe(function(){var b=$('#toTop');if(b)b.onclick=function(){scrollTo({top:0,behavior:reduce?'auto':'smooth'})}});
window.__lready=1;
})();
