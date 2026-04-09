/* ─────────────────────────────────────────
   NAV — scroll shrink + mobile burger
───────────────────────────────────────── */
const nav    = document.getElementById('nav');
const burger = document.getElementById('burger');
const links  = document.querySelector('.nav__links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

burger.addEventListener('click', () => {
  links.classList.toggle('open');
  // Animate burger → X
  const spans = burger.querySelectorAll('span');
  const isOpen = links.classList.contains('open');
  spans[0].style.transform = isOpen ? 'translateY(7px) rotate(45deg)' : '';
  spans[1].style.opacity   = isOpen ? '0' : '';
  spans[2].style.transform = isOpen ? 'translateY(-7px) rotate(-45deg)' : '';
});

// Close mobile menu when a link is clicked
links.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    links.classList.remove('open');
    burger.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity   = '';
    });
  });
});

/* ─────────────────────────────────────────
   TRACKLIST — click to activate
───────────────────────────────────────── */
document.querySelectorAll('.tracklist__item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.tracklist__item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });
});

/* ─────────────────────────────────────────
   MAILING LIST — form submit
───────────────────────────────────────── */
function handleSubscribe(e) {
  e.preventDefault();
  const msg = document.getElementById('newsletter-msg');
  msg.textContent = "I didn't think anyone would actually sign up... it's not rdy yet.";
  e.target.reset();
}

/* ─────────────────────────────────────────
   SCROLL REVEAL — fade-in on scroll
───────────────────────────────────────── */
const revealEls = document.querySelectorAll(
  '.tour-item, .merch-card, .photo-card, .platform-btn, .member, .tracklist__item'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach((el, i) => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(20px)';
  el.style.transition = `opacity 0.5s ease ${i * 0.04}s, transform 0.5s ease ${i * 0.04}s`;
  observer.observe(el);
});

document.addEventListener('DOMContentLoaded', () => {
  // Immediately check items already in view
  revealEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('visible');
    }
  });
});

/* Inject .visible styles via JS (keeps CSS clean) */
const style = document.createElement('style');
style.textContent = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(style);
