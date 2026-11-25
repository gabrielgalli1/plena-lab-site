/* Consulta local, sem envio de dados ou dependência de servidor. */
(() => {
  'use strict';
  const products = window.PLENA_PRODUCTS;
  const search = document.querySelector('#pesquisa-produtos');
  if (!Array.isArray(products) || !search) return;
  const cards = [...document.querySelectorAll('[data-catalog-item]')];
  const types = [...document.querySelectorAll('[data-category]')];
  const listView = document.querySelector('[data-catalog-list-view]');
  const detailView = document.querySelector('[data-catalog-detail-view]');
  const details = [...document.querySelectorAll('[data-product-detail]')];
  const catalogLineDetail = document.querySelector('[data-catalog-line-detail]');
  const catalogLineNames = new Map([...document.querySelectorAll('.catalog-line[data-category-group]')].map(group => [
    group.dataset.categoryGroup,
    group.querySelector('h2').textContent
  ]));
  const resultsHeader = document.querySelector('.catalog-results-header');
  const count = document.querySelector('[data-catalog-count]');
  const empty = document.querySelector('[data-catalog-empty]');
  const back = document.querySelector('[data-catalog-back]');
  const form = document.querySelector('.catalog-search-form');
  const overview = document.querySelector('[data-category-overview]');
  const productGroups = document.querySelector('[data-product-groups]');
  const categoryTiles = [...document.querySelectorAll('[data-category-tile]')];
  let activeType = 'todos';
  let currentId = null;
  let lastFocusedLink = null;
  let lastSignature = '';
  let listScroll = null;

  const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const compact = value => normalize(value).replace(/[^a-z0-9]/g, '');
  function searchIndex(product) {
    const fields = [
      product.name, product.subtitle, product.description, product.sourceName,
      ...product.aliases,
      ...product.variants.flatMap(option => [option.reference, option.capacity, option.detail])
    ].filter(Boolean);
    return { text: normalize(fields.join(' ')), compactFields: fields.map(compact) };
  }
  const indexes = new Map(products.map(product => [product.id, searchIndex(product)]));
  function updateSearchUrl(push = false) {
    const url = new URL(location.href);
    const query = search.value.trim();
    if (query) url.searchParams.set('q', query); else url.searchParams.delete('q');
    if (activeType !== 'todos') url.searchParams.set('tipo', activeType); else url.searchParams.delete('tipo');
    history[push ? 'pushState' : 'replaceState'](null, '', url);
    lastSignature = location.search + location.hash;
  }
  function filterProducts(syncUrl = true) {
    const terms = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
    const compactTerm = compact(search.value.trim());
    let visible = 0;
    cards.forEach(card => {
      const product = products.find(p => p.id === card.dataset.catalogItem);
      const index = indexes.get(product.id);
      const textMatch = !terms.length || terms.every(term => index.text.includes(term)) ||
        index.compactFields.some(field => field.includes(compactTerm));
      const show = (activeType === 'todos' || activeType === product.type) && textMatch;
      card.hidden = !show;
      if (show) visible += 1;
    });
    document.querySelectorAll('[data-category-group]').forEach(group => {
      const total = [...group.querySelectorAll('[data-catalog-item]')].filter(card => !card.hidden).length;
      group.hidden = total === 0;
      group.querySelector('.catalog-group-heading').hidden = activeType !== 'todos';
      group.querySelector('[data-group-count]').textContent = `${total} ${total === 1 ? 'item' : 'itens'}`;
    });
    const isOverview = activeType === 'todos';
    overview.hidden = !isOverview;
    productGroups.hidden = isOverview;
    let visibleCategories = 0;
    categoryTiles.forEach(tile => {
      const matching = cards.some(card => !card.hidden && products.find(p => p.id === card.dataset.catalogItem).type === tile.dataset.categoryTile);
      tile.hidden = !matching;
      if (matching) visibleCategories += 1;
    });
    count.textContent = isOverview ? `${visibleCategories} ${visibleCategories === 1 ? 'categoria' : 'categorias'}` : `${visible} ${visible === 1 ? 'item' : 'itens'}`;
    const lineName = catalogLineNames.get(activeType);
    const categoryName = isOverview ? 'Explore nossas categorias' : lineName || products.find(p => p.type === activeType).category;
    resultsHeader.classList.toggle('catalog-line-results', Boolean(lineName));
    resultsHeader.querySelector('h2').textContent = categoryName;
    empty.hidden = visible !== 0;
    if (syncUrl) updateSearchUrl();
  }
  function readSearchUrl() {
    const query = new URLSearchParams(location.search);
    search.value = query.get('q') || '';
    activeType = types.some(button => button.dataset.category === query.get('tipo')) ? query.get('tipo') : 'todos';
    types.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === activeType)));
    filterProducts(false);
  }
  function renderCatalogLineDetail(detail, product, lineName) {
    const panel = detail.querySelector('.detail-capacity');
    if (currentId !== product.id) panel.open = false;
    if (detail.dataset.productDetail === product.id) return;
    detail.dataset.productDetail = product.id;

    const title = detail.querySelector('h1');
    title.id = `titulo-${product.id}`;
    title.textContent = product.name;
    detail.setAttribute('aria-labelledby', title.id);
    const category = detail.querySelector('[data-detail-category]');
    category.textContent = lineName;
    category.href = `produtos.html?tipo=${product.type}`;

    const photo = detail.querySelector('[data-detail-image]');
    photo.alt = product.imageAlt || '';
    photo.hidden = !product.image;
    if (product.image) photo.src = product.image;
    else photo.removeAttribute('src');
    detail.querySelector('[data-detail-photo-placeholder]').hidden = Boolean(product.image);
    const caption = detail.querySelector('[data-detail-image-caption]');
    caption.textContent = product.imageCaption || '';
    caption.hidden = !product.imageCaption;

    detail.querySelector('.detail-description').textContent = product.description;
    detail.querySelector('.detail-facts').replaceChildren(...product.features.map(([label, value]) => {
      const fact = document.createElement('div');
      const term = document.createElement('dt');
      const definition = document.createElement('dd');
      term.textContent = label;
      definition.textContent = value;
      fact.append(term, definition);
      return fact;
    }));

    panel.hidden = product.variants.length === 0;
    detail.querySelector('[data-detail-variant-label]').textContent = product.availabilityLabel;
    detail.querySelector('[data-detail-variant-summary]').textContent = `${product.optionCount} · ${product.availabilitySummary}`;
    detail.querySelector('[data-detail-variants]').replaceChildren(...product.variants.map(variant => {
      const item = document.createElement('li');
      const value = document.createElement('strong');
      value.textContent = variant.capacity;
      item.append(value);
      if (variant.detail) {
        const dimensions = document.createElement('small');
        dimensions.textContent = variant.detail;
        item.append(dimensions);
      }
      if (variant.reference && variant.reference !== variant.capacity) {
        const reference = document.createElement('small');
        reference.className = 'detail-variant-reference';
        reference.textContent = variant.reference;
        item.append(reference);
      }
      return item;
    }));
    const variantNote = detail.querySelector('[data-detail-variant-note]');
    variantNote.textContent = product.variantNote || '';
    variantNote.hidden = !product.variantNote;

    const storeLink = detail.querySelector('.detail-store-link');
    storeLink.href = product.storeUrl;
    storeLink.querySelector('[data-detail-store-label]').textContent = product.storeLabel || 'Ver produto na loja virtual';
  }
  function updateInquiry(detail, product, lineName) {
    const subject = [product.name, product.subtitle].filter(Boolean).join(' — ');
    const inquiry = detail.querySelector('[data-product-inquiry]');
    const message = lineName
      ? `Olá! Gostaria de consultar o estoque de ${product.name} (${lineName}) e saber mais sobre as opções disponíveis.`
      : inquiry.dataset.productInquiry || `Olá! Gostaria de informações sobre ${subject} e as opções disponíveis.`;
    inquiry.href = `https://wa.me/5511947092039?text=${encodeURIComponent(message)}`;
  }
  function showRoute(focus = false) {
    const hash = new URLSearchParams(location.hash.slice(1));
    const product = products.find(p => p.id === hash.get('produto'));
    const lineName = catalogLineNames.get(product?.type);
    const selectedDetail = product && (lineName
      ? catalogLineDetail
      : details.find(detail => detail.dataset.productDetail === product.id));
    document.body.classList.toggle('viewing-product', Boolean(selectedDetail));
    listView.hidden = Boolean(selectedDetail);
    detailView.hidden = !selectedDetail;
    if (selectedDetail && lineName) renderCatalogLineDetail(selectedDetail, product, lineName);
    details.forEach(detail => { detail.hidden = detail !== selectedDetail; });
    if (selectedDetail) {
      updateInquiry(selectedDetail, product, lineName);
      currentId = product.id;
      document.title = lineName
        ? `${product.name} | ${lineName} | Plena-Lab`
        : `${product.name} ${product.subtitle} | Plena-Lab`;
      if (focus) {
        selectedDetail.querySelector('h1').focus({ preventScroll: true });
        detailView.scrollIntoView({ block: 'start', behavior: 'instant' });
      }
    } else {
      const previousId = currentId;
      currentId = null;
      document.title = 'Produtos e categorias para laboratório | Plena-Lab';
      if (focus && previousId) {
        const target = lastFocusedLink && !lastFocusedLink.closest('[hidden]') ? lastFocusedLink : search;
        target.focus({ preventScroll: true });
        if (listScroll !== null) window.scrollTo({ top: listScroll, behavior: 'instant' });
        else document.querySelector('.catalog-results-header').scrollIntoView({ block: 'start', behavior: 'instant' });
      }
    }
    lastSignature = location.search + location.hash;
  }
  search.addEventListener('input', () => filterProducts());
  function chooseCategory(category, focusResults = false) {
    activeType = category;
    search.value = '';
    types.forEach(item => item.setAttribute('aria-pressed', String(item.dataset.category === category)));
    filterProducts(false);
    updateSearchUrl(true);
    if (focusResults) {
      const heading = document.querySelector('.catalog-results-header h2');
      heading.tabIndex = -1;
      heading.focus({preventScroll:true});
      document.querySelector('.catalog-results-header').scrollIntoView({block:'start',behavior:'instant'});
    }
  }
  types.forEach(button => button.addEventListener('click', () => {
    if (activeType !== button.dataset.category) chooseCategory(button.dataset.category);
  }));
  document.querySelectorAll('[data-open-category]').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button > 0) return;
    event.preventDefault();
    chooseCategory(link.dataset.openCategory, true);
  }));
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
    types.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === 'todos')));
    filterProducts();
    search.focus();
  });
  document.querySelectorAll('a[href^="#produto="]').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button > 0) return;
    lastFocusedLink = link;
    const id = new URLSearchParams(link.hash.slice(1)).get('produto');
    const product = products.find(p => p.id === id);
    if (!product) return;
    event.preventDefault();
    listScroll = window.scrollY;
    const url = new URL(location.href);
    url.hash = `produto=${product.id}`;
    history.pushState(null, '', url);
    showRoute(true);
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
