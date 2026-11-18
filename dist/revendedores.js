(() => {
  'use strict';
  // Evita reexibir a biblioteca do histórico após encerrar a sessão.
  addEventListener('pageshow', event => { if (event.persisted) location.reload(); });
  const loginForm = document.querySelector('.reseller-login-form');
  if (loginForm) loginForm.addEventListener('submit', () => {
    const button = loginForm.querySelector('[type="submit"]');
    button.disabled = true;
    button.textContent = 'Entrando…';
  });
  const toggle = document.querySelector('[data-password-toggle]');
  if (toggle) {
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      const field = document.getElementById(toggle.getAttribute('aria-controls'));
      const show = field.type === 'password';
      field.type = show ? 'text' : 'password';
      toggle.textContent = show ? 'Ocultar' : 'Mostrar';
      toggle.setAttribute('aria-pressed', String(show));
    });
  }
  const search = document.querySelector('#reseller-search');
  if (!search) return;
  const rows = [...document.querySelectorAll('[data-file-name]')];
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  search.addEventListener('input', () => {
    const query = normalize(search.value.trim());
    let total = 0;
    rows.forEach(row => {
      const match = normalize(row.dataset.fileName).includes(query);
      row.hidden = !match;
      if (match) total += 1;
    });
    document.querySelector('[data-file-count]').textContent = `${total} ${total === 1 ? 'categoria' : 'categorias'}`;
    document.querySelector('[data-file-empty]').hidden = total !== 0;
  });
})();
