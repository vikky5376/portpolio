/* ==========================================================================
   ADVANCED INTERACTIVE SCRIPTING ENGINE (VIGNESH B PORTFOLIO)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 1. CURSOR NEON GLOW ENGINE
  // ==========================================================================
  const cursorGlow = document.getElementById('cursor-glow');
  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;
  let targetX = cursorX;
  let targetY = cursorY;

  // Track mouse coordinates
  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  // Smooth lerping cursor movement to avoid stuttering
  function updateCursorPosition() {
    const dx = targetX - cursorX;
    const dy = targetY - cursorY;
    cursorX += dx * 0.12;
    cursorY += dy * 0.12;
    
    if (cursorGlow) {
      cursorGlow.style.left = `${cursorX}px`;
      cursorGlow.style.top = `${cursorY}px`;
    }
    requestAnimationFrame(updateCursorPosition);
  }
  updateCursorPosition();

  // Mouse hover button scale cursors
  const interactiveElements = document.querySelectorAll('a, button, select, input, textarea, .skill-card');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (cursorGlow) {
        cursorGlow.style.width = '550px';
        cursorGlow.style.height = '550px';
      }
    });
    el.addEventListener('mouseleave', () => {
      if (cursorGlow) {
        cursorGlow.style.width = '400px';
        cursorGlow.style.height = '400px';
      }
    });
  });


  // ==========================================================================
  // 2. HIGH-PERFORMANCE CANVAS PARTICLE SYSTEM (BACKGROUND GRAPH)
  // ==========================================================================
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let mouse = {
      x: null,
      y: null,
      radius: 120 // Mouse interaction boundary radius
    };

    // Track mouse on canvas coordinates
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Resize canvas based on viewport dimensions
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    }
    window.addEventListener('resize', resizeCanvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particle Object Blueprint
    class Particle {
      constructor(x, y, vx, vy, size, baseColor) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.size = size;
        this.baseSize = size;
        this.color = baseColor;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        // Move particle
        this.x += this.vx;
        this.y += this.vy;

        // Bounce on boundaries
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

        // Mouse collision interaction (Push particles away)
        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouse.radius) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * 1.5;
            let directionY = forceDirectionY * force * 1.5;
            
            this.x -= directionX;
            this.y -= directionY;
            this.size = this.baseSize * 1.5; // Grow slightly on hover
          } else {
            if (this.size > this.baseSize) this.size -= 0.1;
          }
        } else {
          if (this.size > this.baseSize) this.size -= 0.1;
        }

        this.draw();
      }
    }

    // Populate particle matrices
    function initParticles() {
      particlesArray = [];
      // Adjust density based on screen dimensions
      const numberOfParticles = Math.min(Math.floor((canvas.width * canvas.height) / 14000), 100);
      const colors = ['rgba(0, 242, 254, 0.45)', 'rgba(138, 43, 226, 0.35)', 'rgba(0, 229, 255, 0.35)']; // Increased base color opacities
      
      for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 2 + 1;
        let x = Math.random() * (canvas.width - size * 2) + size;
        let y = Math.random() * (canvas.height - size * 2) + size;
        let vx = (Math.random() - 0.5) * 0.4;
        let vy = (Math.random() - 0.5) * 0.4;
        let color = colors[Math.floor(Math.random() * colors.length)];
        
        particlesArray.push(new Particle(x, y, vx, vy, size, color));
      }
    }

    // Connect close nodes with high-tech mesh web lines
    function connectNodes() {
      let opacityValue = 1;
      const maxDistance = 110;
      
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let dx = particlesArray[a].x - particlesArray[b].x;
          let dy = particlesArray[a].y - particlesArray[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            opacityValue = 1 - (distance / maxDistance);
            ctx.strokeStyle = `rgba(0, 229, 255, ${opacityValue * 0.24})`; // Doubled line visibility from 0.12 to 0.24
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    // Animation Loop
    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      connectNodes();
      requestAnimationFrame(animateParticles);
    }

    // Initialize Particle Grid
    resizeCanvas();
    animateParticles();
  }


  // ==========================================================================
  // 3. ADVANCED TYPEWRITER ROLE CONTROLLER
  // ==========================================================================
  const typewriter = document.getElementById('typewriter');
  const roles = [
    "Future Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Java Programmer"
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function handleTypewriter() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      // Deleting characters
      typewriter.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Deletes faster
    } else {
      // Typing characters
      typewriter.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100; // Normal typing speed
    }

    // Status shifts
    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at full word typed
      typingSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Pause before typing next word
    }

    setTimeout(handleTypewriter, typingSpeed);
  }

  if (typewriter) {
    setTimeout(handleTypewriter, 1000);
  }


  // ==========================================================================
  // 4. INTERSECTION OBSERVER FOR ACTIVE SCROLL REVEALS & STATS COUNTERS
  // ==========================================================================
  
  // A. Header scrolled status
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // B. Scroll Reveal observer
  const revealElements = document.querySelectorAll('.scroll-reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Stop observing once revealed to conserve resource threads
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  // C. Skill percentage fill bars animation
  const skillCards = document.querySelectorAll('.skill-card');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fillBar = entry.target.querySelector('.skill-bar-fill');
        if (fillBar) {
          fillBar.style.width = fillBar.getAttribute('data-width');
        }
      }
    });
  }, { threshold: 0.1 });

  skillCards.forEach(card => skillObserver.observe(card));

  // D. Academic Statistics Counter Animation
  const statsCard = document.querySelector('.glass-stats-card');
  let countersAnimated = false;

  function countUp(elementId, targetValue, suffix) {
    const el = document.getElementById(elementId);
    if (!el) return;
    
    let currentValue = 0;
    const duration = 1500; // Duration in ms
    const frameRate = 1000 / 60; // 60 FPS
    const totalFrames = duration / frameRate;
    const increment = targetValue / totalFrames;

    function updateCounter() {
      currentValue += increment;
      if (currentValue >= targetValue) {
        el.textContent = targetValue;
      } else {
        el.textContent = Math.floor(currentValue);
        requestAnimationFrame(updateCounter);
      }
    }
    requestAnimationFrame(updateCounter);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        countUp('stat-projects', 12);
        countUp('stat-skills', 16);
        countUp('stat-progress', 85);
      }
    });
  }, { threshold: 0.2 });

  if (statsCard) {
    statsObserver.observe(statsCard);
  }

  // E. Navigation active link section tracker
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  
  const navObserverOptions = {
    root: null,
    threshold: 0.35,
    rootMargin: "-80px 0px 0px 0px"
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(sec => navObserver.observe(sec));


  // ==========================================================================
  // 5. BUTTON CLICK RIPPLE & SPLASH EFFECTS
  // ==========================================================================
  const rippleButtons = document.querySelectorAll('.ripple-btn');
  
  rippleButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      // Calculate coordinates relative to target element
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Spawn span ripple child
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      this.appendChild(ripple);

      // Remove ripple element after animation finishes
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });


  // ==========================================================================
  // 6. PORTFOLIO TILT-EFFECT ON PROJECTS CARDS
  // ==========================================================================
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate rotation ratios
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * 8; // Max 8 degrees
      const rotateY = ((centerX - x) / centerX) * 8; 

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      
      // Update custom grid coords for overlay radial glow
      card.style.setProperty('--px', `${x}px`);
      card.style.setProperty('--py', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });





  // ==========================================================================
  // 9. DYNAMIC PORTFOLIO SANDBOX DEMO POPUP
  // ==========================================================================
  const demoModal = document.getElementById('demo-modal');
  const closeDemoBtn = document.getElementById('close-demo-btn');
  const demoProjectText = document.getElementById('demo-project-name');
  const demoButtons = document.querySelectorAll('.demo-btn');

  demoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.project-card');
      if (card && demoProjectText && demoModal) {
        const projectTitle = card.querySelector('.project-title').textContent;
        demoProjectText.textContent = `Retrieved secure sandbox simulation environments for "${projectTitle}". Loading responsive frames and live components...`;
        demoModal.classList.add('active');
      }
    });
  });

  if (closeDemoBtn && demoModal) {
    closeDemoBtn.addEventListener('click', () => {
      demoModal.classList.remove('active');
    });
  }


  // ==========================================================================
  // 10. MOBILE NAVIGATION DRAWER TOGGLE
  // ==========================================================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const nav = document.querySelector('.nav');
  const menuLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && nav) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      nav.classList.toggle('active');
    });

    // Close menu when clicking nav link
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        nav.classList.remove('active');
      });
    });
  }



});
