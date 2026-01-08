/**
 * فوتر بین‌المللی - اسکریپت حرفه‌ای
 * طراحی شده با استانداردهای جهانی
 */

 class InternationalFooter {
    constructor() {
      this.footer = document.querySelector('footer');
      this.backToTopBtn = null;
      this.init();
    }
  
    init() {
      if (!this.footer) return;
  
      // 1. افزودن کلاس بین‌المللی
      this.footer.classList.add('international-footer');
      
      // 2. ساختار فوتر را بازسازی می‌کنیم
      this.rebuildFooterStructure();
      
      // 3. ایجاد دکمه بازگشت به بالا
      this.createBackToTopButton();
      
      // 4. راه‌اندازی فرم خبرنامه
      this.setupNewsletter();
      
      // 5. راه‌اندازی انیمیشن‌ها
      this.setupAnimations();
      
      // 6. راه‌اندازی اسکرول‌پذیری
      this.setupScrollEffects();
      
      // 7. بهینه‌سازی برای موبایل
      this.optimizeForMobile();
      
      // 8. راه‌اندازی تحلیل تعاملات
      this.setupAnalytics();
    }
  
    rebuildFooterStructure() {
      // در اینجا می‌توانید HTML فعلی را به ساختار جدید تبدیل کنید
      // از آنجایی که گفته‌اید HTML را تغییر ندهید، این بخش را می‌توانید سفارشی کنید
      // یا از کلاس‌های CSS جدید استفاده کنید
    }
  
    createBackToTopButton() {
      this.backToTopBtn = document.createElement('button');
      this.backToTopBtn.className = 'back-to-top';
      this.backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
      this.backToTopBtn.setAttribute('aria-label', 'بازگشت به بالا');
      this.backToTopBtn.setAttribute('title', 'بازگشت به بالا');
      
      document.body.appendChild(this.backToTopBtn);
      
      // رویداد کلیک
      this.backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
      
      // نمایش/پنهان کردن دکمه بر اساس اسکرول
      window.addEventListener('scroll', () => {
        this.toggleBackToTopButton();
      });
    }
  
    toggleBackToTopButton() {
      if (!this.backToTopBtn) return;
      
      if (window.scrollY > 300) {
        this.backToTopBtn.classList.add('visible');
      } else {
        this.backToTopBtn.classList.remove('visible');
      }
    }
  
    setupNewsletter() {
      const newsletterForm = this.footer.querySelector('.newsletter-form');
      if (!newsletterForm) return;
      
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const submitBtn = newsletterForm.querySelector('button');
      
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!this.validateEmail(emailInput.value)) {
          this.showNotification('لطفاً یک ایمیل معتبر وارد کنید', 'error');
          return;
        }
        
        // شبیه‌سازی ارسال فرم
        this.showLoading(submitBtn);
        
        setTimeout(() => {
          this.hideLoading(submitBtn);
          this.showNotification('عضویت شما با موفقیت انجام شد!', 'success');
          emailInput.value = '';
          
          // ذخیره در localStorage
          this.saveSubscription(emailInput.value);
        }, 1500);
      });
      
      // اعتبارسنجی لحظه‌ای
      emailInput.addEventListener('input', () => {
        if (this.validateEmail(emailInput.value)) {
          emailInput.classList.remove('invalid');
          emailInput.classList.add('valid');
        } else {
          emailInput.classList.remove('valid');
          emailInput.classList.add('invalid');
        }
      });
    }
  
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
  
    showLoading(button) {
      const originalText = button.innerHTML;
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ارسال...';
      button.disabled = true;
      button.dataset.originalText = originalText;
    }
  
    hideLoading(button) {
      if (button.dataset.originalText) {
        button.innerHTML = button.dataset.originalText;
      } else {
        button.innerHTML = 'عضویت';
      }
      button.disabled = false;
    }
  
    showNotification(message, type = 'info') {
      // ایجاد عنصر نوتیفیکیشن
      const notification = document.createElement('div');
      notification.className = `footer-notification ${type}`;
      notification.textContent = message;
      
      // استایل‌های نوتیفیکیشن
      notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: ${type === 'success' ? '#2ecc71' : '#e74c3c'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-family: 'Vazir', sans-serif;
        max-width: 300px;
      `;
      
      document.body.appendChild(notification);
      
      // حذف خودکار بعد از 5 ثانیه
      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 5000);
    }
  
    setupAnimations() {
      // فعال کردن انیمیشن‌ها هنگام اسکرول
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
          }
        });
      }, observerOptions);
      
      // مشاهده المان‌های فوتر
      const footerElements = this.footer.querySelectorAll('.footer-column, .contact-item, .social-icon');
      footerElements.forEach(el => observer.observe(el));
    }
  
    setupScrollEffects() {
      // اثر پارالاکس برای فوتر
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // فقط در صورت وجود تصویر پس‌زمینه
        const footerBg = this.footer.querySelector('.footer-bg');
        if (footerBg) {
          footerBg.style.transform = `translateY(${rate}px)`;
        }
      });
      
      // لینک‌های اسکرول نرم
      const footerLinks = this.footer.querySelectorAll('a[href^="#"]');
      footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (href === '#' || !document.querySelector(href)) return;
          
          e.preventDefault();
          const target = document.querySelector(href);
          const offset = 80;
          
          window.scrollTo({
            top: target.offsetTop - offset,
            behavior: 'smooth'
          });
        });
      });
    }
  
    optimizeForMobile() {
      // بهینه‌سازی برای تاچ
      const touchElements = this.footer.querySelectorAll('a, button, .social-icon');
      touchElements.forEach(el => {
        el.addEventListener('touchstart', () => {
          el.classList.add('touch-active');
        });
        
        el.addEventListener('touchend', () => {
          setTimeout(() => {
            el.classList.remove('touch-active');
          }, 150);
        });
      });
      
      // جلوگیری از زوم در فیلدهای ورودی
      const inputs = this.footer.querySelectorAll('input');
      inputs.forEach(input => {
        input.addEventListener('touchstart', (e) => {
          if (window.innerWidth < 768) {
            e.target.style.fontSize = '16px'; // جلوگیری از زوم در iOS
          }
        });
      });
    }
  
    setupAnalytics() {
      // ردیابی کلیک‌ها
      const clickableElements = this.footer.querySelectorAll('a, button');
      clickableElements.forEach(el => {
        el.addEventListener('click', (e) => {
          const elementType = e.target.tagName.toLowerCase();
          const elementText = e.target.textContent.trim() || e.target.getAttribute('title') || '';
          
          // در اینجا می‌توانید کد Google Analytics یا دیگر تحلیل‌گرها را اضافه کنید
          console.log(`Footer ${elementType} clicked:`, elementText);
          
          // مثال برای Google Analytics
          if (typeof gtag !== 'undefined') {
            gtag('event', 'footer_interaction', {
              'event_category': 'footer',
              'event_label': elementText,
              'value': 1
            });
          }
        });
      });
      
      // ردیابی نمایش فوتر
      const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // فوتر در دید قرار گرفت
            console.log('Footer viewed');
            
            // ارسال به Google Analytics
            if (typeof gtag !== 'undefined') {
              gtag('event', 'footer_view', {
                'event_category': 'engagement',
                'event_label': 'footer_impression'
              });
            }
          }
        });
      }, { threshold: 0.1 });
      
      footerObserver.observe(this.footer);
    }
  
    saveSubscription(email) {
      try {
        const subscriptions = JSON.parse(localStorage.getItem('newsletter_subscriptions') || '[]');
        const subscription = {
          email: email,
          date: new Date().toISOString(),
          source: 'footer_newsletter'
        };
        
        subscriptions.push(subscription);
        localStorage.setItem('newsletter_subscriptions', JSON.stringify(subscriptions));
        
        console.log('Subscription saved:', subscription);
      } catch (error) {
        console.error('Error saving subscription:', error);
      }
    }
  
    destroy() {
      // پاک کردن رویدادها و المان‌ها
      if (this.backToTopBtn) {
        this.backToTopBtn.remove();
      }
      
      window.removeEventListener('scroll', this.toggleBackToTopButton);
      
      // حذف نوتیفیکیشن‌ها
      const notifications = document.querySelectorAll('.footer-notification');
      notifications.forEach(notification => notification.remove());
    }
  }
  
  // راه‌اندازی فوتر هنگامی که DOM لود شد
  document.addEventListener('DOMContentLoaded', () => {
    // ایجاد استایل‌های اضافی برای انیمیشن‌ها
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
      
      .touch-active {
        opacity: 0.7;
        transform: scale(0.98);
      }
      
      input.valid {
        border-color: #2ecc71 !important;
      }
      
      input.invalid {
        border-color: #e74c3c !important;
      }
    `;
    document.head.appendChild(style);
    
    // راه‌اندازی فوتر
    window.footerInstance = new InternationalFooter();
    
    // پشتیبانی از TurboLinks یا PJAX
    if (typeof Turbo !== 'undefined') {
      document.addEventListener('turbo:load', () => {
        if (window.footerInstance) {
          window.footerInstance.destroy();
        }
        window.footerInstance = new InternationalFooter();
      });
    }
    
    // API عمومی برای دسترسی از خارج
    window.InternationalFooter = InternationalFooter;
  });
  
  // ویژگی‌های پیشرفته برای توسعه‌دهندگان
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = InternationalFooter;
  }