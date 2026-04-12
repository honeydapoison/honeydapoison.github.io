document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  // Carousel auto-slide
  const carouselTrack = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  let currentSlide = 0;

  if (carouselTrack && slides.length > 0) {
    setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      carouselTrack.style.transform = `translate3d(-${currentSlide * 100}%, 0, 0)`;
    }, 4000); // Change slide every 4 seconds
  }

  // Join modal (Google Form)
  const joinButtons = document.querySelectorAll('.btn-join');
  const joinButton = joinButtons[0];
  const joinModal = document.getElementById('join-modal');
  const joinModalClose = joinModal?.querySelector('.modal-close');
  const joinModalBackdrop = joinModal?.querySelector('[data-modal-close]');
  const joinForm = document.getElementById('join-form');
  const joinStatus = joinModal?.querySelector('.modal-status');
  const joinFormSrc = joinForm?.src;
  let joinFormLoadCount = 0;

  function openJoinModal() {
    if (!joinModal) return;
    joinModal.classList.add('open');
    joinModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (joinForm && joinFormSrc) {
      joinForm.src = joinFormSrc;
    }

    joinFormLoadCount = 0;
    if (joinStatus) joinStatus.textContent = '';
  }

  function closeJoinModal() {
    if (!joinModal) return;
    joinModal.classList.remove('open');
    joinModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Remove auto-open query/hash so reload doesn't reopen the modal.
    if (window.location.hash === '#join') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get('openJoin') === '1') {
      params.delete('openJoin');
      const newSearch = params.toString();
      history.replaceState(null, '', window.location.pathname + (newSearch ? `?${newSearch}` : ''));
    }
  }

  function openJoinFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('openJoin') === '1' || window.location.hash === '#join') {
      openJoinModal();
    }
  }

  openJoinFromUrl();

  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#join') openJoinModal();
  });

  function handleJoinFormLoad() {
    joinFormLoadCount += 1;

    // The form will trigger a second load after successful submission (thank you page).
    if (joinFormLoadCount < 2) return;

    if (joinStatus) joinStatus.textContent = 'Thanks! You can close this window now.';
  }

  joinButtons.forEach(btn => btn.addEventListener('click', (event) => {
    event.preventDefault();
    openJoinModal();
  }));

  joinModalClose?.addEventListener('click', closeJoinModal);
  joinModalBackdrop?.addEventListener('click', closeJoinModal);

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeJoinModal();
  });

  joinForm?.addEventListener('load', handleJoinFormLoad);

  // Contact modal (Google Form)
  const contactButtons = document.querySelectorAll('.btn-contact');
  const contactButton = contactButtons[0];
  const contactModal = document.getElementById('contact-modal');
  const contactModalClose = contactModal?.querySelector('.modal-close');
  const contactModalBackdrop = contactModal?.querySelector('[data-modal-close]');
  const contactForm = document.getElementById('contact-form');
  const contactStatus = contactModal?.querySelector('.modal-status');
  const contactFormSrc = contactForm?.src;
  let contactFormLoadCount = 0;

  function openContactModal() {
    if (!contactModal) return;
    contactModal.classList.add('open');
    contactModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (contactForm && contactFormSrc) {
      contactForm.src = contactFormSrc;
    }

    contactFormLoadCount = 0;
    if (contactStatus) contactStatus.textContent = '';
  }

  function closeContactModal() {
    if (!contactModal) return;
    contactModal.classList.remove('open');
    contactModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Remove auto-open query/hash so reloading doesn't reopen the modal.
    if (window.location.hash === '#contact') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get('openContact') === '1') {
      params.delete('openContact');
      const newSearch = params.toString();
      history.replaceState(null, '', window.location.pathname + (newSearch ? `?${newSearch}` : ''));
    }
  }

  function handleContactFormLoad() {
    contactFormLoadCount += 1;

    if (contactFormLoadCount < 2) return;

    if (contactStatus) contactStatus.textContent = 'Thanks! You can close this window now.';
  }

  contactButtons.forEach(btn => btn.addEventListener('click', (event) => {
    event.preventDefault();
    openContactModal();
  }));

  contactModalClose?.addEventListener('click', closeContactModal);
  contactModalBackdrop?.addEventListener('click', closeContactModal);

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && contactModal?.classList.contains('open')) closeContactModal();
  });

  contactForm?.addEventListener('load', handleContactFormLoad);

  function openContactFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('openContact') === '1' || window.location.hash === '#contact') {
      openContactModal();
    }
  }

  openContactFromUrl();

  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#contact') openContactModal();
  });

  // Video trailer modal
  const trailerCards = document.querySelectorAll('.trailer-card');
  const videoModal = document.getElementById('video-modal');
  const videoBackdrop = videoModal?.querySelector('.video-modal-backdrop');
  const videoClose = videoModal?.querySelector('.video-modal-close');
  const videoIframe = document.getElementById('video-iframe');

  function getYouTubeVideoId(input) {
    if (!input) return '';

    const raw = input.trim();

    // Already a plain YouTube ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;

    try {
      const url = new URL(raw);

      // youtu.be/<id>
      if (url.hostname.includes('youtu.be')) {
        return url.pathname.replace('/', '').split('/')[0] || '';
      }

      // youtube.com/watch?v=<id>
      const watchId = url.searchParams.get('v');
      if (watchId) return watchId;

      // youtube.com/shorts/<id> or /embed/<id>
      const parts = url.pathname.split('/').filter(Boolean);
      const markerIndex = parts.findIndex((part) => part === 'shorts' || part === 'embed');
      if (markerIndex >= 0 && parts[markerIndex + 1]) return parts[markerIndex + 1];
    } catch (_) {
      return '';
    }

    return '';
  }

  function openVideoModal(videoSource) {
    if (!videoModal || !videoIframe) return;

    const videoId = getYouTubeVideoId(videoSource);
    if (!videoId) return;

    const origin = encodeURIComponent(window.location.origin);
    const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${origin}`;
    videoIframe.src = embedUrl;

    const youtubeLink = document.getElementById('video-youtube-link');
    if (youtubeLink) {
      youtubeLink.href = `https://www.youtube.com/watch?v=${videoId}`;
    }

    videoModal.classList.add('open');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeVideoModal() {
    if (!videoModal || !videoIframe) return;
    videoModal.classList.remove('open');
    videoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    videoIframe.src = '';
  }

  trailerCards.forEach((card) => {
    card.addEventListener('click', () => {
      const videoSource = card.getAttribute('data-video');
      if (videoSource) openVideoModal(videoSource);
    });
  });

  videoClose?.addEventListener('click', closeVideoModal);
  videoBackdrop?.addEventListener('click', closeVideoModal);

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && videoModal?.classList.contains('open')) {
      closeVideoModal();
    }
  });

  // Intersection Observer for reveal animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.14 });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
});
