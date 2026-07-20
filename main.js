(function(){
  var h=document.getElementById('site-header');
  window.addEventListener('scroll',function(){h.classList.toggle('scrolled',window.scrollY>40);},{passive:true});
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('aos-in');io.unobserve(e.target);}});},{threshold:0.12});
  document.querySelectorAll('[data-aos]').forEach(function(el){var d=el.getAttribute('data-aos-delay');if(d)el.style.transitionDelay=d+'ms';io.observe(el);});
})();
function toggleFaq(row){
  var open=row.classList.contains('open');
  document.querySelectorAll('.faq-row').forEach(function(r){r.classList.remove('open');r.querySelector('.faq-a').style.display='none';r.querySelector('.faq-icon').innerHTML='+';});
  if(!open){row.classList.add('open');row.querySelector('.faq-a').style.display='';row.querySelector('.faq-icon').innerHTML='&minus;';}
}
function submitContact(){
  var g=function(id){var el=document.getElementById(id);return el?el.value:'';};
  var body='Name: '+g('cf-name')+'\nEmail: '+g('cf-email')+'\nCompany: '+g('cf-company')+'\n\n'+g('cf-message');
  window.location.href='mailto:richard@blackseven.co?subject='+encodeURIComponent('Website enquiry — Black Seven')+'&body='+encodeURIComponent(body);
}
function submitNewsletter(){
  var g=function(id){var el=document.getElementById(id);return el?el.value:'';};
  var body='Please add me to the newsletter.\n\nName: '+g('nl-name')+'\nEmail: '+g('nl-email');
  window.location.href='mailto:richard@blackseven.co?subject='+encodeURIComponent('Newsletter signup — Black Seven')+'&body='+encodeURIComponent(body);
}
function toggleMenu(){document.body.classList.toggle('menu-open');}
document.addEventListener('click',function(e){
  if(document.body.classList.contains('menu-open') && e.target.closest('#site-nav a')) document.body.classList.remove('menu-open');
});