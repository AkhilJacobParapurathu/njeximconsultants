document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const API_BASE =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3000'
      : 'https://nj-exim-consultants-api.onrender.com';

  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const name = form.querySelector('input[name="name"]').value.trim();
      const phone = form.querySelector('input[name="phone"]').value.trim();
      const email = form.querySelector('input[name="email"]').value.trim();
      const service = form.querySelector('select[name="service"]').value.trim();
      const message = form.querySelector('textarea[name="message"]').value.trim();
      const button = form.querySelector('button[type="submit"]');

      if (!name || !phone || !email || !service || !message) {
        alert('Please fill in all fields before sending your inquiry.');
        return;
      }

      button.textContent = 'Sending...';
      button.disabled = true;

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
        alert(`Thank you, ${name}! Your inquiry has been sent successfully.`);
      } catch (error) {
        button.textContent = 'Send Inquiry';
        button.disabled = false;
        alert(error.message || 'Something went wrong. Please try again or call us directly.');
      }
    });
  }

  const menuButton = document.querySelector('.mobile-menu-button');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
      });
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
        });

        if (!isOpen) {
          item.classList.add('active');
        }
      });
    }
  });

  const revealItems = document.querySelectorAll('.reveal');
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
