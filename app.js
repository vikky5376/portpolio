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
  // 7. REAL-TIME FORM VALIDATION SYSTEM
  // ==========================================================================
  const form = document.getElementById('registration-form');
  const nameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const whatsappInput = document.getElementById('whatsapp');
  const messageInput = document.getElementById('message');

  // Input Field validation rules
  const validators = {
    fullName: (val) => val.trim().length >= 3,
    email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
    phone: (val) => /^[6-9]\d{9}$/.test(val.trim()), // 10 digit Indian phones
    whatsapp: (val) => /^[6-9]\d{9}$/.test(val.trim()), // 10 digit Indian phones
    message: (val) => val.trim().length >= 10
  };

  // Run validation checks on specific field
  function validateField(inputElement, validatorName, groupElementId) {
    const value = inputElement.value;
    const isValid = validators[validatorName](value);
    const groupEl = document.getElementById(groupElementId);
    
    if (groupEl) {
      if (isValid) {
        groupEl.classList.remove('invalid');
        groupEl.classList.add('valid');
      } else {
        groupEl.classList.remove('valid');
        groupEl.classList.add('invalid');
      }
    }
    return isValid;
  }

  // Setup real-time keyup and change validations
  if (nameInput) nameInput.addEventListener('input', () => validateField(nameInput, 'fullName', 'group-name'));
  if (emailInput) emailInput.addEventListener('input', () => validateField(emailInput, 'email', 'group-email'));
  if (phoneInput) phoneInput.addEventListener('input', () => validateField(phoneInput, 'phone', 'group-phone'));
  if (whatsappInput) whatsappInput.addEventListener('input', () => validateField(whatsappInput, 'whatsapp', 'group-whatsapp'));
  if (messageInput) messageInput.addEventListener('input', () => validateField(messageInput, 'message', 'group-message'));


  // ==========================================================================
  // 8. CLOUD ASYNC SUBMISSION (FIREBASE API + LOCALSTORAGE BACKUP)
  // ==========================================================================
  const submitBtn = document.getElementById('submit-btn');
  const submitText = document.getElementById('submit-text');
  const submitIcon = document.getElementById('submit-icon');
  const formLoader = document.getElementById('form-loader');
  const successModal = document.getElementById('success-modal');
  const detailsPreview = document.getElementById('modal-details-preview');

  // Firebase Realtime Database Endpoint REST API
  // Submitting directly using simple HTTPS fetch POST request
  const FIREBASE_REST_URL = 'https://portfolio-c144c-default-rtdb.firebaseio.com/registrations.json';

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Run full validations across all fields
      const isNameValid = validateField(nameInput, 'fullName', 'group-name');
      const isEmailValid = validateField(emailInput, 'email', 'group-email');
      const isPhoneValid = validateField(phoneInput, 'phone', 'group-phone');
      const isWhatsappValid = validateField(whatsappInput, 'whatsapp', 'group-whatsapp');
      const isMessageValid = validateField(messageInput, 'message', 'group-message');

      const isFormValid = isNameValid && isEmailValid && isPhoneValid && isWhatsappValid && isMessageValid;

      if (!isFormValid) {
        // Find first invalid group and trigger shake error animation
        const invalidGroups = document.querySelectorAll('.form-group.invalid');
        invalidGroups.forEach(group => {
          group.classList.add('shake-error');
          // Clear shake class after animation completes so it can be re-triggered
          setTimeout(() => {
            group.classList.remove('shake-error');
          }, 600);
        });
        return;
      }

      // Enter Loading State
      submitBtn.disabled = true;
      if (submitText) submitText.style.opacity = '0';
      if (submitIcon) submitIcon.style.opacity = '0';
      if (formLoader) formLoader.style.display = 'block';

      // Construct Payload Data
      const registrationPayload = {
        fullName: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        whatsapp: whatsappInput.value.trim(),
        message: messageInput.value.trim(),
        timestamp: new Date().toISOString()
      };

      let databaseSecured = false;

      try {
        // Attempt POST Request to cloud Firebase Database node
        const response = await fetch(FIREBASE_REST_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(registrationPayload)
        });

        if (response.ok) {
          databaseSecured = true;
          console.log("Firebase sync completed successfully!");
        } else {
          console.warn("Firebase returned an error state. Falling back to local storage...");
        }
      } catch (err) {
        console.error("Firebase network sync failed. Entering LocalStorage sync protocols:", err);
      }

      // Send Email Alert via Elastic Email API
      try {
        const emailBody = `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0c0a20; color: #f3f4f6; padding: 40px 30px; border-radius: 16px; border: 1px solid #00f2fe; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <h2 style="color: #00f2fe; border-bottom: 2px solid #8a2be2; padding-bottom: 12px; margin-top: 0; font-size: 22px; letter-spacing: 1px;">⚡ NEW USER REGISTRATION</h2>
            <p style="font-size: 15px; color: #9ca3af; line-height: 1.6; margin-bottom: 25px;">A new connection request has been securely initialized on your portfolio website contact portal.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
                <td style="padding: 12px 0; font-weight: bold; color: #00f2fe; width: 140px; font-size: 14px;">Full Name:</td>
                <td style="padding: 12px 0; color: #f3f4f6; font-size: 14px;">${registrationPayload.fullName}</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
                <td style="padding: 12px 0; font-weight: bold; color: #00f2fe; font-size: 14px;">Email Link:</td>
                <td style="padding: 12px 0; font-size: 14px;"><a href="mailto:${registrationPayload.email}" style="color: #00e5ff; text-decoration: none;">${registrationPayload.email}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
                <td style="padding: 12px 0; font-weight: bold; color: #00f2fe; font-size: 14px;">Phone Number:</td>
                <td style="padding: 12px 0; font-size: 14px;"><a href="tel:${registrationPayload.phone}" style="color: #00e5ff; text-decoration: none;">${registrationPayload.phone}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
                <td style="padding: 12px 0; font-weight: bold; color: #00f2fe; font-size: 14px;">WhatsApp URL:</td>
                <td style="padding: 12px 0; font-size: 14px;"><a href="https://wa.me/91${registrationPayload.whatsapp}" style="color: #00e5ff; text-decoration: none;">+91 ${registrationPayload.whatsapp}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px 0; font-weight: bold; color: #00f2fe; font-size: 14px; vertical-align: top;">Message Text:</td>
                <td style="padding: 12px 0; color: #d1d5db; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${registrationPayload.message}</td>
              </tr>
            </table>
            
            <div style="text-align: center; margin-top: 35px; font-size: 11px; color: #6b7280; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px; font-family: monospace;">
              Ledger committed in cloud node database. Timestamp: ${registrationPayload.timestamp}
            </div>
          </div>
        `;

        const emailParams = new URLSearchParams();
        emailParams.append('apikey', '3695C07C4C51B34CCAA852E38B4BEFED50DDA660A5B6EC34C14093E7833420DFF36630EA01FA34D2A10E71FBC28C0176');
        emailParams.append('subject', `⚡ PORTFOLIO ALERT: New submission from ${registrationPayload.fullName}`);
        emailParams.append('from', 'vikkyvikky132007@gmail.com');
        emailParams.append('fromName', 'Vignesh Portfolio Hub');
        emailParams.append('to', 'vikkyvikky132007@gmail.com');
        emailParams.append('bodyHtml', emailBody);
        emailParams.append('isTransactional', 'true');

        fetch('https://api.elasticemail.com/v2/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: emailParams.toString()
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            console.log("Admin email notification successfully dispatched via Elastic Email API!");
          } else {
            console.error("Elastic Email server declined request:", data.error);
          }
        })
        .catch(err => console.error("Email dispatch network block:", err));

      } catch (emailErr) {
        console.error("Failed to build or send Elastic Email transaction payload:", emailErr);
      }

      // LocalStorage Backup Storage Engine
      // Always store locally as a secondary ledger, or primary if firebase falls offline
      try {
        const localRecords = JSON.parse(localStorage.getItem('my_registrations') || '[]');
        registrationPayload.databaseSynced = databaseSecured;
        localRecords.push(registrationPayload);
        localStorage.setItem('my_registrations', JSON.stringify(localRecords));
      } catch (storageErr) {
        console.error("Failed to commit ledger to LocalStorage:", storageErr);
      }

      // Populate Success Splash Modal details
      if (detailsPreview) {
        detailsPreview.innerHTML = `
          <div class="preview-row">
            <span class="preview-label">Registrant Name:</span>
            <span class="preview-value">${registrationPayload.fullName}</span>
          </div>
          <div class="preview-row">
            <span class="preview-label">Contact Link:</span>
            <span class="preview-value">${registrationPayload.phone}</span>
          </div>
          <div class="preview-row">
            <span class="preview-label">Storage Matrix:</span>
            <span class="preview-value" style="color: ${databaseSecured ? 'var(--neon-green)' : 'var(--neon-gold)'}">
              ${databaseSecured ? 'CLOUD_SECURE' : 'LOCAL_BACKUP'}
            </span>
          </div>
        `;
      }

      // Trigger Modal overlay
      setTimeout(() => {
        // Exit Loading State
        submitBtn.disabled = false;
        if (submitText) submitText.style.opacity = '1';
        if (submitIcon) submitIcon.style.opacity = '1';
        if (formLoader) formLoader.style.display = 'none';

        // Clear Form inputs
        form.reset();
        document.querySelectorAll('.form-group').forEach(group => {
          group.classList.remove('valid', 'invalid');
        });

        // Launch modal splash overlay
        if (successModal) {
          successModal.classList.add('active');
        }
      }, 1000); // Artificial micro-delay for realistic secure processing feel
    });
  }

  // Handle Modal Closing trigger
  const closeModalBtn = document.getElementById('close-modal-btn');
  if (closeModalBtn && successModal) {
    closeModalBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
    });
  }


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

  // ==========================================================================
  // 11. PROFILE IMAGE CARD FLIP LISTENER (MOBILE SUPPORT)
  // ==========================================================================
  const profileFlipCard = document.getElementById('profile-flip-card');
  if (profileFlipCard) {
    profileFlipCard.closest('.flip-card-container').addEventListener('click', (e) => {
      profileFlipCard.classList.toggle('flipped');
    });
  }

});
