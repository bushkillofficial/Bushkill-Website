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
   SPOTIFY — iFrame API: one-at-a-time + reset on end
───────────────────────────────────────── */
const TRACK_IDS = [
  '3pDjocutnF0BxJceepUgQT', // Homicidal Queen
  '2KRrAbO3xhwoxheMPydavo', // Curley's Diner 2
  '3iRFQinadkjKlL2iUhmOV7', // Drifting Away
  '2BOQXXiN5ThvtbVEYflhfk', // Hit This
  '6CId7tiRS4T3Wfk22tXTm5', // Landing Strip
  '7l6fpU2rYIBEvjj5gsBUXE', // Snoopy
];

window.onSpotifyIframeApiReady = (IFrameAPI) => {
  const controllers = [];

  TRACK_IDS.forEach((id, index) => {
    const el = document.getElementById(`sp-track-${index}`);
    if (!el) return;

    IFrameAPI.createController(el, { uri: `spotify:track:${id}`, height: '80' }, (ctrl) => {
      controllers[index] = ctrl;

      ctrl.addListener('playback_update', ({ data }) => {
        if (!data.isPaused) {
          // Pause every other track
          controllers.forEach((c, i) => { if (i !== index && c) c.pause(); });
        } else if (data.duration > 0 && data.position >= data.duration - 1.5) {
          // Preview ended — reload to restore the original thumbnail
          ctrl.loadUri(`spotify:track:${id}`);
        }
      });
    });
  });
};

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
