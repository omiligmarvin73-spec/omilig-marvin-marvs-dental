const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
$('#yr').textContent=new Date().getFullYear();

const side=$('#side'),tog=$('.menu-toggle');
tog.onclick=()=>{const o=side.classList.toggle('open');tog.setAttribute('aria-expanded',o)};
$$('#side a').forEach(a=>a.onclick=()=>{side.classList.remove('open');tog.setAttribute('aria-expanded',false)});

const links=$$('#side nav a');
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-35% 0px -60% 0px'});
$$('main [id]').forEach(el=>{if(links.some(a=>a.getAttribute('href')==='#'+el.id))io.observe(el)});

['9:00 AM','10:00 AM','11:00 AM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'].forEach(t=>$('#time').add(new Option(t,t)));
const today=new Date();today.setMinutes(today.getMinutes()-today.getTimezoneOffset());
$('#date').min=today.toISOString().slice(0,10);

$$('.book').forEach(b=>b.onclick=()=>{
  $('#svc').value=b.dataset.svc;
  $('#reservation').scrollIntoView({behavior:'smooth'});
  setTimeout(()=>$('#name').focus({preventScroll:true}),400);
});

const say=(el,text,err)=>{el.textContent=text;el.classList.remove('hide');el.classList.toggle('err',!!err)};

$('#resForm').onsubmit=e=>{
  e.preventDefault();
  const m=$('#resMsg'),v=id=>$('#'+id).value.trim();
  if(!v('name')||!v('phone')||!v('svc')||!v('date')||!v('time'))return say(m,'Please fill in your name, phone, service, date and time.',true);
  if(new Date(v('date')+'T12:00').getDay()===0)return say(m,'Sundays are by appointment only. Please pick Monday to Saturday, or call us.',true);
  const d=new Date(v('date')+'T12:00').toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'});
  say(m,`Thank you, ${v('name')}. Your ${v('svc')} is reserved for ${d} at ${v('time')}. We’ll text ${v('phone')} to confirm.`);
  e.target.reset();
};

let rating=0;
const stars=$('#stars'),fg=$('.fg',stars);
const setRating=v=>{
  rating=Math.min(5,Math.max(0,v));
  fg.style.width=rating*20+'%';
  stars.setAttribute('aria-valuenow',rating);
  stars.setAttribute('aria-valuetext',rating?rating+' out of 5':'No rating yet');
  $('#rateVal').textContent=rating?rating+' out of 5':'Click a star to rate';
};
stars.onclick=e=>{const r=stars.getBoundingClientRect();setRating(Math.max(.5,Math.ceil((e.clientX-r.left)/r.width*10)/2))};
stars.onkeydown=e=>{
  if(e.key==='ArrowRight'||e.key==='ArrowUp'){e.preventDefault();setRating(rating+.5||.5)}
  if(e.key==='ArrowLeft'||e.key==='ArrowDown'){e.preventDefault();setRating(Math.max(.5,rating-.5))}
};

$('#fbForm').onsubmit=e=>{
  e.preventDefault();
  const m=$('#fbMsg'),n=$('#fbName').value.trim(),t=$('#fbText').value.trim();
  if(!n||!t||!rating)return say(m,'Please enter your name, click the stars to rate, and write a message.',true);
  const r=document.createElement('div');r.className='review';
  const b=document.createElement('b');b.textContent=n;
  const s=document.createElement('span');s.className='stars';
  s.setAttribute('role','img');s.setAttribute('aria-label','Rated '+rating+' out of 5');
  s.innerHTML='<span class="bg" aria-hidden="true">★★★★★</span><span class="fg" aria-hidden="true" style="width:'+rating*20+'%">★★★★★</span>';
  r.append(b,s,t);$('#reviews').prepend(r);
  say(m,'Thank you for your review.');
  e.target.reset();setRating(0);
};