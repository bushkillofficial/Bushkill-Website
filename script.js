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
document.querySelectorAll('.songlist__item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.songlist__item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });
});

/* ─────────────────────────────────────────
   SPOTIFY — plain iframes, lazy-loaded on scroll
───────────────────────────────────────── */
const TRACK_IDS = [
  '3pDjocutnF0BxJceepUgQT',
  '2KRrAbO3xhwoxheMPydavo',
  '3iRFQinadkjKlL2iUhmOV7',
  '2BOQXXiN5ThvtbVEYflhfk',
  '6CId7tiRS4T3Wfk22tXTm5',
  '7l6fpU2rYIBEvjj5gsBUXE',
];

const listenSection = document.getElementById('listen');
if (listenSection) {
  const spotifyObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      TRACK_IDS.forEach((id, i) => {
        const el = document.getElementById(`embed-track-${i}`);
        if (!el) return;
        const iframe = document.createElement('iframe');
        iframe.src = `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`;
        iframe.width = '100%';
        iframe.height = '152';
        iframe.frameBorder = '0';
        iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
        iframe.style.cssText = 'border-radius:8px;display:block;';
        el.replaceChildren(iframe);
      });
      spotifyObserver.disconnect();
    }
  }, { rootMargin: '400px' });
  spotifyObserver.observe(listenSection);
}

/* ─────────────────────────────────────────
   MAILING LIST — form submit
───────────────────────────────────────── */
const newsletterForm = document.querySelector('.newsletter__form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('newsletter-msg');
    msg.textContent = "I didn't think anyone would actually sign up... it's not rdy yet.";
    e.target.reset();
  });
}

/* ─────────────────────────────────────────
   SCROLL REVEAL — fade-in on scroll
───────────────────────────────────────── */
const revealEls = document.querySelectorAll(
  '.tour-item, .merch-card, .photo-card, .platform-btn, .member, .songlist__item'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -10px 0px' });

revealEls.forEach((el, i) => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(22px)';
  el.style.transition = `opacity 0.75s ease-out ${i * 0.03}s, transform 0.75s ease-out ${i * 0.03}s`;
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
