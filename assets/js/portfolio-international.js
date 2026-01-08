/**
 * پورتفولیو بین‌المللی - International Portfolio
 * اسکریپت تعاملی و مدرن برای نمایش پروژه‌ها
 */

class InternationalPortfolio {
  constructor() {
    this.portfolioSection = document.getElementById('portfolio');
    this.projectCards = document.querySelectorAll('.project-card');
    this.modal = document.getElementById('projectModal');
    this.currentProjectIndex = 0;
    
    this.init();
  }
  
  init() {
    if (!this.portfolioSection) return;
    
    // 1. افزودن کلاس‌های بین‌المللی
    this.portfolioSection.classList.add('international-portfolio');
    
    // 2. راه‌اندازی رویدادهای کارت‌ها
    this.setupCardInteractions();
    
    // 3. راه‌اندازی ناوبری
    this.setupNavigation();
    
    // 4. راه‌اندازی مدال
    this.setupModal();
    
    // 5. راه‌اندازی انیمیشن‌های ورود
    this.setupEntranceAnimations();
    
    // 6. ردیابی تعاملات
    this.setupAnalytics();
    
    // 7. بهینه‌سازی تصاویر
    this.optimizeImages();
  }
  
  setupCardInteractions() {
    this.projectCards.forEach((card, index) => {
      // رویدادهای hover برای موبایل و دسکتاپ
      card.addEventListener('mouseenter', () => this.handleCardHover(card, true));
      card.addEventListener('mouseleave', () => this.handleCardHover(card, false));
      
      // رویداد کلیک برای پیش‌نمایش
      const previewBtn = card.querySelector('.project-preview');
      if (previewBtn) {
        previewBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.openProjectModal(index);
        });
      }
      
      // افکت پارالاکس داخل کارت
      card.addEventListener('mousemove', (e) => this.handleParallax(e, card));
    });
  }
  
  handleCardHover(card, isHovering) {
    if (isHovering) {
      // افزودن افکت نور
      const lightEffect = document.createElement('div');
      lightEffect.className = 'card-light-effect';
      lightEffect.style.cssText = `
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), 
          rgba(255, 255, 255, 0.1) 0%, 
          transparent 50%);
        pointer-events: none;
        z-index: 2;
      `;
      card.appendChild(lightEffect);
      
      // آمار انیمیشن
      this.animateStats(card);
    } else {
      // حذف افکت نور
      const lightEffect = card.querySelector('.card-light-effect');
      if (lightEffect) {
        lightEffect.remove();
      }
    }
  }
  
  handleParallax(e, card) {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const lightEffect = card.querySelector('.card-light-effect');
    if (lightEffect) {
      lightEffect.style.setProperty('--x', `${x}%`);
      lightEffect.style.setProperty('--y', `${y}%`);
    }
    
    // افکت پارالاکس ملایم
    const image = card.querySelector('img');
    if (image) {
      const moveX = (x - 50) * 0.1;
      const moveY = (y - 50) * 0.1;
      image.style.transform = `scale(1.1) translate(${moveX}px, ${moveY}px)`;
    }
  }
  
  animateStats(card) {
    const stats = card.querySelectorAll('.stat-value');
    stats.forEach(stat => {
      const originalValue = stat.textContent;
      if (originalValue.includes('٪') || originalValue.includes('%')) {
        const number = parseInt(originalValue);
        if (!isNaN(number)) {
          // انیمیشن شمارش
          this.animateNumber(stat, 0, number, 1500);
        }
      }
    });
  }
  
  animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const updateNumber = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // تابع easing
      const easeOutQuad = (t) => t * (2 - t);
      const currentValue = Math.floor(start + (end - start) * easeOutQuad(progress));
      
      element.textContent = currentValue + (element.textContent.includes('٪') ? '٪' : '');
      
      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    };
    
    requestAnimationFrame(updateNumber);
  }
  
  setupNavigation() {
    const dots = document.querySelectorAll('.nav-dot');
    const prevBtn = document.querySelector('.nav-arrow.prev');
    const nextBtn = document.querySelector('.nav-arrow.next');
    
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.dataset.index);
        this.scrollToProject(index);
        this.updateActiveDot(index);
      });
    });
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.navigateProjects(-1);
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.navigateProjects(1);
      });
    }
    
    // کنترل با کیبورد
    document.addEventListener('keydown', (e) => {
      if (this.modal.classList.contains('active')) return;
      
      if (e.key === 'ArrowRight') {
        this.navigateProjects(-1);
      } else if (e.key === 'ArrowLeft') {
        this.navigateProjects(1);
      }
    });
  }
  
  navigateProjects(direction) {
    const newIndex = (this.currentProjectIndex + direction + this.projectCards.length) % this.projectCards.length;
    this.scrollToProject(newIndex);
    this.updateActiveDot(newIndex);
  }
  
  scrollToProject(index) {
    this.currentProjectIndex = index;
    const card = this.projectCards[index];
    
    if (card) {
      card.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
      
      // افکت هایلایت
      this.highlightCard(card);
    }
  }
  
  updateActiveDot(index) {
    const dots = document.querySelectorAll('.nav-dot');
    dots.forEach(dot => dot.classList.remove('active'));
    
    const activeDot = document.querySelector(`.nav-dot[data-index="${index}"]`);
    if (activeDot) {
      activeDot.classList.add('active');
    }
  }
  
  highlightCard(card) {
    // حذف هایلایت قبلی
    this.projectCards.forEach(c => c.classList.remove('highlighted'));
    
    // افزودن هایلایت جدید
    card.classList.add('highlighted');
    
    // انیمیشن پالس
    card.style.animation = 'pulseHighlight 1s ease';
    setTimeout(() => {
      card.style.animation = '';
    }, 1000);
  }
  
  setupModal() {
    const closeBtn = this.modal.querySelector('.modal-close');
    const overlay = this.modal.querySelector('.modal-overlay');
    
    // رویدادهای بستن مدال
    [closeBtn, overlay].forEach(element => {
      if (element) {
        element.addEventListener('click', () => {
          this.closeModal();
        });
      }
    });
    
    // بستن با کلید Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.closeModal();
      }
    });
  }
  
  openProjectModal(projectIndex) {
    const project = this.projectCards[projectIndex];
    if (!project) return;
    
    // پر کردن محتوای مدال
    const modalBody = this.modal.querySelector('.modal-body');
    const projectData = this.getProjectData(projectIndex);
    
    modalBody.innerHTML = `
      <div class="modal-project">
        <div class="modal-header">
          <h2 class="modal-title">${projectData.title}</h2>
          <div class="modal-tags">${projectData.tags}</div>
        </div>
        
        <div class="modal-image">
          <img src="${projectData.image}" alt="${projectData.title}" loading="lazy">
        </div>
        
        <div class="modal-content">
          <div class="modal-description">
            <h3>خلاصه پروژه</h3>
            <p>${projectData.description}</p>
          </div>
          
          <div class="modal-details">
            <div class="detail-section">
              <h4>چالش‌ها</h4>
              <ul>${projectData.challenges}</ul>
            </div>
            
            <div class="detail-section">
              <h4>راه‌حل‌ها</h4>
              <ul>${projectData.solutions}</ul>
            </div>
            
            <div class="detail-section">
              <h4>نتایج</h4>
              <div class="results-grid">${projectData.results}</div>
            </div>
          </div>
          
          <div class="modal-actions">
            <a href="${projectData.link}" class="btn-primary">
              <span>مشاهده کامل پروژه</span>
              <i class="fas fa-external-link-alt"></i>
            </a>
          </div>
        </div>
      </div>
    `;
    
    // نمایش مدال
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // ردیابی تحلیل
    this.trackModalView(projectData.title);
  }
  
  getProjectData(index) {
    // داده‌های پروژه‌ها
    const projects = [
      {
        title: 'رستوران‌های زنجیره‌ای',
        image: 'ADS and FOOd.png',
        description: 'طراحی و اجرای کمپین تبلیغاتی جامع برای ۵ شعبه رستوران زنجیره‌ای با تمرکز بر افزایش مشتریان وفادار و بهبود تجربه مشتری.',
        tags: '<span class="tag">تبلیغات دیجیتال</span><span class="tag">شبکه‌های اجتماعی</span><span class="tag">برندینگ</span>',
        challenges: `
          <li>عدم وجود هویت بصری یکپارچه بین شعب</li>
          <li>جذب مشتریان وفادار در رقابت شدید بازار</li>
          <li>مدیریت همزمان کمپین‌های ۵ شعبه مختلف</li>
        `,
        solutions: `
          <li>طراحی هویت بصری منحصربه‌فرد و یکپارچه</li>
          <li>ایجاد برنامه وفاداری دیجیتال</li>
          <li>استراتژی محتوای یکپارچه برای تمام شعب</li>
        `,
        results: `
          <div class="result-item">
            <div class="result-value">۳۰۰٪</div>
            <div class="result-label">رشد مشتریان وفادار</div>
          </div>
          <div class="result-item">
            <div class="result-value">۴۵٪</div>
            <div class="result-label">افزایش فروش آنلاین</div>
          </div>
          <div class="result-item">
            <div class="result-value">۸.۹/۱۰</div>
            <div class="result-label">رضایت مشتری</div>
          </div>
        `,
        link: 'project-restaurant.html'
      },
      {
        title: 'استارتاپ حوزه فین‌تک',
        image: 'Fintek-image.png',
        description: 'طراحی هویت بصری و استراتژی سئو پیشرفته برای استارتاپ نوپا در حوزه فناوری مالی با هدف جذب سرمایه‌گذار و کاربر.',
        tags: '<span class="tag">سئو تخصصی</span><span class="tag">برندینگ کامل</span><span class="tag">طراحی UI/UX</span>',
        challenges: `
          <li>ایجاد اعتماد در بازار رقابتی فین‌تک</li>
          <li>بهبود رتبه در کلمات کلیدی رقابتی</li>
          <li>طراسی تجربه کاربری برای مخاطبان خاص</li>
        `,
        solutions: `
          <li>تدوین استراتژی سئو تکنیکال پیشرفته</li>
          <li>طراحی سیستم طراحی منحصربه‌فرد</li>
          <li>بهینه‌سازی کامل تجربه کاربری</li>
        `,
        results: `
          <div class="result-item">
            <div class="result-value">۱۵۰٪</div>
            <div class="result-label">رشد ترافیک ارگانیک</div>
          </div>
          <div class="result-item">
            <div class="result-value">۱۲</div>
            <div class="result-label">رتبه اول گوگل</div>
          </div>
          <div class="result-item">
            <div class="result-value">۱.۲M</div>
            <div class="result-label">سرمایه جذب شده</div>
          </div>
        `,
        link: 'project-fintech.html'
      }
    ];
    
    return projects[index] || projects[0];
  }
  
  closeModal() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  setupEntranceAnimations() {
    // انیمیشن ورود کارت‌ها
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    this.projectCards.forEach(card => {
      observer.observe(card);
    });
  }
  
  setupAnalytics() {
    // ردیابی کلیک‌ها
    const trackableElements = this.portfolioSection.querySelectorAll('a, button');
    trackableElements.forEach(element => {
      element.addEventListener('click', (e) => {
        const label = element.textContent.trim() || element.getAttribute('aria-label') || 'Unknown';
        
        // ارسال به Google Analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', 'portfolio_interaction', {
            'event_category': 'portfolio',
            'event_label': label,
            'value': 1
          });
        }
        
        // لاگ کنسول
        console.log(`Portfolio interaction: ${label}`);
      });
    });
  }
  
  trackModalView(projectTitle) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'project_preview', {
        'event_category': 'portfolio',
        'event_label': projectTitle
      });
    }
  }
  
  optimizeImages() {
    // لودینگ lazy برای تصاویر
    const images = this.portfolioSection.querySelectorAll('img');
    images.forEach(img => {
      if (!img.loading) {
        img.loading = 'lazy';
      }
      
      // پیش‌لود تصاویر بزرگتر برای مدال
      if (img.src.includes('ADS and FOOd.png') || img.src.includes('Fintek-image.png')) {
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'image';
        preloadLink.href = img.src;
        document.head.appendChild(preloadLink);
      }
    });
  }
  
  destroy() {
    // تمیزکاری رویدادها
    this.projectCards.forEach(card => {
      card.removeEventListener('mouseenter', this.handleCardHover);
      card.removeEventListener('mouseleave', this.handleCardHover);
      card.removeEventListener('mousemove', this.handleParallax);
    });
    
    const previewBtns = this.portfolioSection.querySelectorAll('.project-preview');
    previewBtns.forEach(btn => {
      btn.removeEventListener('click', this.openProjectModal);
    });
    
    if (this.modal) {
      this.modal.classList.remove('active');
    }
  }
}

