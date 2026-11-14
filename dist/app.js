const header=document.querySelector('[data-header]');
const menuButton=document.querySelector('.menu-trigger');
const mobilePanel=document.querySelector('.mobile-panel');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const updateHeader=()=>header?.classList.toggle('is-scrolled',scrollY>12);
addEventListener('scroll',updateHeader,{passive:true});updateHeader();
function setMenu(open){if(!menuButton||!mobilePanel)return;menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');mobilePanel.classList.toggle('is-open',open);mobilePanel.setAttribute('aria-hidden',String(!open));mobilePanel.toggleAttribute('inert',!open);document.body.classList.toggle('menu-open',open)}
menuButton?.addEventListener('click',()=>setMenu(menuButton.getAttribute('aria-expanded')!=='true'));
mobilePanel?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
addEventListener('keydown',event=>{if(event.key==='Escape')setMenu(false)});
const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
document.querySelectorAll('.desktop-nav a,.mobile-panel nav a').forEach(a=>{if((a.getAttribute('href')||'').toLowerCase()===current)a.setAttribute('aria-current','page')});
if(!reducedMotion&&'IntersectionObserver'in window){const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el))}else{document.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'))}
const story=document.querySelector('[data-product-story]');const beaker=document.querySelector('[data-beaker]');const specs=[...document.querySelectorAll('[data-spec]')];const progressBar=document.querySelector('[data-story-progress]');let storyTick=false;
function updateStory(){storyTick=false;if(!story||!beaker||reducedMotion)return;const rect=story.getBoundingClientRect();const travel=Math.max(1,story.offsetHeight-innerHeight);const progress=Math.max(0,Math.min(1,-rect.top/travel));const wave=Math.sin(progress*Math.PI);beaker.style.setProperty('--beaker-y',`${((progress-.5)*-42).toFixed(1)}px`);beaker.style.setProperty('--beaker-ry',`${(-13+progress*26).toFixed(1)}deg`);beaker.style.setProperty('--beaker-rz',`${(-2+wave*3).toFixed(1)}deg`);beaker.style.setProperty('--beaker-scale',`${(.9+wave*.09).toFixed(3)}`);if(progressBar)progressBar.style.width=`${progress*100}%`;const active=Math.min(specs.length-1,Math.floor(progress*specs.length));specs.forEach((item,index)=>{item.classList.toggle('is-active',index<=active);item.classList.toggle('is-current',index===active)})}
function requestStory(){if(!storyTick){storyTick=true;requestAnimationFrame(updateStory)}}
if(story){addEventListener('scroll',requestStory,{passive:true});addEventListener('resize',requestStory,{passive:true});updateStory()}
const toast=document.querySelector('.toast');let toastTimer;function showToast(message){if(!toast)return;clearTimeout(toastTimer);toast.textContent=message;toast.classList.add('is-visible');toastTimer=setTimeout(()=>toast.classList.remove('is-visible'),3800)}
document.querySelectorAll('[data-demo]').forEach(button=>button.addEventListener('click',event=>{event.preventDefault();showToast(button.dataset.message||'Esta função está reservada para uma próxima etapa do projeto.')}));
const search=document.querySelector('[data-product-search]');const productCards=[...document.querySelectorAll('[data-product]')];const chips=[...document.querySelectorAll('[data-filter]')];const resultCount=document.querySelector('[data-result-count]');const emptyState=document.querySelector('[data-empty]');let activeCategory='todos';
function normalize(text){return text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
function filterProducts(){if(!productCards.length)return;const term=normalize(search?.value||'');let visible=0;productCards.forEach(card=>{const category=card.dataset.category||'';const matchesCategory=activeCategory==='todos'||category===activeCategory;const matchesTerm=!term||normalize(card.textContent).includes(term);const show=matchesCategory&&matchesTerm;card.hidden=!show;if(show)visible++});if(resultCount)resultCount.textContent=`${visible} ${visible===1?'categoria encontrada':'categorias encontradas'}`;if(emptyState)emptyState.style.display=visible?'none':'block'}
search?.addEventListener('input',filterProducts);chips.forEach(chip=>chip.addEventListener('click',()=>{activeCategory=chip.dataset.filter;chips.forEach(item=>{const active=item===chip;item.classList.toggle('is-active',active);item.setAttribute('aria-pressed',String(active))});filterProducts()}));
const initialCategory=new URLSearchParams(location.search).get('categoria');if(initialCategory){const chip=chips.find(item=>item.dataset.filter===initialCategory);chip?.click()}filterProducts();
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=String(new Date().getFullYear()));
const contactForm=document.querySelector('[data-contact-form]');contactForm?.addEventListener('submit',event=>{event.preventDefault();showToast('Formulário demonstrativo. Na publicação, ele será conectado ao canal definido pela Plena-Lab.')});

