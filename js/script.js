/* ==========================================
   PROJECT HANAMI - Interactive Love Story
   Combined & Cleaned Script Engine
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  
  /* ======================================
     1. LOADING SCREEN ENGINE
  ====================================== */
  const loader = document.getElementById("loading-screen");

  function dismissLoadingScreen() {
    if (loader && loader.style.display !== "none") {
      loader.style.opacity = "0";
      loader.style.transition = "opacity 0.5s ease";
      setTimeout(() => {
        loader.style.display = "none";
      }, 500);
    }
  }

  setTimeout(dismissLoadingScreen, 1000);
  setTimeout(dismissLoadingScreen, 2500);

  /* ======================================
     2. AUDIO & CAPSULE MUSIC PLAYER ENGINE
  ====================================== */
  const btnStart = document.getElementById("btn-start");
  const bgmAudio = document.getElementById("bgm-audio");

  // Ambil elemen kapsul dan tombol mobile
  const musicCapsules = document.querySelectorAll(".music-capsule");
  const musicMobileBtns = document.querySelectorAll(".music-mobile-btn, .music-toggle-btn");

  // Pastikan class helper terpasang untuk CSS
  musicCapsules.forEach(capsule => capsule.classList.add("desktop-only"));
  musicMobileBtns.forEach(btn => {
    if (!btn.closest('.music-capsule')) {
      btn.classList.add("mobile-only");
    }
  });

  function setMusicUI(isPlaying) {
    // Update semua tombol widget & ikon
    const allToggleBtns = document.querySelectorAll(".music-toggle-btn, #music-toggle, .music-mobile-btn");
    allToggleBtns.forEach(widget => {
      const iconSpan = widget.querySelector('.music-floating__icon') || widget;
      if (isPlaying) {
        widget.classList.add("playing");
        if (iconSpan !== widget) iconSpan.textContent = "⏸️";
      } else {
        widget.classList.remove("playing");
        if (iconSpan !== widget) iconSpan.textContent = "▶️";
      }
    });

    // Update animasi kapsul desktop
    musicCapsules.forEach(capsule => {
      if (isPlaying) {
        capsule.classList.add("playing");
      } else {
        capsule.classList.remove("playing");
      }
    });
  }

  function playBgm() {
    if (!bgmAudio) return;
    
    bgmAudio.volume = 0;
    const playPromise = bgmAudio.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        setMusicUI(true);
        let vol = 0;
        const fadeIn = setInterval(() => {
          if (vol < 0.7) {
            vol += 0.05;
            bgmAudio.volume = vol;
          } else {
            clearInterval(fadeIn);
          }
        }, 100);
      }).catch(err => {
        console.log("Autoplay ditahan browser:", err);
        setMusicUI(false);
      });
    }
  }

  function pauseBgm() {
    if (bgmAudio) {
      bgmAudio.pause();
      setMusicUI(false);
    }
  }

  function toggleAudio() {
    if (bgmAudio && !bgmAudio.paused) {
      pauseBgm();
    } else {
      playBgm();
    }
  }

  // Tombol Mulai di Landing Page
  if (btnStart) {
    btnStart.addEventListener("click", (e) => {
      e.preventDefault();
      playBgm();

      if (typeof confetti === "function") {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#F8C8DC', '#A75C7B', '#FFFFFF']
        });
      }

      setTimeout(() => {
        const targetSection = document.getElementById("transition-1") || document.getElementById("chapter-1");
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    });
  }

  // Event Listener untuk tombol kontrol (Desktop & Mobile)
  const allInteractiveBtns = document.querySelectorAll(".music-toggle-btn, #music-toggle, .music-mobile-btn");
  allInteractiveBtns.forEach(widget => {
    widget.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleAudio();
    });
  });

  // Event Listener khusus kapsul desktop
  musicCapsules.forEach(capsule => {
    capsule.addEventListener("click", (e) => {
      if (e.target.closest('.music-toggle-btn') || e.target.closest('#music-toggle')) return;
      toggleAudio();
    });
    capsule.style.cursor = "pointer";
  });

  if (bgmAudio) {
    bgmAudio.addEventListener("play", () => setMusicUI(true));
    bgmAudio.addEventListener("pause", () => setMusicUI(false));
  }

  /* ======================================
     3. DYNAMIC BACKGROUND ENGINE
  ====================================== */
  const bgLayer = document.getElementById("bg-layer");
  const scenes = document.querySelectorAll("[data-bg]");

  if (bgLayer) {
    bgLayer.style.background = "var(--bg-hero)";

    if (scenes.length > 0) {
      const bgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const bg = entry.target.dataset.bg;
          bgLayer.style.background = `var(--bg-${bg})`;
        });
      }, { threshold: 0.45 });

      scenes.forEach(scene => bgObserver.observe(scene));
    }
  }

  /* ======================================
     4. REVEAL ANIMATION ENGINE
  ====================================== */
  const revealElements = document.querySelectorAll(".reveal");

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        } else {
          entry.target.classList.remove("active");
        }
      });
    }, { threshold: 0.05 });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  /* ======================================
     5. TRANSITION SECTION ENGINE
  ====================================== */
  const transition = document.querySelector(".transition");

  if (transition) {
    const transitionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          transition.classList.add("active");
        }
      });
    }, { threshold: 0.5 });

    transitionObserver.observe(transition);
  }

  /* ======================================
     6. TYPEWRITER HERO TITLE
  ====================================== */
  const heroTitle = document.querySelector(".hero__title");

  if (heroTitle) {
    const text = "Our Little Fairytale";
    heroTitle.innerHTML = "";
    let i = 0;

    function typeWriter() {
      if (i < text.length) {
        heroTitle.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, 120);
      }
    }
    setTimeout(typeWriter, 500);
  }

  /* ======================================
     7. SINGLE INTERACTIVE ENVELOPE & CONFESSION ENGINE
  ====================================== */
  const envelope = document.getElementById("envelope");
  const letter = document.getElementById("letter");
  const clickText = document.querySelector(".envelope__click-text");
  const btnYes = document.getElementById("btn-yes");
  const btnNo = document.getElementById("btn-no");
  const secretMessage = document.getElementById("secret-message");

  // Tanggal Pertemuan Pertama: 23 Oktober 2025 (Bulan 9 = Oktober)
  const firstMeetingDate = new Date(2025, 9, 23); 

  function calculateDays(startDate) {
    const today = new Date();
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const current = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const diffTime = current - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  function animateCounter(targetElement, targetNumber) {
    if (!targetElement) return;
    
    let current = 0;
    const duration = 1200;
    const steps = 30;
    const increment = targetNumber / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetNumber) {
        targetElement.textContent = targetNumber.toLocaleString();
        clearInterval(timer);
      } else {
        targetElement.textContent = Math.floor(current).toLocaleString();
      }
    }, stepTime);
  }

  // 1. Klik Amplop untuk Membuka Surat
  if (envelope) {
    envelope.addEventListener("click", () => {
      if (letter) letter.style.display = "block";
      if (clickText) clickText.style.display = "none";
    });
  }

  // 2. Tombol "Ya, Aku Mau!"
  if (btnYes) {
    btnYes.addEventListener("click", (e) => {
      e.stopPropagation();

      // Sembunyikan tombol pilihan
      btnYes.style.display = "none";
      if (btnNo) btnNo.style.display = "none";

      // Tampilkan pesan rahasia
      if (secretMessage) {
        secretMessage.classList.remove("hidden");
        secretMessage.style.display = "block";

        // Hitung & Jalankan Animasi Angka
        const dayCountElem = document.getElementById("day-count");
        const totalDays = calculateDays(firstMeetingDate);
        animateCounter(dayCountElem, totalDays);

        secretMessage.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      // Selebrasi Confetti
      if (typeof confetti === "function") {
        const count = 200;
        const defaults = { origin: { y: 0.7 } };

        const fire = (particleRatio, opts) => {
          confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio)
          });
        };

        fire(0.25, { spread: 26, startVelocity: 55, colors: ['#F8C8DC', '#A75C7B'] });
        fire(0.2, { spread: 60, colors: ['#FFFFFF', '#6C4158'] });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
      }
    });
  }

  // 3. Tombol "Enggak Dulu"
  if (btnNo) {
    const moveButton = (e) => {
      e.preventDefault();

      const padding = 20;
      const maxX = window.innerWidth - btnNo.offsetWidth - padding;
      const maxY = window.innerHeight - btnNo.offsetHeight - padding;

      const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
      const randomY = Math.max(padding, Math.floor(Math.random() * maxY));

      btnNo.style.position = "fixed";
      btnNo.style.left = `${randomX}px`;
      btnNo.style.top = `${randomY}px`;
      btnNo.style.zIndex = "9999";
    };

    btnNo.addEventListener("mouseover", moveButton);
    btnNo.addEventListener("touchstart", moveButton, { passive: false });
  }

  /* ======================================
     8. LIGHTBOX MODAL LOGIC (DELEGATED)
  ====================================== */
  const modal = document.getElementById("image-modal");
  const modalImg = document.getElementById("modal-img");
  const captionText = document.getElementById("modal-caption");

  document.addEventListener("click", (e) => {
    const photoContainer = e.target.closest(".story__photo, .polaroid-frame");

    if (photoContainer) {
      const img = photoContainer.querySelector("img");
      const caption = photoContainer.querySelector("figcaption, .story__caption, .polaroid-frame__caption");

      if (img && modal && modalImg) {
        modal.style.display = "block";
        modalImg.src = img.src;
        if (captionText) {
          captionText.innerHTML = caption ? caption.innerHTML : "";
        }
      }
    }

    if (e.target.classList.contains("image-modal__close") || e.target === modal) {
      if (modal) modal.style.display = "none";
    }
  });

});