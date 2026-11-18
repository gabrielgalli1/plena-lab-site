/* Consulta local, sem envio de dados ou dependência de servidor. */
(() => {
  'use strict';
  const products = window.PLENA_PRODUCTS;
  const search = document.querySelector('#pesquisa-produtos');
  if (!Array.isArray(products) || !search) return;
  const cards = [...document.querySelectorAll('[data-catalog-item]')];
  const types = [...document.querySelectorAll('input[name="tipo"]')];
  const listView = document.querySelector('[data-catalog-list-view]');
  const detailView = document.querySelector('[data-catalog-detail-view]');
  const details = [...document.querySelectorAll('[data-product-detail]')];
  const count = document.querySelector('[data-catalog-count]');
  const empty = document.querySelector('[data-catalog-empty]');
  const back = document.querySelector('[data-catalog-back]');
  const form = document.querySelector('.catalog-search-form');
  let activeType = 'todos';
  let currentId = null;
  let lastFocusedLink = null;
  let lastSignature = '';

  const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const compact = value => normalize(value).replace(/[^a-z0-9]/g, '');
  const textIndex = product => normalize([product.name, product.subtitle, product.description, product.sourceName, ...product.aliases, ...product.variants.flatMap(v => [v.reference, v.capacity])].join(' '));
  const indexes = new Map(products.map(p => [p.id, textIndex(p)]));
  function updateSearchUrl() {
    const url = new URL(location.href);
    const query = search.value.trim();
    if (query) url.searchParams.set('q', query); else url.searchParams.delete('q');
    if (activeType !== 'todos') url.searchParams.set('tipo', activeType); else url.searchParams.delete('tipo');
    history.replaceState(null, '', url);
  }
  function filterProducts(syncUrl = true) {
    const terms = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
    const compactTerm = compact(search.value.trim());
    let visible = 0;
    cards.forEach(card => {
      const product = products.find(p => p.id === card.dataset.catalogItem);
      const index = indexes.get(product.id);
      const textMatch = !terms.length || terms.every(term => index.includes(term)) || compact(index).includes(compactTerm);
      const show = (activeType === 'todos' || activeType === product.type) && textMatch;
      card.hidden = !show;
      if (show) visible += 1;
    });
    count.textContent = `${visible} ${visible === 1 ? 'produto' : 'produtos'}`;
    empty.hidden = visible !== 0;
    if (syncUrl) updateSearchUrl();
  }
  function readSearchUrl() {
    const query = new URLSearchParams(location.search);
    search.value = query.get('q') || '';
    activeType = types.some(input => input.value === query.get('tipo')) ? query.get('tipo') : 'todos';
    types.forEach(input => { input.checked = input.value === activeType; });
    filterProducts(false);
  }
  function selectedVariant(product, capacity) {
    return product.variants.find(v => String(v.capacityMl) === capacity);
  }
  function updateVariant(product, variant) {
    const detail = details.find(node => node.dataset.productDetail === product.id);
    detail.querySelectorAll('input[type="radio"]').forEach(input => { input.checked = Boolean(variant && Number(input.value) === variant.capacityMl); });
    detail.querySelector('[data-variant-info]').textContent = variant ? `${variant.capacity} — ${variant.reference}` : 'Selecione uma opção acima.';
    const subject = [product.name, product.subtitle, variant ? `${variant.capacity}, referência ${variant.reference}` : ''].filter(Boolean).join(' — ');
    detail.querySelector('[data-product-inquiry]').href = `https://wa.me/5511947092039?text=${encodeURIComponent(`Olá! Gostaria de informações sobre ${subject}.`)}`;
  }
  function showRoute(focus = false) {
    const hash = new URLSearchParams(location.hash.slice(1));
    const product = products.find(p => p.id === hash.get('produto'));
    listView.hidden = Boolean(product);
    detailView.hidden = !product;
    details.forEach(detail => { detail.hidden = !product || detail.dataset.productDetail !== product.id; });
    document.querySelector('.catalog-type-filter').disabled = Boolean(product);
    if (product) {
      const variant = selectedVariant(product, hash.get('capacidade'));
      updateVariant(product, variant);
      currentId = product.id;
      document.title = `${product.name} ${product.subtitle} | Plena-Lab`;
      if (focus) document.querySelector(`#titulo-${product.id}`).focus();
    } else {
      const previousId = currentId;
      currentId = null;
      document.title = 'Produtos e categorias para laboratório | Plena-Lab';
      if (focus && previousId) {
        const target = lastFocusedLink && !lastFocusedLink.closest('[hidden]') ? lastFocusedLink : search;
        target.focus();
      }
    }
    lastSignature = location.search + location.hash;
  }
  search.addEventListener('input', () => filterProducts());
  types.forEach(input => input.addEventListener('change', () => { activeType = input.value; filterProducts(); }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    filterProducts();
    const heading = document.querySelector('.catalog-results-header h2');
    heading.tabIndex = -1;
    heading.focus();
  });
  document.querySelector('[data-clear-filters]').addEventListener('click', () => {
    search.value = '';
    activeType = 'todos';
    types.forEach(input => { input.checked = input.value === 'todos'; });
    filterProducts();
    search.focus();
  });
  document.querySelectorAll('a[href^="#produto="]').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button > 0) return;
    lastFocusedLink = link;
    const id = new URLSearchParams(link.hash.slice(1)).get('produto');
    const product = products.find(p => p.id === id);
    const term = compact(search.value);
    const match = term && product.variants.find(v => compact(v.reference) === term || compact(v.capacity) === term);
    if (match) {
      event.preventDefault();
      location.hash = `produto=${product.id}&capacidade=${match.capacityMl}`;
    }
  }));
  details.forEach(detail => detail.addEventListener('change', event => {
    if (!event.target.matches('input[type="radio"]')) return;
    const product = products.find(p => p.id === detail.dataset.productDetail);
    const variant = selectedVariant(product, event.target.value);
    updateVariant(product, variant);
    const url = new URL(location.href);
    url.hash = `produto=${product.id}&capacidade=${variant.capacityMl}`;
    history.replaceState(null, '', url);
    lastSignature = location.search + location.hash;
  }));
  back.addEventListener('click', () => {
    const url = new URL(location.href);
    url.hash = '';
    history.pushState(null, '', url);
    showRoute(true);
  });
  function onNavigation() {
    if (lastSignature === location.search + location.hash) return;
    readSearchUrl();
    showRoute(true);
  }
  addEventListener('hashchange', onNavigation);
  addEventListener('popstate', onNavigation);
  readSearchUrl();
  document.body.classList.add('catalog-enhanced');
  showRoute(false);
})();