// راه‌اندازی هنگام لود DOM
document.addEventListener('DOMContentLoaded', () => {
  // افزودن استایل‌های اضافی
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulseHighlight {
      0% { box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); }
      50% { box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3), 0 25px 50px rgba(0, 0, 0, 0.15); }
      100% { box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); }
    }
    
    .project-card.highlighted {
      animation: pulseHighlight 1s ease;
    }
    
    .project-card.animate-in {
      animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    /* استایل‌های مدال */
    .modal-project {
      padding: 10px;
    }
    
    .modal-header {
      margin-bottom: 30px;
    }
    
    .modal-title {
      font-size: 2rem;
      color: #333;
      margin-bottom: 15px;
    }
    
    .modal-tags {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    
    .modal-image {
      width: 100%;
      height: 400px;
      border-radius: 15px;
      overflow: hidden;
      margin-bottom: 30px;
    }
    
    .modal-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .modal-content h3,
    .modal-content h4 {
      color: #333;
      margin-bottom: 15px;
    }
    
    .modal-description {
      margin-bottom: 30px;
    }
    
    .modal-description p {
      line-height: 1.8;
      color: #666;
    }
    
    .modal-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
      margin-bottom: 30px;
    }
    
    .detail-section h4 {
      color: #667eea;
      font-size: 1.1rem;
      margin-bottom: 10px;
    }
    
    .detail-section ul {
      padding-right: 20px;
      margin: 0;
    }
    
    .detail-section li {
      margin-bottom: 8px;
      color: #666;
      line-height: 1.6;
    }
    
    .results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 15px;
    }
    
    .result-item {
      text-align: center;
      padding: 15px;
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
      border-radius: 10px;
      border: 1px solid rgba(102, 126, 234, 0.1);
    }
    
    .result-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #667eea;
      margin-bottom: 5px;
    }
    
    .result-label {
      font-size: 0.9rem;
      color: #666;
    }
    
    .modal-actions {
      text-align: center;
      margin-top: 30px;
    }
    
    @media (max-width: 768px) {
      .modal-title {
        font-size: 1.5rem;
      }
      
      .modal-image {
        height: 250px;
      }
      
      .modal-details {
        grid-template-columns: 1fr;
      }
    }
  `;
  document.head.appendChild(style);
  
  // راه‌اندازی پورتفولیو
  window.portfolioInstance = new InternationalPortfolio();
  
  // پشتیبانی از PJAX/TurboLinks
  if (typeof Turbo !== 'undefined') {
    document.addEventListener('turbo:load', () => {
      if (window.portfolioInstance) {
        window.portfolioInstance.destroy();
      }
      window.portfolioInstance = new InternationalPortfolio();
    });
  }
});

// API عمومی
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InternationalPortfolio;
}