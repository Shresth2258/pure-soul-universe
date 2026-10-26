/* PSU care renderer: group cards, life-stage cards, concerns list, concern detail */
(function(){var D=window.PSU_CARE;
var DEF={home:'index.html',why:'why-psu.html',list:'concerns.html',group:function(i){return 'concerns.html#'+i},cond:function(s){return 'concern.html?c='+s}};
function O(o){return o||window.PSU_OPT||DEF}
function enc(s){return s.replace(/ /g,'%20')}
function ico(g){return '<span class="cg-ico"><svg viewBox="0 0 24 24">'+g.i+'</svg></span>'}
function li(s){return s.split('|').map(function(x){return '<li>'+x+'</li>'}).join('')}
function hero(img,crumb,kick,title,lead,chips,cls){return '<section class="psu-hero" style="--psu-position:center"><div class="psu-hero-media" aria-hidden="true"><img src="'+enc(img)+'" alt="" fetchpriority="high"></div><div class="psu-hero__inner">'+(crumb?'<p class="cg-crumb">'+crumb+'</p>':'')+'<p class="psu-kicker">'+kick+'</p><h1 class="psu-title '+cls+'">'+title+'</h1><p class="psu-intro">'+lead+'</p>'+(chips?'<div class="cg-chips">'+chips+'</div>':'')+'</div></section>'}
function slug(n){return n.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function G(id){return D.groups.filter(function(x){return x.id===id})[0]}
window.PSU_render={
hooks:function(r,o){o=O(o);r=r||document;
 [].forEach.call(r.querySelectorAll('[data-cg-groups]'),function(el){el.innerHTML=D.groups.map(function(x){return '<a class="cg-card" href="'+o.group(x.id)+'"><span class="cg-pic"><img src="'+enc(x.im)+'" alt="" loading="lazy"></span>'+ico(x)+'<h3>'+x.name+'</h3><p>'+x.d+'</p><small>'+x.ex+'</small><span class="cg-more">Explore &rarr;</span></a>'}).join('')});
 [].forEach.call(r.querySelectorAll('[data-cg-stages]'),function(el){el.innerHTML=D.items.filter(function(i){return i.g==='stage'}).map(function(i){return '<a class="cg-stage" href="'+o.cond(i.s)+'"><b>'+i.age+'</b><h3>'+i.n+'</h3><p>'+i.d+'</p><span>Symptoms &amp; care &rarr;</span></a>'}).join('')})},
list:function(r,o){o=O(o);var chips='',body='';
 D.groups.forEach(function(x){chips+='<a class="cg-chip" href="'+o.group(x.id)+'">'+x.name+'</a>';
  var it=D.items.filter(function(i){return i.g===x.id}).map(function(i){return '<a class="cg-item" href="'+o.cond(i.s)+'"><h3>'+(i.age?i.age+' · ':'')+i.n+'</h3><p>'+i.d+'</p><span>Symptoms &amp; care &rarr;</span></a>'}).join('');
  body+='<div class="cg-group" id="'+x.id+'"><div class="cg-ban" style="background-image:url(\''+enc(x.im)+'\')"></div><div class="cg-gh">'+ico(x)+'<div><h2>'+x.name+'</h2><p>'+x.d+'</p></div></div><div class="cg-list">'+it+'</div></div>'});
 r.innerHTML=hero(D.groups[1].im,'<a href="'+o.home+'">Home</a> / <a href="'+o.why+'">Why PSU</a> / Concerns','Concerns we care for','Find your area of <em>care.</em>','Choose a group, then a concern, to see common signs, supportive therapies and precautions.',chips,'')+'<section class="cg-sec"><div class="cg-wrap">'+body+'<p class="cg-note">'+D.disc+'</p></div></section>'},
detail:function(r,s,o){o=O(o);var it=D.items.filter(function(i){return i.s===s})[0];
 if(!it){r.innerHTML=hero(D.groups[0].im,'','Not found','Concern <em>not found.</em>','Please choose a concern from the list.','<a class="cg-chip" href="'+o.list+'">All concerns</a>','');return false}
 var gr=G(it.g);document.title=it.n+' | Pure Soul Universe';
 var th=it.th.split('|').map(function(t,k){var p=t.split(':'),f=D.timg[p[0]];return '<a class="cg-thc cg-thc--link" href="therapy.html?t='+slug(p[0])+'&from='+it.s+'">'+(f?'<img src="assets/images/'+enc(f)+'" alt="'+p[0]+'" loading="lazy">':'')+'<b>'+(k+1)+'</b><h3>'+p[0]+'</h3><p>'+p[1]+'</p><span class="cg-thc__more">Benefits &amp; how it works &rarr;</span></a>'}).join('');
 var rel=D.items.filter(function(i){return i.g===it.g&&i.s!==it.s}).map(function(i){return '<a href="'+o.cond(i.s)+'">'+i.n+'</a>'}).join('');
 var wa='https://wa.me/918800316274?text='+encodeURIComponent('Namaste Pure Soul Universe, I would like to know about care for: '+it.n+'.');
 r.innerHTML=hero(gr.im,'<a href="'+o.home+'">Home</a> / <a href="'+o.list+'">Concerns</a> / <a href="'+o.group(gr.id)+'">'+gr.name+'</a>',it.age?'Ages '+it.age:gr.name,it.n,it.d,'','cg-t-sm')+
 '<section class="cg-sec"><div class="cg-wrap"><div class="cg-two"><div class="cg-block"><p class="cg-kicker">Overview</p><h2>Common signs &amp; <em>concerns</em></h2><ul class="cg-sym cg-sym--1">'+li(it.sy)+'</ul></div><div class="cg-ring"><img src="'+enc(gr.im)+'" alt="'+gr.name+'"></div></div></div></section>'+
 '<section class="cg-sec cg-sec--cream"><div class="cg-wrap"><div class="cg-block" style="margin:0"><p class="cg-kicker">Therapies for '+it.n+'</p><h2>Supportive <em>therapies &amp; services</em></h2><div class="cg-th">'+th+'</div></div></div></section>'+
 '<section class="cg-sec cg-sec--dark"><div class="cg-wrap"><div class="cg-block" style="margin:0"><p class="cg-kicker">Precautions for '+it.n+'</p><h2>Daily <em>precautions &amp; guidance</em></h2><ul class="cg-pre">'+li(it.pr)+'</ul></div></div></section>'+
 '<section class="cg-sec"><div class="cg-wrap"><div class="cg-block"><div class="cg-warn"><b>Please seek professional help promptly</b> if '+it.dr+' '+D.disc+'</div><div class="cg-cta"><a class="cg-btn" href="'+wa+'" target="_blank" rel="noopener">Talk to our team</a><button class="cg-btn cg-btn--gold" type="button" data-psu-open-booking data-booking-type="Wellness appointment">Book a consultation</button></div></div><div class="cg-block" style="margin:0"><h2>Related <em>concerns</em></h2><div class="cg-related">'+rel+'<a href="'+o.list+'">All concerns</a></div></div></div></section>';return true},
therapy:function(r,t,from,o){o=O(o);var T=window.PSU_THERAPY||{},x=T[t];
 if(!x){r.innerHTML=hero(D.groups[0].im,'','Not found','Therapy <em>not found.</em>','Please choose a therapy from the concerns list.','<a class="cg-chip" href="'+o.list+'">All concerns</a>','');return false}
 var fr=D.items.filter(function(i){return i.s===from})[0],img='assets/images/'+enc(x.im);document.title=x.n+' | Pure Soul Universe';
 var crumb='<a href="'+o.home+'">Home</a> / <a href="'+o.list+'">Concerns</a> / '+(fr?'<a href="'+o.cond(fr.s)+'">'+fr.n+'</a> / ':'')+x.n;
 var chips='<span class="cg-chip cg-chip--static">'+x.dur+'</span><span class="cg-chip cg-chip--static">'+x.fq+'</span>';
 var steps=x.hw.split('|').map(function(h,k){var p=h.split(':');return '<div class="cg-thc"><b>'+(k+1)+'</b><h3>'+p[0]+'</h3><p>'+p[1]+'</p></div>'}).join('');
 var faq=x.faq.split('|').map(function(q){var p=q.split('::');return '<details class="th-faq"><summary>'+p[0]+'</summary><p>'+p[1]+'</p></details>'}).join('');
 var rel=x.rl.split(',').map(function(k){return T[k]?'<a href="therapy.html?t='+k+(fr?'&from='+fr.s:'')+'">'+T[k].n+'</a>':''}).join('');
 var wa='https://wa.me/918800316274?text='+encodeURIComponent('Namaste Pure Soul Universe, I would like to know more about '+x.n+'.');
 r.innerHTML=hero(D.groups[1].im,crumb,x.tag,x.n,x.d,chips,'cg-t-sm')+
 '<section class="cg-sec"><div class="cg-wrap"><div class="cg-two"><div class="cg-block"><p class="cg-kicker">Benefits</p><h2>Why people <em>choose '+x.n+'</em></h2><ul class="cg-sym cg-sym--1">'+li(x.ben)+'</ul></div><div class="th-pic"><img src="'+img+'" alt="'+x.n+'"></div></div>'+
 '<div class="th-facts"><div><small>Duration</small><b>'+x.dur+'</b></div><div><small>How often</small><b>'+x.fq+'</b></div><div><small>Best for</small><b>'+x.bf+'</b></div></div></div></section>'+
 '<section class="cg-sec cg-sec--cream"><div class="cg-wrap"><div class="cg-block" style="margin:0"><p class="cg-kicker">What to expect</p><h2>How '+x.n+' <em>is done, step by step</em></h2><div class="cg-th">'+steps+'</div></div></div></section>'+
 '<section class="cg-sec cg-sec--dark"><div class="cg-wrap"><div class="th-two"><div class="cg-block" style="margin:0"><p class="cg-kicker">Before you come</p><h2>Simple <em>preparation</em></h2><ul class="cg-pre">'+li(x.pre)+'</ul></div><div class="cg-block" style="margin:0"><p class="cg-kicker">Good to know</p><h2>Care &amp; <em>precautions</em></h2><ul class="cg-pre">'+li(x.cr)+'</ul></div></div></div></section>'+
 '<section class="cg-sec"><div class="cg-wrap"><div class="cg-block"><p class="cg-kicker">Questions</p><h2>Common <em>questions</em></h2>'+faq+'</div><div class="cg-block"><div class="cg-warn">'+D.disc+'</div><div class="cg-cta"><a class="cg-btn" href="'+wa+'" target="_blank" rel="noopener">Ask about '+x.n+'</a><button class="cg-btn cg-btn--gold" type="button" data-psu-open-booking data-booking-type="Program / therapy">Book a session</button></div></div><div class="cg-block" style="margin:0"><h2>Related <em>therapies</em></h2><div class="cg-related">'+rel+(fr?'<a href="'+o.cond(fr.s)+'">&larr; Back to '+fr.n+'</a>':'<a href="'+o.list+'">All concerns</a>')+'</div></div></div></section>';return true},
reason:function(r,k,o){o=O(o);var R=window.PSU_REASON||{},T=window.PSU_THERAPY||{},x=R[k];
 if(!x){r.innerHTML=hero(D.groups[0].im,'','Not found','Reason <em>not found.</em>','Please choose a reason from the Why PSU page.','<a class="cg-chip" href="'+o.why+'">Why PSU</a>','');return false}
 document.title=x.n+' | Why Pure Soul Universe';var img='assets/images/'+enc(x.im);
 var pts=x.pts.split('|').map(function(h,i){var p=h.split(':');return '<div class="rs-pt"><b>'+(i+1)+'</b><div><h3>'+p[0]+'</h3><p>'+p[1]+'</p></div></div>'}).join('');
 var steps=x.hw.split('|').map(function(h,i){var p=h.split(':');return '<div class="cg-thc"><b>'+(i+1)+'</b><h3>'+p[0]+'</h3><p>'+p[1]+'</p></div>'}).join('');
 var th=x.th.split(',').map(function(t){var a=T[t];return a?'<a class="rs-th" href="therapy.html?t='+t+'"><img src="assets/images/'+enc(a.im)+'" alt="" loading="lazy"><span><small>'+a.tag+'</small><b>'+a.n+'</b></span><i>&rarr;</i></a>':''}).join('');
 var faq=x.faq.split('|').map(function(q){var p=q.split('::');return '<details class="th-faq"><summary>'+p[0]+'</summary><p>'+p[1]+'</p></details>'}).join('');
 var others=x.rl.split(',').map(function(t){var a=R[t];return a?'<a class="rs-oth" href="reason.html?r='+t+'"><span class="cg-ico"><svg viewBox="0 0 24 24">'+a.ic+'</svg></span><b>'+a.n+'</b><i>&rarr;</i></a>':''}).join('');
 var wa='https://wa.me/918800316274?text='+encodeURIComponent('Namaste Pure Soul Universe, I would like to know more about: '+x.n+'.');
 r.innerHTML=hero(x.im,'<a href="'+o.home+'">Home</a> / <a href="'+o.why+'">Why PSU</a> / '+x.n,x.tag,x.n,x.d,'','cg-t-sm')+
 '<section class="cg-sec"><div class="cg-wrap"><div class="cg-head"><div><p class="cg-kicker">What this means for you</p><h2 class="cg-title">'+x.n+' <em>in practice.</em></h2></div></div><div class="rs-pts">'+pts+'</div></div></section>'+
 '<section class="cg-sec cg-sec--cream"><div class="cg-wrap"><div class="cg-block" style="margin:0"><p class="cg-kicker">How it works</p><h2>Our approach, <em>step by step</em></h2><div class="cg-th rs-steps">'+steps+'</div></div></div></section>'+
 '<section class="cg-sec cg-sec--dark"><div class="cg-wrap"><div class="th-two"><div class="cg-block" style="margin:0"><p class="cg-kicker">Our promise</p><h2>What you can <em>expect</em></h2><ul class="cg-pre">'+li(x.cm)+'</ul></div><div class="cg-block" style="margin:0"><p class="cg-kicker">See it in action</p><h2>Therapies that <em>reflect this</em></h2><div class="rs-ths">'+th+'</div></div></div></div></section>'+
 '<section class="cg-sec"><div class="cg-wrap"><div class="cg-block"><p class="cg-kicker">Questions</p><h2>Common <em>questions</em></h2>'+faq+'</div><div class="cg-block"><div class="cg-cta"><a class="cg-btn" href="'+wa+'" target="_blank" rel="noopener">Talk to our team</a><button class="cg-btn cg-btn--gold" type="button" data-psu-open-booking data-booking-type="Wellness appointment">Book a consultation</button></div></div><div class="cg-block" style="margin:0"><h2>More reasons to <em>choose PSU</em></h2><div class="rs-others">'+others+'</div><p style="margin-top:1.2rem"><a class="wy-link" href="'+o.why+'">&larr; All six reasons</a></p></div></div></section>';return true}
};
if(!window.PSU_OPT)window.PSU_render.hooks(document);
})();
