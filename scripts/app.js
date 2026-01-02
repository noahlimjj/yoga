// ===================================
// YOGA APP - Main JavaScript
// ===================================

// YouTube Player API
let player;
let isPlaying = false;
let currentSession = null;
let updateInterval = null;

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

// Load YouTube IFrame API
function loadYouTubeAPI() {
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// Called by YouTube API when ready
function onYouTubeIframeAPIReady() {
  console.log('YouTube API Ready');
}

// Create YouTube player for a session
function createPlayer(sessionKey) {
  const session = sessions[sessionKey];
  if (!session) return;
  
  currentSession = session;
  
  // Remove existing player if any
  const playerContainer = document.getElementById('youtube-player');
  playerContainer.innerHTML = '';
  
  // Create player div
  const playerDiv = document.createElement('div');
  playerDiv.id = 'yt-player';
  playerContainer.appendChild(playerDiv);
  
  player = new YT.Player('yt-player', {
    height: '1',
    width: '1',
    videoId: session.id,
    playerVars: {
      'autoplay': 0,
      'controls': 0,
      'start': session.startTime,
      'modestbranding': 1,
      'rel': 0
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  console.log('Player ready');
  updatePlayerInfo();
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    isPlaying = true;
    updatePlayButton();
    startProgressUpdate();
  } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
    isPlaying = false;
    updatePlayButton();
    stopProgressUpdate();
  }
}

// Update play/pause button state
function updatePlayButton() {
  const playBtn = document.getElementById('play-btn');
  if (playBtn) {
    playBtn.innerHTML = isPlaying ? 
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>' :
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>';
  }
}

// Update player time info
function updatePlayerInfo() {
  if (!player || typeof player.getDuration !== 'function') return;
  
  const duration = player.getDuration();
  const currentTime = player.getCurrentTime();
  
  const timeDisplay = document.getElementById('player-time');
  if (timeDisplay) {
    timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
  }
  
  // Update progress bar
  const progressFill = document.getElementById('progress-fill');
  if (progressFill && duration > 0) {
    const progress = (currentTime / duration) * 100;
    progressFill.style.width = `${progress}%`;
  }
}

function startProgressUpdate() {
  stopProgressUpdate();
  updateInterval = setInterval(updatePlayerInfo, 1000);
}

function stopProgressUpdate() {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
}

// Format time in MM:SS
function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Toggle play/pause
function togglePlay() {
  if (!player) return;
  
  if (isPlaying) {
    player.pauseVideo();
  } else {
    player.playVideo();
  }
}

// Open modal with session
function openSessionModal(sessionKey) {
  const session = sessions[sessionKey];
  if (!session) return;
  
  const modal = document.getElementById('audio-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDuration = document.getElementById('modal-duration');
  
  modalTitle.textContent = session.title;
  modalDuration.textContent = session.duration;
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Create player after modal opens
  setTimeout(() => {
    createPlayer(sessionKey);
  }, 300);
}

// Close modal
function closeModal() {
  const modal = document.getElementById('audio-modal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
  
  // Stop and clean up player
  if (player) {
    player.stopVideo();
    player.destroy();
    player = null;
  }
  stopProgressUpdate();
  isPlaying = false;
  currentSession = null;
  
  // Reset progress
  const progressFill = document.getElementById('progress-fill');
  if (progressFill) progressFill.style.width = '0%';
  
  const timeDisplay = document.getElementById('player-time');
  if (timeDisplay) timeDisplay.textContent = '0:00 / 0:00';
}

// Progress bar click to seek
function seekTo(event) {
  if (!player || typeof player.getDuration !== 'function') return;
  
  const progressBar = event.currentTarget;
  const rect = progressBar.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const percentage = clickX / rect.width;
  const duration = player.getDuration();
  const seekTime = percentage * duration;
  
  player.seekTo(seekTime, true);
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
  // Load YouTube API
  loadYouTubeAPI();
  
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
  const modalOverlay = document.getElementById('audio-modal');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }
  
  // Play button
  const playBtn = document.getElementById('play-btn');
  if (playBtn) {
    playBtn.addEventListener('click', togglePlay);
  }
  
  // Progress bar seek
  const progressBar = document.querySelector('.progress-bar');
  if (progressBar) {
    progressBar.addEventListener('click', seekTo);
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
