(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const words=[...document.querySelectorAll('.optical-word')];
 const clearWord=()=>{};
 const targets=document.querySelectorAll('.section-heading,.section>h2,.bio,.skills,.project-row,.course-list article,.profile-extras>div,.contact-section,.case-body aside,.case-story section,.next-project');
 if(!reduced.matches&&'IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.08,rootMargin:'0px 0px -22px 0px'});
  targets.forEach((el,i)=>{el.classList.add('reveal-ready');el.style.setProperty('--reveal-delay',`${el.classList.contains('project-row')?(i%4)*50:0}ms`);observer.observe(el)});
  reduced.addEventListener('change',()=>{if(reduced.matches){targets.forEach(el=>el.classList.add('is-visible'));observer.disconnect();words.forEach(clearWord)}});
 }

})();
