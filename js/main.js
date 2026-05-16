// V Shine Makeup Studio — main.js
(function(){
  // Mobile menu
  const tog = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  if(tog && links){
    tog.addEventListener('click',()=>links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));
  }

  // Scroll reveal
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }});
  },{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // Counter animation
  const cio = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const dur = 1600; const start = performance.now();
      const tick = (t)=>{
        const p = Math.min((t-start)/dur,1);
        el.textContent = Math.floor(target*(1-Math.pow(1-p,3))).toLocaleString('en-IN') + (el.dataset.suffix||'');
        if(p<1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  },{threshold:.4});
  document.querySelectorAll('[data-count]').forEach(el=>cio.observe(el));

  // Cart (localStorage)
  const CART_KEY = 'vshine_cart';
  const getCart = ()=> { try { return JSON.parse(localStorage.getItem(CART_KEY)||'[]'); } catch(e){ return []; } };
  const saveCart = (c)=> { localStorage.setItem(CART_KEY, JSON.stringify(c)); updateBadge(); };
  const updateBadge = ()=> {
    const c = getCart(); const n = c.reduce((s,i)=>s+i.qty,0);
    document.querySelectorAll('.cart-badge').forEach(b=>{ b.textContent = n; b.style.display = n? 'grid':'none'; });
  };
  window.VShineCart = {
    add(p){
      const c = getCart(); const ex = c.find(i=>i.id===p.id);
      if(ex) ex.qty += (p.qty||1); else c.push({...p,qty:p.qty||1});
      saveCart(c);
      toast(p.name + ' added to cart');
    },
    remove(id){ saveCart(getCart().filter(i=>i.id!==id)); render && render(); },
    update(id,qty){ const c=getCart(); const i=c.find(x=>x.id===id); if(i){ i.qty=Math.max(1,qty); saveCart(c);} render && render(); },
    get: getCart,
    clear(){ saveCart([]); render && render(); }
  };
  updateBadge();

  // Toast
  function toast(msg){
    let t = document.getElementById('vs-toast');
    if(!t){
      t = document.createElement('div'); t.id='vs-toast';
      Object.assign(t.style,{position:'fixed',bottom:'100px',right:'24px',background:'#2a1d4a',
        color:'#fff',padding:'14px 22px',borderRadius:'99px',zIndex:200,fontSize:'.9rem',
        boxShadow:'0 10px 30px rgba(0,0,0,.2)',transition:'.4s',opacity:0,transform:'translateY(20px)'});
      document.body.appendChild(t);
    }
    t.textContent = msg;
    requestAnimationFrame(()=>{ t.style.opacity=1; t.style.transform='translateY(0)'; });
    clearTimeout(t._h);
    t._h = setTimeout(()=>{ t.style.opacity=0; t.style.transform='translateY(20px)'; },2400);
  }
  window.vsToast = toast;

  // Add to cart buttons
  document.querySelectorAll('[data-add-to-cart]').forEach(btn=>{
    btn.addEventListener('click',(e)=>{
      e.preventDefault();
      const d = btn.dataset;
      VShineCart.add({id:d.id,name:d.name,price:+d.price,image:d.image,cat:d.cat||''});
    });
  });

  // Tabs
  document.querySelectorAll('[data-tabs]').forEach(group=>{
    const btns = group.querySelectorAll('.tabs button');
    const panes = group.querySelectorAll('[data-pane]');
    btns.forEach(b=>b.addEventListener('click',()=>{
      btns.forEach(x=>x.classList.remove('active')); b.classList.add('active');
      panes.forEach(p=>p.style.display = p.dataset.pane===b.dataset.tab?'block':'none');
    }));
  });

  // Forms
  document.querySelectorAll('form[data-form]').forEach(f=>{
    f.addEventListener('submit',(e)=>{
      e.preventDefault();
      toast('Thank you! We will contact you shortly.');
      f.reset();
    });
  });

  // Product detail thumb swap
  document.querySelectorAll('.pd-thumbs img').forEach(img=>{
    img.addEventListener('click',()=>{
      const main = document.querySelector('.pd-main img');
      if(main){ main.src = img.src; }
      document.querySelectorAll('.pd-thumbs img').forEach(i=>i.classList.remove('active'));
      img.classList.add('active');
    });
  });

  // Qty selector
  document.querySelectorAll('.qty').forEach(q=>{
    const span = q.querySelector('span');
    q.querySelector('.qty-dec').addEventListener('click',()=>{
      span.textContent = Math.max(1, (+span.textContent)-1);
    });
    q.querySelector('.qty-inc').addEventListener('click',()=>{
      span.textContent = (+span.textContent)+1;
    });
  });
})();
