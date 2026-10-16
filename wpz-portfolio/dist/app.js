import { CARD_CONFIG } from './card-config.js';
const scene=document.querySelector('.scene');
const front=document.querySelector('.front');
const back=document.querySelector('.back');
back.querySelector('.email').textContent=CARD_CONFIG.email;
back.querySelector('.placeholder').textContent=CARD_CONFIG.contactNote;
document.querySelectorAll('.contact-line>span:first-child').forEach(el=>{el.textContent=CARD_CONFIG.email});
for(const side of ['front','back']){
 const settings=CARD_CONFIG.images[side];if(!settings.src)continue;
 const image=document.createElement('img');image.src=settings.src;image.alt=settings.alt;image.className='card-fallback-image';
 Object.assign(image.style,{left:settings.box.x*100+'%',top:settings.box.y*100+'%',width:settings.box.width*100+'%',height:settings.box.height*100+'%',objectFit:settings.fit,opacity:settings.opacity});
 const face=document.querySelector('.'+side);face.append(image);
 image.style.display='none';image.addEventListener('load',()=>{image.style.display='block';if(settings.replaceLogo)face.querySelector(side==='front'?'.prism-logo':'.back-logo').style.visibility='hidden'});
}
scene.addEventListener('click',()=>{
 const flipped=scene.getAttribute('aria-pressed')!=='true';
 scene.setAttribute('aria-pressed',String(flipped));
 scene.setAttribute('aria-label',flipped?'Contato: '+CARD_CONFIG.email+'. '+CARD_CONFIG.contactNote+'. Virar para a frente do cartão '+CARD_CONFIG.logo:'Virar cartão WPZ para ver o contato');
 front.setAttribute('aria-hidden',String(flipped));
 back.setAttribute('aria-hidden',String(!flipped));
});

const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const hoverPointer=window.matchMedia('(hover: hover) and (pointer: fine)');
function resetParallax(){
 scene.classList.remove('is-hovering');
 ['--tilt-x','--tilt-y','--zoom','--logo-x','--logo-y'].forEach(name=>scene.style.removeProperty(name));
}
scene.addEventListener('pointermove',event=>{
 if(scene.classList.contains('webgl-ready')||event.pointerType==='touch'||reducedMotion.matches||!hoverPointer.matches)return;
 const bounds=scene.getBoundingClientRect();
 const x=Math.max(-1,Math.min(1,(event.clientX-bounds.left)/bounds.width*2-1));
 const y=Math.max(-1,Math.min(1,(event.clientY-bounds.top)/bounds.height*2-1));
 scene.classList.add('is-hovering');
 scene.style.setProperty('--tilt-x',`${-y*9}deg`);
 scene.style.setProperty('--tilt-y',`${x*12}deg`);
 scene.style.setProperty('--zoom','1.07');
 scene.style.setProperty('--logo-x',`${x*5}px`);
 scene.style.setProperty('--logo-y',`${y*4}px`);
});
scene.addEventListener('pointerleave',resetParallax);
scene.addEventListener('pointercancel',resetParallax);
window.addEventListener('blur',resetParallax);
reducedMotion.addEventListener('change',resetParallax);
hoverPointer.addEventListener('change',resetParallax);

document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelectorAll('.project-row').forEach(row=>{row.hidden=button.dataset.filter!=='all'&&row.dataset.category!==button.dataset.filter})}));
const themeToggle=document.querySelector('#theme-toggle');
function applyTheme(dark){document.documentElement.dataset.theme=dark?'dark':'light';themeToggle.setAttribute('aria-pressed',String(dark));themeToggle.setAttribute('aria-label',dark?'Ativar tema claro':'Ativar tema escuro');document.querySelector('meta[name="theme-color"]').content=dark?'#0b0b0d':'#f0f0ed';}
try{applyTheme(localStorage.getItem('wpz-theme')==='dark')}catch{applyTheme(false)}
themeToggle.addEventListener('click',()=>{const dark=document.documentElement.dataset.theme!=='dark';applyTheme(dark);try{localStorage.setItem('wpz-theme',dark?'dark':'light')}catch{}});
const sectionObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){const id=entry.target.classList.contains('hero')?'inicio':entry.target.id;document.querySelectorAll('.nav nav a').forEach(a=>a.classList.toggle('active',a.hash==='#'+id))}})},{rootMargin:'-10% 0px -55% 0px'});document.querySelectorAll('.hero,main section[id]').forEach(s=>sectionObserver.observe(s));