(() => {
  const icon = document.querySelector('link[rel="icon"]');
  if (!icon) return;

  const lightIcon = icon.href;
  const darkIcon = '/assets/favicon-plena-lab-branco.png';
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function updateIcon() {
    icon.href = prefersDark.matches ? darkIcon : lightIcon;
  }

  prefersDark.addEventListener('change', updateIcon);
  updateIcon();
})();
