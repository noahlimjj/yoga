// ===================================
// YOGA APP - Main JavaScript
// ===================================

// Session data with YouTube IDs (skip first 10 seconds)
const sessions = {
  morning: {
    id: 'ihba9Lw0tv4',
    title: 'Morning Stretch',
    duration: '10 min',
    startTime: 10 // Skip intro
  },
  posture: {
    id: 'BPlCatqZRPI',
    title: 'Posture Fix',
    duration: '10 min',
    startTime: 10
  },
  fullbody: {
    id: 'tnZ96Y2C28Y',
    title: 'Full Body Stretch',
    duration: '25 min',
    startTime: 10
  }
};

// Open modal with embedded YouTube video
function openSessionModal(sessionKey) {
  const session = sessions[sessionKey];
  if (!session) return;

  const modal = document.getElementById('video-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDuration = document.getElementById('modal-duration');
  const videoContainer = document.getElementById('video-container');

  modalTitle.textContent = session.title;
  modalDuration.textContent = session.duration;

  // Create YouTube embed iframe
  videoContainer.innerHTML = `
    <iframe 
      id="youtube-video"
      src="https://www.youtube.com/embed/${session.id}?start=${session.startTime}&autoplay=1&rel=0&modestbranding=1"
      title="${session.title}"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
  const modal = document.getElementById('video-modal');
  const videoContainer = document.getElementById('video-container');

  modal.classList.remove('active');
  document.body.style.overflow = '';

  // Remove iframe to stop video
  videoContainer.innerHTML = '';
}

// Smooth scroll to section
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  // Session card click handlers
  document.querySelectorAll('.session-card').forEach(card => {
    card.addEventListener('click', () => {
      const sessionKey = card.dataset.session;
      openSessionModal(sessionKey);
    });
  });

  // Modal close button
  const closeBtn = document.querySelector('.modal-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Click outside modal to close
  const modalOverlay = document.getElementById('video-modal');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  // Escape key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').slice(1);
      scrollToSection(targetId);
    });
  });

  console.log('Yoga App initialized');
});
