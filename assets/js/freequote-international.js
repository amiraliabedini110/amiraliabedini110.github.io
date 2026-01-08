/**
 * بخش پیشنهاد ویژه رایگان - International Free Quote
 * اسکریپت تعاملی و مدرن برای فرم تحلیل رایگان
 */

 class InternationalFreeQuote {
    constructor() {
      this.freeQuoteSection = document.getElementById('free-quote');
      this.form = document.querySelector('.modern-quote-form');
      this.submitButton = document.querySelector('.submit-button');
      this.statsNumbers = document.querySelectorAll('.stat-number');
      
      this.init();
    }
    
    init() {
      if (!this.freeQuoteSection) return;
      
      // 1. افزودن کلاس بین‌المللی
      this.freeQuoteSection.classList.add('international-free-quote');
      
      // 2. راه‌اندازی فرم
      this.setupForm();
      
      // 3. راه‌اندازی انیمیشن شمارش
      this.setupCounterAnimation();
      
      // 4. راه‌اندازی اعتبارسنجی
      this.setupValidation();
      
      // 5. راه‌اندازی انیمیشن‌های ورود
      this.setupEntranceAnimations();
      
      // 6. بهینه‌سازی برای موبایل
      this.optimizeForMobile();
      
      // 7. ردیابی تحلیل
      this.setupAnalytics();
    }
    
    setupForm() {
      if (!this.form) return;
      
      this.form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!this.validateForm()) {
          return;
        }
        
        // نمایش حالت لودینگ
        this.showLoading();
        
        try {
          // ارسال فرم به Formspree
          const formData = new FormData(this.form);
          
          // اضافه کردن اطلاعات اضافی
          formData.append('_timestamp', new Date().toISOString());
          formData.append('_page', window.location.href);
          
          const response = await fetch(this.form.action, {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json'
            }
          });
          
          if (response.ok) {
            this.showSuccessMessage();
            this.resetForm();
            
            // ردیابی ارسال موفق
            this.trackFormSubmission('success');
          } else {
            throw new Error('خطا در ارسال فرم');
          }
        } catch (error) {
          this.showErrorMessage();
          this.trackFormSubmission('error', error.message);
        } finally {
          this.hideLoading();
        }
      });
      
      // اعتبارسنجی لحظه‌ای
      const inputs = this.form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('blur', () => {
          this.validateField(input);
        });
        
        input.addEventListener('input', () => {
          this.clearFieldError(input);
        });
      });
    }
    
    validateForm() {
      let isValid = true;
      const requiredFields = this.form.querySelectorAll('[required]');
      
      requiredFields.forEach(field => {
        if (!this.validateField(field)) {
          isValid = false;
        }
      });
      
      // اعتبارسنجی ویژه برای URL
      const websiteField = this.form.querySelector('#website');
      if (websiteField.value && !this.isValidUrl(websiteField.value)) {
        this.showFieldError(websiteField, 'لطفاً یک URL معتبر وارد کنید');
        isValid = false;
      }
      
      // اعتبارسنجی ویژه برای ایمیل
      const emailField = this.form.querySelector('#email');
      if (emailField.value && !this.isValidEmail(emailField.value)) {
        this.showFieldError(emailField, 'لطفاً یک ایمیل معتبر وارد کنید');
        isValid = false;
      }
      
      return isValid;
    }
    
    validateField(field) {
      if (!field.required && !field.value.trim()) {
        return true;
      }
      
      if (field.required && !field.value.trim()) {
        this.showFieldError(field, 'این فیلد الزامی است');
        return false;
      }
      
      if (field.type === 'email' && !this.isValidEmail(field.value)) {
        this.showFieldError(field, 'لطفاً یک ایمیل معتبر وارد کنید');
        return false;
      }
      
      if (field.type === 'url' && !this.isValidUrl(field.value)) {
        this.showFieldError(field, 'لطفاً یک URL معتبر وارد کنید');
        return false;
      }
      
      this.clearFieldError(field);
      return true;
    }
    
    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
    
    isValidUrl(url) {
      try {
        new URL(url);
        return true;
      } catch (_) {
        return false;
      }
    }
    
    showFieldError(field, message) {
      this.clearFieldError(field);
      
      const errorElement = document.createElement('div');
      errorElement.className = 'field-error';
      errorElement.textContent = message;
      errorElement.style.cssText = `
        color: #ff6b6b;
        font-size: 0.85rem;
        margin-top: 8px;
        display: flex;
        align-items: center;
        gap: 5px;
      `;
      
      field.parentNode.appendChild(errorElement);
      field.classList.add('error');
      
      // استایل خط قرمز
      field.style.borderColor = '#ff6b6b';
    }
    
    clearFieldError(field) {
      const existingError = field.parentNode.querySelector('.field-error');
      if (existingError) {
        existingError.remove();
      }
      
      field.classList.remove('error');
      field.style.borderColor = '';
    }
    
    showLoading() {
      if (this.submitButton) {
        this.submitButton.classList.add('loading');
        this.submitButton.disabled = true;
      }
    }
    
    hideLoading() {
      if (this.submitButton) {
        this.submitButton.classList.remove('loading');
        this.submitButton.disabled = false;
      }
    }
    
    showSuccessMessage() {
      this.showNotification('✅ فرم با موفقیت ارسال شد! تحلیل رایگان شما تا ۴۸ ساعت آینده ارسال خواهد شد.', 'success');
      
      // افزایش شمارنده
      this.incrementStatCounter();
    }
    
    showErrorMessage() {
      this.showNotification('❌ خطایی در ارسال فرم رخ داد. لطفاً دوباره تلاش کنید.', 'error');
    }
    
    showNotification(message, type = 'info') {
      const notification = document.createElement('div');
      notification.className = `quote-notification ${type}`;
      notification.textContent = message;
      
      notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 30px;
        background: ${type === 'success' ? '#2ecc71' : '#e74c3c'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-family: 'Vazir', sans-serif;
        max-width: 400px;
        direction: rtl;
        text-align: right;
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 5000);
    }
    
    resetForm() {
      if (this.form) {
        this.form.reset();
        
        // پاک کردن خطاها
        const errors = this.form.querySelectorAll('.field-error');
        errors.forEach(error => error.remove());
        
        const errorFields = this.form.querySelectorAll('.error');
        errorFields.forEach(field => {
          field.classList.remove('error');
          field.style.borderColor = '';
        });
      }
    }
    
    setupCounterAnimation() {
      if (!this.statsNumbers.length) return;
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.5
      });
      
      this.statsNumbers.forEach(number => observer.observe(number));
    }
    
    animateCounter(element) {
      const target = parseInt(element.dataset.count);
      const duration = 2000;
      const startTime = performance.now();
      
      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // تابع easing
        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
        const currentValue = Math.floor(target * easeOutQuart(progress));
        
        element.textContent = currentValue.toLocaleString('fa-IR');
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      };
      
      requestAnimationFrame(updateCounter);
    }
    
    incrementStatCounter() {
      const analysisStat = this.freeQuoteSection.querySelector('.stat-number[data-count="247"]');
      if (analysisStat) {
        const currentCount = parseInt(analysisStat.dataset.count);
        analysisStat.dataset.count = (currentCount + 1).toString();
        
        // انیمیشن افزایش
        analysisStat.textContent = (currentCount + 1).toLocaleString('fa-IR');
        
        // افکت پالس
        analysisStat.style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
          analysisStat.style.animation = '';
        }, 500);
      }
    }
    
    setupEntranceAnimations() {
      // انیمیشن ورود فرم و آمار
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1
      });
      
      const animatableElements = this.freeQuoteSection.querySelectorAll('.quote-form-container, .quote-stats');
      animatableElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
      });
    }
    
    optimizeForMobile() {
      // بهینه‌سازی برای تاچ
      const touchElements = this.freeQuoteSection.querySelectorAll('input, textarea, select, button');
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
    }
    
    setupAnalytics() {
      // ردیابی کلیک روی دکمه ارسال
      if (this.submitButton) {
        this.submitButton.addEventListener('click', () => {
          this.trackEvent('free_quote_submit_click');
        });
      }
      
      // ردیابی شروع پر کردن فرم
      const formFields = this.form?.querySelectorAll('input, textarea, select');
      formFields?.forEach(field => {
        field.addEventListener('focus', () => {
          this.trackEvent('free_quote_field_focus', field.name);
        });
      });
    }
    
    trackFormSubmission(status, errorMessage = '') {
      const data = {
        event_category: 'free_quote',
        event_label: status,
        value: 1
      };
      
      if (errorMessage) {
        data.error = errorMessage;
      }
      
      // Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submission', data);
      }
      
      // Console log
      console.log(`Free quote form submission: ${status}`, data);
    }
    
    trackEvent(action, label = '') {
      if (typeof gtag !== 'undefined') {
        gtag('event', action, {
          event_category: 'free_quote',
          event_label: label
        });
      }
    }
    
    destroy() {
      // تمیزکاری
      if (this.form) {
        this.form.removeEventListener('submit', this.handleSubmit);
      }
      
      const notifications = document.querySelectorAll('.quote-notification');
      notifications.forEach(notification => notification.remove());
    }
  }
  
  // راه‌اندازی هنگام لود DOM
  document.addEventListener('DOMContentLoaded', () => {
    // افزودن استایل‌های اضافی برای انیمیشن‌ها
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(-100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(-100%);
          opacity: 0;
        }
      }
      
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
      
      .touch-active {
        opacity: 0.7;
        transform: scale(0.98);
      }
      
      input.error,
      textarea.error,
      select.error {
        border-color: #ff6b6b !important;
        background: rgba(255, 107, 107, 0.05) !important;
      }
    `;
    document.head.appendChild(style);
    
    // راه‌اندازی بخش پیشنهاد ویژه رایگان
    window.freeQuoteInstance = new InternationalFreeQuote();
    
    // پشتیبانی از PJAX/TurboLinks
    if (typeof Turbo !== 'undefined') {
      document.addEventListener('turbo:load', () => {
        if (window.freeQuoteInstance) {
          window.freeQuoteInstance.destroy();
        }
        window.freeQuoteInstance = new InternationalFreeQuote();
      });
    }
  });
  
  // API عمومی
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = InternationalFreeQuote;
  }