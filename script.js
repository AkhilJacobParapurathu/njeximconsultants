document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const API_BASE =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3000'
      : 'https://njeximconsultants.onrender.com';

  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      formStatus.textContent = '';
      formStatus.className = 'form-status';

      if (!form.checkValidity()) {
        form.reportValidity();
        formStatus.textContent = 'Please complete all required fields correctly.';
        formStatus.classList.add('error');
        return;
      }

      const name = form.querySelector('input[name="name"]').value.trim();
      const phone = form.querySelector('input[name="phone"]').value.trim();
      const email = form.querySelector('input[name="email"]').value.trim();
      const service = form.querySelector('select[name="service"]').value.trim();
      const message = form.querySelector('textarea[name="message"]').value.trim();
      const button = form.querySelector('button[type="submit"]');

      button.textContent = 'Sending...';
      button.disabled = true;
      form.setAttribute('aria-busy', 'true');

      try {
        const response = await fetch(`${API_BASE}/api/inquiry`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, phone, email, service, message })
        });

        const contentType = response.headers.get('content-type') || '';
        const result = contentType.includes('application/json')
          ? await response.json()
          : { message: await response.text() };

        if (!response.ok) {
          throw new Error(result.message || 'Unable to send inquiry.');
        }

        form.reset();
        button.textContent = 'Inquiry Sent';
        formStatus.textContent = `Thank you, ${name}! Your inquiry has been sent successfully.`;
        formStatus.classList.add('success');
      } catch (error) {
        formStatus.textContent = error.message || 'Something went wrong. Please try again or call us directly.';
        formStatus.classList.add('error');
      } finally {
        form.removeAttribute('aria-busy');
        button.disabled = false;
        if (button.textContent !== 'Inquiry Sent') {
          button.textContent = 'Send Inquiry';
        }
      }
    });
  }

  const menuButton = document.querySelector('.mobile-menu-button');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open menu');
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open menu');
        menuButton.focus();
      }
    });
  }

  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (button && answer) {
      button.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        faqItems.forEach((faq) => {
          faq.classList.remove('active');
          faq.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('active');
          button.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  const revealItems = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealItems.forEach((item) => item.classList.add('visible'));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
});

