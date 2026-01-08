/**
 * بلاگ بین‌المللی - International Blog
 * اسکریپت تعاملی و مدرن برای نمایش مقالات
 */

 class InternationalBlog {
    constructor() {
      this.blogSection = document.getElementById('blog');
      this.articleCards = document.querySelectorAll('.article-card');
      this.init();
    }
    
    init() {
      if (!this.blogSection) return;
      
      // 1. افزودن کلاس بین‌المللی
      this.blogSection.classList.add('international-blog');
      
      // 2. راه‌اندازی تعاملات کارت‌ها
      this.setupCardInteractions();
      
      // 3. راه‌اندازی انیمیشن‌ها
      this.setupAnimations();
      
      // 4. بهینه‌سازی تصاویر
      this.optimizeImages();
      
      // 5. ردیابی تعاملات
      this.setupAnalytics();
    }
    
    setupCardInteractions() {
      this.articleCards.forEach(card => {
        // افکت پارالاکس داخل تصویر
        card.addEventListener('mousemove', (e) => this.handleParallax(e, card));
        
        // بازگرداندن تصویر به حالت اول
        card.addEventListener('mouseleave', () => {
          const img = card.querySelector('.article-image img');
          if (img) {
            img.style.transform = 'scale(1)';
          }
        });
      });
    }
    
    handleParallax(e, card) {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      const img = card.querySelector('.article-image img');
      if (img) {
        const moveX = (x - 50) * 0.05;
        const moveY = (y - 50) * 0.05;
        img.style.transform = `scale(1.1) translate(${moveX}px, ${moveY}px)`;
      }
    }
    
    setupAnimations() {
      // انیمیشن ورود کارت‌ها
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
      
      this.articleCards.forEach(card => {
        observer.observe(card);
      });
    }
    
    optimizeImages() {
      // لودینگ lazy برای تصاویر
      const images = this.blogSection.querySelectorAll('img[loading="lazy"]');
      images.forEach(img => {
        // افزودن placeholder
        if (!img.complete) {
          img.style.backgroundColor = '#f0f0f0';
        }
      });
    }
    
    setupAnalytics() {
      // ردیابی کلیک‌های مقالات
      const articleLinks = this.blogSection.querySelectorAll('.article-card-link');
      articleLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          const articleTitle = link.querySelector('.article-title')?.textContent || 'Unknown Article';
          
          // ارسال به Google Analytics
          if (typeof gtag !== 'undefined') {
            gtag('event', 'article_click', {
              'event_category': 'blog',
              'event_label': articleTitle,
              'value': 1
            });
          }
          
          // لاگ کنسول
          console.log(`Article clicked: ${articleTitle}`);
        });
      });
      
      // ردیابی نمایش بخش بلاگ
      const blogObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (typeof gtag !== 'undefined') {
              gtag('event', 'blog_section_view', {
                'event_category': 'engagement',
                'event_label': 'blog_impression'
              });
            }
            blogObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      
      blogObserver.observe(this.blogSection);
    }
    
    destroy() {
      // تمیزکاری رویدادها
      this.articleCards.forEach(card => {
        card.removeEventListener('mousemove', this.handleParallax);
        card.removeEventListener('mouseleave', this.resetParallax);
      });
    }
  }
  
  // راه‌اندازی هنگام لود DOM
  document.addEventListener('DOMContentLoaded', () => {
    window.blogInstance = new InternationalBlog();
    
    // پشتیبانی از PJAX/TurboLinks
    if (typeof Turbo !== 'undefined') {
      document.addEventListener('turbo:load', () => {
        if (window.blogInstance) {
          window.blogInstance.destroy();
        }
        window.blogInstance = new InternationalBlog();
      });
    }
  });