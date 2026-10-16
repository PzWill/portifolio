import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import { RoomEnvironment } from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/environments/RoomEnvironment.js';

import { CARD_CONFIG as C } from './card-config.js';

const host=document.querySelector('.scene'),front=host.querySelector('.front');
let renderer;
try {
 renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,matchMedia('(pointer: coarse)').matches?1:1.35));
 renderer.toneMapping=THREE.NeutralToneMapping;
 renderer.toneMappingExposure=1;
 renderer.domElement.className='dispersion-canvas';
 renderer.domElement.setAttribute('aria-hidden','true');
 host.prepend(renderer.domElement);
 const world=new THREE.Scene();
 const camera=new THREE.PerspectiveCamera(38,1.32,.1,40);camera.position.z=9.5;
 const generator=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();
 const env=generator.fromScene(room,.015);world.environment=env.texture;room.dispose();generator.dispose();
 const volume=new THREE.Group();world.add(volume);
 const shape=new THREE.Shape();const w=2.8,h=2.08,r=.23;
 shape.moveTo(-w+r,-h);shape.lineTo(w-r,-h);shape.quadraticCurveTo(w,-h,w,-h+r);shape.lineTo(w,h-r);shape.quadraticCurveTo(w,h,w-r,h);shape.lineTo(-w+r,h);shape.quadraticCurveTo(-w,h,-w,h-r);shape.lineTo(-w,-h+r);shape.quadraticCurveTo(-w,-h,-w+r,-h);
 const geometry=new THREE.ExtrudeGeometry(shape,{depth:C.geometry.depth,bevelEnabled:true,bevelSegments:8,bevelSize:C.geometry.bevelSize,bevelThickness:C.geometry.bevelThickness,curveSegments:24});geometry.center();
 const material=new THREE.MeshPhysicalMaterial({color:0xffffff,metalness:0,roughness:C.glass.roughness,transmission:1,thickness:C.glass.thickness,ior:C.glass.ior,dispersion:C.glass.dispersion,envMapIntensity:.65,clearcoat:0,attenuationDistance:Infinity});
 volume.add(new THREE.Mesh(geometry,material));
 // The background is independent of the glass: its contours can be seen both
 // outside the slab and refracted through it, as in the glTF dispersion demo.
 const backdrop=new THREE.Group();backdrop.position.z=-4;backdrop.scale.setScalar(1.22);world.add(backdrop);
 const baseMaterial=new THREE.MeshBasicMaterial({toneMapped:false});
 const base=new THREE.Mesh(new THREE.PlaneGeometry(40,30),baseMaterial);base.position.z=-1;backdrop.add(base);
 const arcMaterial=new THREE.MeshBasicMaterial({color:0x111114});
 const arc=new THREE.Mesh(new THREE.TorusGeometry(3.05,.2,24,160),arcMaterial);arc.rotation.set(.15,.38,-.42);arc.scale.set(1.35,.78,1);arc.position.set(.25,-.1,0);backdrop.add(arc);
 const threadMaterial=new THREE.MeshBasicMaterial({color:0x72747b});
 const thread=new THREE.Mesh(new THREE.TorusGeometry(3.55,.009,8,180),threadMaterial);thread.rotation.set(.3,-.2,.38);thread.scale.set(1.2,.8,1);thread.position.z=.05;backdrop.add(thread);
 const stripeMaterial=new THREE.MeshBasicMaterial({color:0x111114});
 const stripe=new THREE.Mesh(new THREE.PlaneGeometry(12,.035),stripeMaterial);stripe.rotation.z=.35;stripe.position.set(0,-1.8,.2);backdrop.add(stripe);
 const inkPanels=[];
 function makeInk(reverse){
  const canvas=document.createElement('canvas');canvas.width=1536;canvas.height=1152;
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
  const ink=new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,alphaTest:.01,side:THREE.FrontSide});
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(5.35,3.95),ink);
  const surfaceZ=C.geometry.depth/2+C.geometry.bevelThickness+0.015;mesh.position.z=reverse?-surfaceZ:surfaceZ;mesh.rotation.y=reverse?Math.PI:0;
  mesh.renderOrder=2;volume.add(mesh);const panel={canvas,texture,mesh,reverse};inkPanels.push(panel);return panel;
 }
 const frontInk=makeInk(false),backInk=makeInk(true);
 const loadedImages={front:null,back:null};
 function drawImageInBox(ctx,image,settings){
  const box=settings.box,x=box.x*1536,y=box.y*1152,w=box.width*1536,h=box.height*1152;
  const ratio=settings.fit==='cover'?Math.max(w/image.naturalWidth,h/image.naturalHeight):Math.min(w/image.naturalWidth,h/image.naturalHeight);
  const iw=image.naturalWidth*ratio,ih=image.naturalHeight*ratio;
  ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.globalAlpha=Math.min(1,Math.max(0,settings.opacity));ctx.drawImage(image,x+(w-iw)/2,y+(h-ih)/2,iw,ih);ctx.restore();
 }
 function loadImages(){
  for(const side of ['front','back']){
   const settings=C.images[side];if(!settings.src)continue;
   const image=new Image();image.crossOrigin='anonymous';
   image.onload=()=>{loadedImages[side]=image;paint()};
   image.onerror=()=>console.warn('Card image could not be loaded:',settings.src);
   image.src=new URL(settings.src,document.baseURI).href;
  }
 }
 let frame=0,visible=true,tx=0,ty=0,zoom=1,flip=host.getAttribute('aria-pressed')==='true'?Math.PI:0;
 let turnFrom=flip,turnCurrent=flip,turnStarted=-Infinity,lastFrame=0,tiltY=0;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function paint(){
  const dark=document.documentElement.dataset.theme==='dark';
  baseMaterial.color.set(dark?'#0b0b0d':'#f0f0ed');arcMaterial.color.set(dark?'#e2e4ed':'#111114');stripeMaterial.color.copy(arcMaterial.color);threadMaterial.color.set(dark?'#60616c':'#99999c');
  for(const panel of inkPanels){
   const ctx=panel.canvas.getContext('2d');ctx.clearRect(0,0,1536,1152);ctx.fillStyle=dark?'#f6f6fa':'#101013';ctx.textBaseline='middle';
   const imageSettings=C.images[panel.reverse?'back':'front'];const image=loadedImages[panel.reverse?'back':'front'];
   if(image)drawImageInBox(ctx,image,imageSettings);
   ctx.textAlign='left';ctx.font=C.text.headerSize+'px "Roboto Mono", monospace';
   ctx.fillText(panel.reverse?C.backHeading:C.frontHeading,C.text.padding,80);
   ctx.textAlign='center';ctx.font='400 '+(panel.reverse?C.text.backLogoSize:C.text.frontLogoSize)+'px Tagesschrift, serif';
   if(!image||!imageSettings.replaceLogo)ctx.fillText(C.logo,768,panel.reverse?355:560);
   if(panel.reverse){ctx.font=C.text.emailSize+'px "Roboto Mono", monospace';ctx.fillText(C.email,768,620);ctx.font=C.text.noteSize+'px Roboto, sans-serif';ctx.fillText(C.contactNote,768,700)}
   ctx.textAlign='left';ctx.font=C.text.footerSize+'px "Roboto Mono", monospace';ctx.fillText(C.logo,C.text.padding,1008);ctx.fillText(panel.reverse?C.backFooter:C.frontFooter,C.text.padding,1055);
   ctx.textAlign='right';ctx.fillText(panel.reverse?'VOLTAR ↶':'CONTATO ↗',1536-C.text.padding,1055);panel.texture.needsUpdate=true;
  }
  material.envMapIntensity=dark?.8:.45;draw();
 }
 function draw(){if(!visible||document.hidden)return;if(!frame)frame=requestAnimationFrame(tick)}
 function tick(now){
  frame=0;
  if(!visible||document.hidden){lastFrame=0;return}
  const dt=lastFrame?Math.min((now-lastFrame)/1000,.05):1/60;lastFrame=now;
  const k=reduced.matches?1:1-Math.exp(-14*dt);
  volume.rotation.x+=(tx-volume.rotation.x)*k;tiltY+=(ty-tiltY)*k;
  const progress=reduced.matches?1:Math.min(1,Math.max(0,(now-turnStarted)/C.motion.durationMs));
  // Sine easing avoids the long nearly-stationary tail of cubic easing.
  const eased=(1-Math.cos(Math.PI*progress))/2;
  turnCurrent=progress===1?flip:turnFrom+(flip-turnFrom)*eased;
  volume.rotation.y=turnCurrent+tiltY;
  const scale=volume.scale.x+(zoom-volume.scale.x)*k;volume.scale.setScalar(scale);
  const facing=Math.cos(volume.rotation.y)>=0;frontInk.mesh.visible=facing;backInk.mesh.visible=!facing;
  renderer.render(world,camera);
  const settling=Math.abs(tx-volume.rotation.x)+Math.abs(ty-tiltY)+Math.abs(zoom-scale)>.0002;
  if(progress<1||settling)frame=requestAnimationFrame(tick);else lastFrame=0;
 }
 function resize(){const width=host.clientWidth*1.4,height=host.clientHeight*1.4;if(!width||!height)return;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();draw()}
 host.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||reduced.matches)return;const b=host.getBoundingClientRect();ty=((e.clientX-b.left)/b.width-.5)*C.motion.tiltY;tx=-((e.clientY-b.top)/b.height-.5)*C.motion.tiltX;zoom=C.motion.hoverScale;draw()});
 host.addEventListener('pointerleave',()=>{tx=ty=0;zoom=1;draw()});
 new MutationObserver(()=>{const next=host.getAttribute('aria-pressed')==='true'?Math.PI:0;if(next===flip)return;turnFrom=turnCurrent;turnStarted=performance.now();flip=next;draw()}).observe(host,{attributes:true,attributeFilter:['aria-pressed']});
 reduced.addEventListener('change',()=>{tx=ty=0;zoom=1;draw()});
 window.addEventListener('blur',()=>{tx=ty=0;zoom=1;draw()});
 new ResizeObserver(resize).observe(host);
 new MutationObserver(paint).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
 new IntersectionObserver(e=>{visible=e[0].isIntersecting;if(visible)draw()}).observe(host);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)draw()});
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();front.classList.remove('has-dispersion');host.classList.remove('webgl-ready');cancelAnimationFrame(frame);frame=0});
 renderer.domElement.addEventListener('webglcontextrestored',()=>{front.classList.add('has-dispersion');host.classList.add('webgl-ready');paint()});
 loadImages();resize();paint();renderer.compile(world,camera);renderer.render(world,camera);front.classList.add('has-dispersion');host.classList.add('webgl-ready');Promise.all([document.fonts.load('400 100px Tagesschrift'),document.fonts.load('24px "Roboto Mono"')]).then(paint).catch(()=>document.fonts.ready.then(paint));
} catch(error){front.classList.remove('has-dispersion');host.classList.remove('webgl-ready');renderer?.dispose();renderer?.domElement.remove();console.warn('Using static glass fallback.',error)}



