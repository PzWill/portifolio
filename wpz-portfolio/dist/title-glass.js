import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
// Manual controls: change these values, save, then refresh the browser.
const TITLE_GLASS = {
 maxPixelRatio: 2.5,     // Sharpness on Retina/HiDPI screens.
 textureScale: 2.5,      // Text supersampling, limited to the GPU texture size.
 dispersion: 3.8,       // Color separation in pixels (try 2 to 5).
 blur: 0.95,            // Blur inside the lens (try 0.5 to 2).
 colorMix: 0.65,        // Chromatic intensity: 0 to 1.
 distortion: 0.6,      // Vertical deformation (try 0.2 to 0.6).
 bulge: 0.075,          // Optical curvature / magnification.
 grain: 0.045,          // Fine static grain on the lettering: 0 disables it.
 scrollDistance: 5,     // Lens movement over the first 600px of scrolling.
 bands: [
  { position: 0.58, tilt: -0.15, height: 0.24, width: 1.04, center: 0.5, shift: 2.8 }, // Código: rises to the right.
  { position: 0.70, tilt:  0.09, height: 0.26, width: 1.04, center: 0.5, shift: -2.5 }, // Interação: falls to the right.
  { position: 0.58, tilt: -0.08, height: 0.26, width: 1.04, center: 0.5, shift: 2.8 } // Experimentos: rises gently.
 ]
};
const title=document.querySelector('.optical-title');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
if(title&&!reduced.matches){
 let renderer;
 try{
  await document.fonts.ready;
  renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,TITLE_GLASS.maxPixelRatio));renderer.toneMapping=THREE.NeutralToneMapping;
  const canvas=renderer.domElement;canvas.className='title-glass-canvas';canvas.setAttribute('aria-hidden','true');title.append(canvas);
  const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-1,1,1,-1,.01,20);camera.position.z=10;scene.scale.setScalar(.01);
  const textureCanvas=document.createElement('canvas');const context=textureCanvas.getContext('2d');let texture=new THREE.CanvasTexture(textureCanvas);texture.colorSpace=THREE.SRGBColorSpace;texture.generateMipmaps=false;texture.minFilter=THREE.LinearFilter;texture.magFilter=THREE.LinearFilter;
  const lenses=[new THREE.Vector4(),new THREE.Vector4(),new THREE.Vector4()];
  const textMaterial=new THREE.ShaderMaterial({uniforms:{uMap:{value:texture},uSize:{value:new THREE.Vector2(1,1)},uLenses:{value:lenses},uShift:{value:0},uTilts:{value:TITLE_GLASS.bands.map(b=>b.tilt)},uOffsets:{value:TITLE_GLASS.bands.map(b=>b.shift)},uDispersion:{value:TITLE_GLASS.dispersion},uBlur:{value:TITLE_GLASS.blur},uColorMix:{value:TITLE_GLASS.colorMix},uDistortion:{value:TITLE_GLASS.distortion},uBulge:{value:TITLE_GLASS.bulge},uGrain:{value:TITLE_GLASS.grain},uBackground:{value:new THREE.Color('#0b0b0d')}},vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader: "\nprecision highp float;\nuniform sampler2D uMap;uniform vec2 uSize;uniform vec4 uLenses[3];uniform float uShift;uniform float uTilts[3];uniform float uOffsets[3];uniform float uDispersion;uniform float uBlur;uniform float uColorMix;uniform float uDistortion;uniform float uBulge;uniform float uGrain;uniform vec3 uBackground;varying vec2 vUv;\nvec3 getInk(vec2 pixel,float blur){vec2 uv=pixel/uSize;vec2 spread=vec2(blur)/uSize;return texture2D(uMap,uv).rgb*.4+(texture2D(uMap,uv+vec2(spread.x,0.)).rgb+texture2D(uMap,uv-vec2(spread.x,0.)).rgb+texture2D(uMap,uv+vec2(0.,spread.y)).rgb+texture2D(uMap,uv-vec2(0.,spread.y)).rgb)*.15;}\nvoid main(){vec2 original=vUv*uSize;vec2 refracted=original;float strength=0.;\nfor(int i=0;i<3;i++){vec4 lens=uLenses[i];float tilt=uTilts[i];vec2 center=lens.xy+vec2(0.,uShift*(i==1?-1.:1.));vec2 delta=original-center;float y=delta.y+delta.x*tilt;float n=y/(lens.w*.5);float edge=1.-smoothstep(.05,1.,abs(n));float ends=1.-smoothstep(lens.z*.08,lens.z*.5,abs(delta.x));float inside=edge*ends;\nfloat curve=sin(n*1.570796);refracted.y+=(-y*uDistortion+curve*lens.w*uBulge)*inside;refracted.x+=uOffsets[i]*inside;strength=max(strength,inside);}\nfloat split=strength*uDispersion;float blur=strength*uBlur;vec3 color; color.r=getInk(refracted+vec2(split,.3*split),blur).r;color.g=getInk(refracted,blur).g;color.b=getInk(refracted-vec2(split,.3*split),blur).b;\ncolor=mix(getInk(refracted,blur),color,uColorMix);float inkMask=smoothstep(.04,.22,length(getInk(original,0.)-uBackground));float noise=fract(sin(dot(floor(gl_FragCoord.xy),vec2(12.9898,78.233)))*43758.5453)-.5;color=clamp(color+noise*uGrain*inkMask,0.,1.);gl_FragColor=vec4(color,1.);\n#include <colorspace_fragment>\n}" });
  const textPlane=new THREE.Mesh(new THREE.PlaneGeometry(1,1),textMaterial);scene.add(textPlane);
  let width=0,height=0,raf=0,visible=true,scrollShift=0,rebuildFrame=0;
  function render(){raf=0;if(!visible||document.hidden)return;textMaterial.uniforms.uShift.value=scrollShift;renderer.render(scene,camera)}
  function schedule(){if(!raf&&visible)raf=requestAnimationFrame(render)}
  function rebuild(){
   const rect=title.getBoundingClientRect(),pad=24;width=rect.width+pad*2;height=rect.height+pad*2;
   if(!rect.width||!rect.height)return;
   const maxTexture=renderer.capabilities.maxTextureSize;
   const ratio=Math.min(devicePixelRatio||1,TITLE_GLASS.maxPixelRatio,maxTexture/width,maxTexture/height);
   renderer.setPixelRatio(ratio);
   renderer.setSize(width,height,false);canvas.style.width=width+'px';canvas.style.height=height+'px';camera.left=-width/200;camera.right=width/200;camera.top=height/200;camera.bottom=-height/200;camera.updateProjectionMatrix();
   textMaterial.uniforms.uSize.value.set(width,height);const textRatio=Math.min(Math.max(ratio,TITLE_GLASS.textureScale),maxTexture/width,maxTexture/height);textureCanvas.width=Math.ceil(width*textRatio);textureCanvas.height=Math.ceil(height*textRatio);context.setTransform(textRatio,0,0,textRatio,0,0);
   const dark=document.documentElement.dataset.theme==='dark';textMaterial.uniforms.uBackground.value.set(dark?'#0b0b0d':'#f0f0ed');context.fillStyle=dark?'#0b0b0d':'#f0f0ed';context.fillRect(0,0,width,height);
   document.querySelectorAll('.optical-title .optical-word').forEach((word,index)=>{
    const ink=word.querySelector('.word-ink')||word;const box=ink.getBoundingClientRect(),style=getComputedStyle(ink);const x=box.left-rect.left+pad,y=box.top-rect.top+pad;
    context.fillStyle=dark?'#f4f4f2':'#101013';context.font=[style.fontStyle,style.fontWeight,style.fontSize,style.fontFamily].join(' ');context.letterSpacing=style.letterSpacing;context.textBaseline='alphabetic';
    const metrics=context.measureText(word.dataset.word),line=parseFloat(style.lineHeight)||parseFloat(style.fontSize)*1.2,ascent=metrics.fontBoundingBoxAscent??metrics.actualBoundingBoxAscent,descent=metrics.fontBoundingBoxDescent??metrics.actualBoundingBoxDescent;
    context.fillText(word.dataset.word,x,y+(line-ascent-descent)/2+ascent);
    const effectScale=Math.max(.6,Math.min(1.8,parseFloat(style.fontSize)/80));
    if(index===0){textMaterial.uniforms.uDispersion.value=TITLE_GLASS.dispersion*effectScale;textMaterial.uniforms.uBlur.value=TITLE_GLASS.blur*effectScale;}
    const band=TITLE_GLASS.bands[index];const bandHeight=box.height*band.height,bandWidth=box.width*band.width;
    const bandY=height/2-y-box.height*band.position;lenses[index].set(x+box.width*band.center,height/2+bandY,bandWidth,bandHeight);
   });
   // WebGL texture storage must be recreated when its dimensions change.
   const previousTexture=texture;texture=new THREE.CanvasTexture(textureCanvas);
   texture.colorSpace=THREE.SRGBColorSpace;texture.generateMipmaps=false;texture.minFilter=THREE.LinearFilter;texture.magFilter=THREE.LinearFilter;
   textMaterial.uniforms.uMap.value=texture;previousTexture.dispose();textPlane.scale.set(width,height,1);
   if(raf)cancelAnimationFrame(raf);render();
  }
  function queueRebuild(){if(!rebuildFrame)rebuildFrame=requestAnimationFrame(()=>{rebuildFrame=0;rebuild()})}
  const resizeObserver=new ResizeObserver(queueRebuild);resizeObserver.observe(title);title.querySelectorAll('.word-ink').forEach(word=>resizeObserver.observe(word));
  window.addEventListener('resize',queueRebuild,{passive:true});
  window.visualViewport?.addEventListener('resize',queueRebuild,{passive:true});
  document.fonts.addEventListener('loadingdone',queueRebuild);
  function watchDensity(){const media=matchMedia('(resolution: '+(devicePixelRatio||1)+'dppx)');media.addEventListener('change',()=>{queueRebuild();watchDensity()},{once:true})}watchDensity();
  new MutationObserver(queueRebuild).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)schedule()}).observe(title);
  window.addEventListener('scroll',()=>{if(!visible)return;scrollShift=Math.min(1,scrollY/600)*TITLE_GLASS.scrollDistance;schedule()},{passive:true});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();title.classList.remove('has-glass-type');cancelAnimationFrame(raf);raf=0});
  canvas.addEventListener('webglcontextrestored',()=>{rebuild();title.classList.add('has-glass-type')});
  reduced.addEventListener('change',()=>{title.classList.toggle('has-glass-type',!reduced.matches);if(!reduced.matches)rebuild()});
  rebuild();renderer.render(scene,camera);title.classList.add('has-glass-type');
 }catch(error){title.classList.remove('has-glass-type');renderer?.domElement.remove();renderer?.dispose();console.warn('Title glass fallback.',error)}
}


