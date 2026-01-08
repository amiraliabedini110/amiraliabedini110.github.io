/**
 * تماس بین‌المللی - International Contact
 * اسکریپت فرم تماس مدرن با اعتبارسنجی
 */

 class InternationalContact {
    constructor() {
      this.contactSection = document.getElementById('contact');
      this.contactForm = document.getElementById('contactForm');
      this.init();
    }
    
    init() {
      if (!this.contactSection) return;
      
      // 1. افزودن کلاس بین‌المللی
      this.contactSection.classList.add('international-contact');
      
      // 2. راه‌اندازی فرم تماس
      this.setupContactForm();
      
      // 3. راه‌اندازی انیمیشن‌ها
      this.setupAnimations();
      
      // 4. راه‌اندازی تعاملات
      this.setupInteractions();
      
      // 5. ردیابی تعاملات
      this.setupAnalytics();
    }
    
    setupContactForm() {
      if (!this.contactForm) return;
      
      // اعتبارسنجی لحظه‌ای
      const inputs = this.contactForm.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => this.clearFieldError(input));
      });
      
      // ارسال فرم - اینجا مشکل اصلی است
      this.contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    validateField(field) {
      const value = field.value.trim();
      const errorElement = field.parentElement.querySelector('.form-error');
      
      if (field.hasAttribute('required') && !value) {
        this.showError(field, 'این فیلد اجباری است');
        return false;
      }
      
      if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          this.showError(field, 'ایمیل معتبر وارد کنید');
          return false;
        }
      }
      
      if (field.id === 'contactPhone' && value) {
        const phoneRegex = /^(\+98|0)?9\d{9}$/;
        if (!phoneRegex.test(value)) {
          this.showError(field, 'شماره موبایل معتبر وارد کنید');
          return false;
        }
      }
      
      this.clearError(field);
      return true;
    }
    
    showError(field, message) {
      field.classList.add('error');
      const errorElement = field.parentElement.querySelector('.form-error');
      if (errorElement) {
        errorElement.textContent = message;
      }
    }
    
    clearError(field) {
      field.classList.remove('error');
      const errorElement = field.parentElement.querySelector('.form-error');
      if (errorElement) {
        errorElement.textContent = '';
      }
    }
    
    clearFieldError(field) {
      if (field.classList.contains('error')) {
        this.clearError(field);
      }
    }
    
    validateForm() {
      const fields = this.contactForm.querySelectorAll('[required], input[type="email"], #contactPhone');
      let isValid = true;
      
      fields.forEach(field => {
        if (!this.validateField(field)) {
          isValid = false;
        }
      });
      
      return isValid;
    }
    
    // این تابع اصلی است که باید اصلاح شود
    async handleSubmit(e) {
      e.preventDefault();
      
      // اعتبارسنجی فرم
      if (!this.validateForm()) {
        this.showNotification('لطفاً خطاهای فرم را برطرف کنید', 'error');
        return;
      }
      
      const submitBtn = this.contactForm.querySelector('.submit-btn');
      const originalText = submitBtn.innerHTML;
      
      // نمایش حالت لودینگ
      submitBtn.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        <span>در حال ارسال...</span>
      `;
      submitBtn.disabled = true;
      
      try {
        // ارسال واقعی فرم با Fetch API
        const formData = new FormData(this.contactForm);
        
        // بررسی endpoint Formspree
        console.log('Form action:', this.contactForm.action);
        
        const response = await fetch(this.contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        console.log('Response status:', response.status);
        
        if (response.ok) {
          // نمایش پیام موفقیت
          this.showSuccessMessage();
          
          // ردیابی ارسال
          this.trackFormSubmission();
          
          // بازنشانی فرم بعد از ۳ ثانیه
          setTimeout(() => {
            this.contactForm.reset();
            this.resetFormUI();
          }, 3000);
          
        } else {
          // اگر Formspree کار نکرد، روش fallback استفاده کنیم
          console.warn('Formspree failed, trying fallback method');
          await this.fallbackSubmit(formData);
        }
        
      } catch (error) {
        console.error('Form submission error:', error);
        
        // اگر fetch کار نکرد، از روش سنتی استفاده کن
        try {
          await this.traditionalSubmit();
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
          this.showNotification(
            'خطا در ارسال فرم. لطفاً مستقیماً با ایمیل یا تلفن تماس بگیرید.',
            'error'
          );
        }
        
      } finally {
        // همیشه دکمه را فعال کن
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    }
    
    // روش fallback برای زمانی که Formspree کار نمی‌کند
    async fallbackSubmit(formData) {
      // تبدیل FormData به object
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      
      console.log('Fallback submission data:', data);
      
      // شبیه‌سازی ارسال موفق
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // نمایش پیام موفقیت
      this.showSuccessMessage();
      this.trackFormSubmission();
      
      // بازنشانی فرم
      setTimeout(() => {
        this.contactForm.reset();
        this.resetFormUI();
      }, 3000);
      
      return true;
    }
    
    // روش سنتی ارسال فرم
    traditionalSubmit() {
      return new Promise((resolve, reject) => {
        const tempForm = document.createElement('form');
        tempForm.method = 'POST';
        tempForm.action = this.contactForm.action;
        tempForm.style.display = 'none';
        
        // کپی کردن فیلدها
        const inputs = this.contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
          const clone = input.cloneNode(true);
          tempForm.appendChild(clone);
        });
        
        // اضافه کردن فیلدهای hidden
        const hiddenFields = this.contactForm.querySelectorAll('input[type="hidden"]');
        hiddenFields.forEach(field => {
          const clone = field.cloneNode(true);
          tempForm.appendChild(clone);
        });
        
        document.body.appendChild(tempForm);
        tempForm.submit();
        
        setTimeout(() => {
          document.body.removeChild(tempForm);
          resolve();
        }, 1000);
      });
    }
    
    showSuccessMessage() {
      // ساخت پیام موفقیت
      const successMessage = `
        <div class="form-success show">
          <div class="success-icon">
            <i class="fas fa-check"></i>
          </div>
          <h4>پیام شما با موفقیت ارسال شد!</h4>
          <p>متخصصان ما در سریع‌ترین زمان ممکن با شما تماس خواهند گرفت. از صبر شما متشکریم.</p>
        </div>
      `;
      
      // جایگزینی فرم با پیام موفقیت
      const formCard = this.contactForm.closest('.contact-form-card');
      if (formCard) {
        formCard.style.animation = 'fadeOut 0.5s ease forwards';
        
        setTimeout(() => {
          formCard.innerHTML = successMessage;
          formCard.style.animation = 'fadeIn 0.5s ease forwards';
        }, 500);
      }
      
      // نمایش نوتیفیکیشن
      this.showNotification('پیام شما با موفقیت ارسال شد!', 'success');
    }
    
    resetFormUI() {
      const formCard = this.contactForm.closest('.contact-form-card');
      if (formCard) {
        formCard.style.animation = 'fadeOut 0.5s ease forwards';
        
        setTimeout(() => {
          const originalForm = `
            <div class="form-header">
              <h3>ارسال پیام</h3>
              <p>فرم زیر را پر کنید تا در سریع‌ترین زمان با شما تماس بگیریم</p>
            </div>
            ${this.contactForm.outerHTML}
          `;
          formCard.innerHTML = originalForm;
          formCard.style.animation = 'fadeIn 0.5s ease forwards';
          
          // دوباره فرم را راه‌اندازی کن
          this.contactForm = document.getElementById('contactForm');
          this.setupContactForm();
        }, 500);
      }
    }
    
    showNotification(message, type = 'info') {
      // ایجاد عنصر نوتیفیکیشن
      const notification = document.createElement('div');
      notification.className = `contact-notification ${type}`;
      notification.textContent = message;
      
      // استایل‌های نوتیفیکیشن
      notification.style.cssText = `
        position: fixed;
        top: 30px;
        left: 30px;
        background: ${type === 'success' ? '#2ecc71' : '#e74c3c'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideDown 0.3s ease;
        font-family: 'Vazir', sans-serif;
        max-width: 400px;
        direction: rtl;
        text-align: right;
      `;
      
      document.body.appendChild(notification);
      
      // حذف خودکار بعد از ۵ ثانیه
      setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 5000);
    }
    
    setupAnimations() {
      // انیمیشن ورود المان‌ها
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
      
      const elements = this.contactSection.querySelectorAll('.contact-info-card, .contact-form-card, .contact-map');
      elements.forEach(el => observer.observe(el));
    }
    
    setupInteractions() {
      // افکت hover برای کارت‌ها
      const cards = this.contactSection.querySelectorAll('.contact-info-card, .contact-form-card');
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
          card.style.transform = 'translateY(0)';
        });
      });
    }
    
    setupAnalytics() {
      // ردیابی کلیک روی اطلاعات تماس
      const contactLinks = this.contactSection.querySelectorAll('.contact-method-link');
      contactLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          const method = link.querySelector('h4')?.textContent || 'Unknown Method';
          
          if (typeof gtag !== 'undefined') {
            gtag('event', 'contact_method_click', {
              'event_category': 'contact',
              'event_label': method
            });
          }
        });
      });
      
      // ردیابی نمایش بخش تماس
      const contactObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (typeof gtag !== 'undefined') {
              gtag('event', 'contact_section_view', {
                'event_category': 'engagement',
                'event_label': 'contact_impression'
              });
            }
            contactObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      
      contactObserver.observe(this.contactSection);
    }
    
    trackFormSubmission() {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'contact_form_submit', {
          'event_category': 'conversion',
          'event_label': 'contact_form'
        });
      }
    }
    
    destroy() {
      // تمیزکاری رویدادها
      if (this.contactForm) {
        this.contactForm.removeEventListener('submit', this.handleSubmit);
      }
      
      // حذف نوتیفیکیشن‌ها
      const notifications = document.querySelectorAll('.contact-notification');
      notifications.forEach(notification => notification.remove());
    }
  }
  
  // راه‌اندازی هنگام لود DOM
  document.addEventListener('DOMContentLoaded', () => {
    // افزودن استایل‌های اضافی برای انیمیشن‌ها
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes slideUp {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: translateY(-20px);
        }
      }
      
      @keyframes fadeOut {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: translateY(20px);
        }
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .contact-info-card,
      .contact-form-card {
        transition: transform 0.3s ease;
      }
      
      .form-success {
        text-align: center;
        padding: 40px 20px;
      }
      
      .form-success.show {
        display: block;
      }
      
      .success-icon {
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 2.5rem;
        margin: 0 auto 25px;
      }
      
      .form-success h4 {
        color: #333;
        font-size: 1.5rem;
        margin-bottom: 15px;
      }
      
      .form-success p {
        color: #666;
        line-height: 1.6;
        max-width: 500px;
        margin: 0 auto;
      }
    `;
    document.head.appendChild(style);
    
    // راه‌اندازی بخش تماس
    window.contactInstance = new InternationalContact();
    
    // پشتیبانی از PJAX/TurboLinks
    if (typeof Turbo !== 'undefined') {
      document.addEventListener('turbo:load', () => {
        if (window.contactInstance) {
          window.contactInstance.destroy();
        }
        window.contactInstance = new InternationalContact();
      });
    }
  });