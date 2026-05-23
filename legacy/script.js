const header = document.querySelector('.site-header');
const heroSection = document.querySelector('.hero-section');

const observer = new IntersectionObserver(
  ([entry]) => {
    header.classList.toggle('scrolled', !entry.isIntersecting);
  },
  { rootMargin: '-80px 0px 0px 0px' }
);

if (heroSection) {
  observer.observe(heroSection);
}
