(() => {
  const toggle = document.querySelector('.menu-btn');
  const nav = document.getElementById('nav');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  }
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); toggle.focus(); }
  });
  window.matchMedia('(min-width: 821px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  const form = document.getElementById('trial-form');
  const success = document.getElementById('success');
  const dateInput = form.elements.date;
  dateInput.min = new Date().toISOString().split('T')[0];

  const rules = {
    name: v => v.trim().length >= 2 ? '' : 'Enter your full name.',
    phone: v => /^\+?[\d\s-]{10,15}$/.test(v.trim()) ? '' : 'Enter a valid phone number, for example +91 98765 43210.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter a valid email address.',
    interest: v => v ? '' : 'Choose a training interest.',
    date: v => !v ? 'Choose a preferred date.' : v < dateInput.min ? 'Choose today or a future date.' : '',
    message: v => v.trim().length < 10 ? 'Write at least 10 characters.' : v.length > 500 ? 'Keep your message under 500 characters.' : ''
  };

  function validateField(name) {
    const field = form.elements[name];
    const error = rules[name](field.value);
    document.getElementById(name + '-err').textContent = error;
    field.classList.toggle('invalid', Boolean(error));
    field.setAttribute('aria-invalid', String(Boolean(error)));
    return !error;
  }

  Object.keys(rules).forEach(name => {
    form.elements[name].addEventListener('blur', () => validateField(name));
    form.elements[name].addEventListener('input', () => { if (form.elements[name].classList.contains('invalid')) validateField(name); });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    success.hidden = true;
    const results = Object.keys(rules).map(validateField);
    const firstBad = Object.keys(rules).find((_, i) => !results[i]);
    if (firstBad) { form.elements[firstBad].focus(); return; }
    form.reset();
    success.hidden = false;
    success.focus();
  });
})();
