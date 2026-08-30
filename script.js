document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = form.querySelector('input[name="name"]').value.trim();
      const button = form.querySelector('button[type="submit"]');

      button.textContent = 'Inquiry Sent';
      button.disabled = true;

      alert(`Thank you, ${name || 'there'}! Your inquiry has been noted. We will contact you soon.`);
    });
  }
});
