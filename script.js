// SmartSolar — full-screen site interactions
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('consultationModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const consultationForm = document.getElementById('consultationForm');
  const monthlyBillInput = document.getElementById('monthlyBill');
  const billValDisplay = document.getElementById('billVal');
  const calcSavingsDisplay = document.getElementById('calcSavings');
  const calcPaybackDisplay = document.getElementById('calcPayback');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const header = document.getElementById('siteHeader');
  const toTop = document.getElementById('toTop');

  const openModal = (e) => { if (e) e.preventDefault(); modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow = 'hidden'; if (mobileMenu) mobileMenu.classList.remove('open'); };
  const closeModal = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; };
  document.querySelectorAll('[data-open-modal]').forEach(b => b.addEventListener('click', openModal));
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

  const updateSavings = () => {
    const bill = parseFloat(monthlyBillInput.value);
    billValDisplay.textContent = bill.toLocaleString('en-ZA');
    const savings = Math.round(bill * 12 * 25 * 0.68);
    const payback = (7.5 - ((bill - 500) / 9500) * 2.8).toFixed(1);
    calcSavingsDisplay.textContent = `R${savings.toLocaleString('en-ZA')}`;
    calcPaybackDisplay.textContent = `${payback} Years`;
  };
  if (monthlyBillInput) { monthlyBillInput.addEventListener('input', updateSavings); updateSavings(); }

  if (consultationForm) {
    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = consultationForm.querySelector('.form-submit-btn');
      const orig = btn.innerHTML;
      btn.disabled = true; btn.innerHTML = '<span>Preparing Your Custom Proposal...</span>';
      setTimeout(() => {
        btn.innerHTML = '<span>✓ Consultation Requested!</span>'; btn.style.backgroundColor = '#16a34a';
        setTimeout(() => { closeModal(); consultationForm.reset(); btn.disabled = false; btn.innerHTML = orig; btn.style.backgroundColor = ''; updateSavings(); }, 1400);
      }, 900);
    });
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));
  }

  const navLinks = document.querySelectorAll('.nav-link');
  const sections = [...document.querySelectorAll('section[id]')];
  const spy = new IntersectionObserver(es => {
    es.forEach(en => {
      if (en.isIntersecting) {
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => spy.observe(s));

  const reveal = new IntersectionObserver(es => {
    es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visible'); reveal.unobserve(en.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));

  const counters = new IntersectionObserver(es => {
    es.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target, end = +el.dataset.count || 0; let cur = 0;
      const step = Math.max(1, Math.round(end / 50));
      const t = setInterval(() => { cur += step; if (cur >= end) { cur = end; clearInterval(t); } el.textContent = cur + (end === 25 ? '' : '+'); }, 30);
      counters.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => counters.observe(el));

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    toTop.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});
