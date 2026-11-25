/* Consulta local, sem envio de dados ou dependência de servidor. */
(() => {
  'use strict';
  const products = window.PLENA_PRODUCTS;
  const search = document.querySelector('#pesquisa-produtos');
  if (!Array.isArray(products) || !search) return;
  const productsById = new Map(products.map(product => [product.id, product]));
  const cards = [...document.querySelectorAll('[data-catalog-item]')].map(card => ({
    card,
    product: productsById.get(card.dataset.catalogItem)
  }));
  const categories = new Map([...document.querySelectorAll('[data-open-category]')].map(link => [
    link.dataset.openCategory,
    { link, name: link.querySelector('h3').textContent }
  ]));
  const groups = [...document.querySelectorAll('[data-category-group]')].map(section => ({
    section,
    type: section.dataset.categoryGroup,
    grid: section.querySelector('.catalog-items'),
    cards: [...section.querySelectorAll('[data-catalog-item]')],
    heading: section.querySelector('.catalog-group-heading')
  }));
  const listView = document.querySelector('[data-catalog-list-view]');
  const detailView = document.querySelector('[data-catalog-detail-view]');
  const details = [...document.querySelectorAll('[data-product-detail]')];
  const catalogLineDetail = document.querySelector('[data-catalog-line-detail]');
  const catalogLineNames = new Map(groups.filter(group => group.section.classList.contains('catalog-line')).map(group => [
    group.type,
    group.heading.querySelector('h2').textContent
  ]));
  const catalog = document.querySelector('#resultados-produtos');
  const resultsHeader = document.querySelector('.catalog-results-header');
  const resultsTitle = resultsHeader.querySelector('h2');
  const count = document.querySelector('[data-catalog-count]');
  const empty = document.querySelector('[data-catalog-empty]');
  const back = document.querySelector('[data-catalog-back]');
  const form = document.querySelector('.catalog-search-form');
  const searchLabel = form.querySelector('[data-search-label]');
  const clearSearch = form.querySelector('[data-search-clear]');
  const familyField = form.querySelector('[data-glass-family]');
  const familySelect = form.querySelector('#familia-vidrarias');
  const validFamilies = new Set([...familySelect.options].map(option => option.value));
  const classField = form.querySelector('[data-glass-class]');
  const classSelect = classField.querySelector('input');
  const capacityField = form.querySelector('[data-glass-capacity]');
  const capacitySelect = form.querySelector('#capacidade-vidrarias');
  const resetFamily = document.querySelector('[data-reset-family]');
  const classAProducts = new Set(products.filter(p => p.type === 'vidrarias' && /\bclasse A\b/i.test(p.name)));
  const classAFamilies = new Set([...classAProducts].map(p => p.family));
  const matchLabels = new Map();
  const clearFilters = document.querySelector('[data-clear-filters]');
  const allCategories = document.querySelector('[data-all-categories]');
  const allCategoriesLabel = allCategories.querySelector('span');
  const overview = document.querySelector('[data-category-overview]');
  const productGroups = document.querySelector('[data-product-groups]');
  const displayOptions = document.querySelector('[data-display-options]');
  const displayButtons = [...displayOptions.querySelectorAll('[data-display]')];
  const globalView = document.querySelector('[data-global-results-view]');
  const globalGrid = document.querySelector('[data-global-results]');
  let activeType = 'todos';
  let currentId = null;
  let lastFocusedLink = null;
  let lastSignature = '';
  let listScroll = null;
  let showingGlobalResults = false;
  let capacityContext = '';

  const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const compact = value => normalize(value).replace(/[^a-z0-9]/g, '');
  function searchIndex(product) {
    const references = [
      ...product.variants.map(option => option.reference),
      ...(product.features || []).filter(([label]) => /refer[eê]ncia|c[oó]digo/i.test(label)).map(([, value]) => value)
    ].filter(Boolean);
    const fields = [
      product.name, product.subtitle, product.description, product.sourceName,
      ...product.aliases, ...references,
      ...product.variants.flatMap(option => [option.capacity, option.detail])
    ].filter(Boolean);
    const compactFields = fields.map(compact);
    const dimensions = fields.filter(field => String(field).includes('×'));
    compactFields.push(...dimensions.map(field => compact(String(field).replaceAll('×', 'x'))));
    return { text: normalize(fields.join(' ')), compactFields, references: new Set(references.map(compact)) };
  }
  const indexes = new Map(products.map(product => [product.id, searchIndex(product)]));
  const normalizeMeasure = value => normalize(value).trim().replace(/\s+/g, '').replaceAll('×', 'x')
    .replace(/(\d)\.(?=\d{3}(?:\D|$))/g, '$1').replace(/(\d)\.(?=\d)/g, '$1,');
  function volumeKey(value) {
    const match = normalizeMeasure(String(value).trim().replace(/^0\./, '0,')).match(/^(\d+(?:,\d+)?)(ml|l)$/);
    if (!match) return '';
    const amount = Number(match[1].replace(',', '.'));
    return String(match[2] === 'l' ? amount * 1000 : amount) + 'ml';
  }
  const volumesByProduct = new Map(products.map(product => [
    product, new Map(product.variants.map(variant => [volumeKey(variant.capacity), variant.capacity]).filter(([key]) => key))
  ]));

  function updateCapacityFilter(family, onlyClassA, selection) {
    const context = family + ':' + onlyClassA;
    if (capacityContext !== context) {
      capacityContext = context;
      const volumes = new Map();
      if (family) {
        for (const product of products) {
          if (product.type !== 'vidrarias' || product.family !== family || (onlyClassA && !classAProducts.has(product))) continue;
          for (const [key, label] of volumesByProduct.get(product)) volumes.set(key, label);
        }
      }
      const options = [...volumes].sort(([a], [b]) => parseFloat(a) - parseFloat(b));
      capacitySelect.replaceChildren(new Option('Todas as capacidades', ''), ...options.map(([value, label]) => new Option(label, value)));
      capacityField.hidden = !options.length;
    }
    capacitySelect.value = selection;
    if (capacitySelect.selectedIndex === -1) capacitySelect.value = '';
  }

  function showVariantMatch(card, product, reference, measure, queryVolume, capacity) {
    const variants = product.variants;
    const matchesCapacity = variant => !capacity || volumeKey(variant.capacity) === capacity;
    let match = reference && variants.find(variant => matchesCapacity(variant) && variant.reference && compact(variant.reference) === reference);
    if (!match && (measure || capacity)) {
      match = variants.find(variant => matchesCapacity(variant) &&
        (capacity || normalizeMeasure(variant.capacity) === measure || (queryVolume && volumeKey(variant.capacity) === queryVolume)));
    }
    const link = card.querySelector('.catalog-detail-link');
    let label = matchLabels.get(card);
    if (match && !label) {
      label = document.createElement('p');
      label.className = 'catalog-item-match';
      label.dataset.matchVariant = '';
      link.before(label);
      matchLabels.set(card, label);
    }
    if (label) {
      label.hidden = !match;
      if (match) label.textContent = [match.capacity, match.reference === match.capacity ? '' : match.reference].filter(Boolean).join(' · ');
    }
    if (catalogLineNames.has(product.type)) {
      const hash = new URLSearchParams({ produto: product.id });
      if (match) hash.set('variacao', variants.indexOf(match));
      const href = '#' + hash.toString();
      if (link.getAttribute('href') !== href) link.setAttribute('href', href);
    }
  }

  function updateSearchUrl(push = false) {
    const url = new URL(location.href);
    const query = search.value.trim();
    if (query) url.searchParams.set('q', query); else url.searchParams.delete('q');
    if (activeType !== 'todos') url.searchParams.set('tipo', activeType); else url.searchParams.delete('tipo');
    if (activeType === 'vidrarias' && familySelect.value) url.searchParams.set('familia', familySelect.value);
    else url.searchParams.delete('familia');
    if (activeType === 'vidrarias' && classSelect.checked) url.searchParams.set('classe', 'A');
    else url.searchParams.delete('classe');
    if (activeType === 'vidrarias' && capacitySelect.value) url.searchParams.set('capacidade', capacitySelect.value);
    else url.searchParams.delete('capacidade');
    if (push) url.hash = 'resultados-produtos';
    history[push ? 'pushState' : 'replaceState'](null, '', url);
    lastSignature = location.search + location.hash;
  }

  function filterProducts(syncUrl = true, selectedCapacity = capacitySelect.value) {
    const query = search.value.trim();
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    const compactTerm = compact(query);
    const global = activeType === 'todos';
    const family = activeType === 'vidrarias' ? familySelect.value : '';
    const classAvailable = activeType === 'vidrarias' && (family ? classAFamilies.has(family) : classAFamilies.size > 0);
    classField.hidden = !classAvailable;
    if (!classAvailable) classSelect.checked = false;
    const onlyClassA = classSelect.checked;
    updateCapacityFilter(family, onlyClassA, selectedCapacity);
    const capacity = capacitySelect.value;
    const measure = normalizeMeasure(query);
    const queryVolume = volumeKey(query);
    const isOverview = global && !query;
    const isGlobalSearch = global && Boolean(query);
    const visibleTypes = new Set();
    const exactMatches = [];
    const otherMatches = [];
    let visible = 0;

    if (showingGlobalResults && !isGlobalSearch) {
      groups.forEach(group => group.grid.replaceChildren(...group.cards));
      globalGrid.replaceChildren();
    }

    for (const { card, product } of cards) {
      const index = indexes.get(product.id);
      const volumes = volumesByProduct.get(product);
      const exactReference = index.references.has(compactTerm);
      const textMatch = !query || terms.every(term => index.text.includes(term)) ||
        (queryVolume && volumes.has(queryVolume)) ||
        (compactTerm && index.compactFields.some(field => field.includes(compactTerm)));
      const exactVariant = capacity && exactReference &&
        product.variants.find(variant => variant.reference && compact(variant.reference) === compactTerm);
      const matchesCapacity = !capacity || volumes.has(capacity) &&
        (!queryVolume || queryVolume === capacity) && (!exactVariant || volumeKey(exactVariant.capacity) === capacity);
      const matchesFilters = (global || activeType === product.type) && (!family || product.family === family) &&
        (!onlyClassA || classAProducts.has(product)) && matchesCapacity;
      const show = matchesFilters && Boolean(textMatch);
      if (show && (query || capacity || matchLabels.has(card))) {
        showVariantMatch(card, product, compactTerm, measure, queryVolume, capacity);
      }
      const hidden = !show;
      if (card.hidden !== hidden) card.hidden = hidden;
      if (!show) continue;
      visible++;
      visibleTypes.add(product.type);
      if (isGlobalSearch) {
        (exactReference ? exactMatches : otherMatches).push(card);
      }
    }

    if (isGlobalSearch) globalGrid.replaceChildren(...exactMatches, ...otherMatches);
    showingGlobalResults = isGlobalSearch;
    groups.forEach(group => {
      group.section.hidden = global || !visibleTypes.has(group.type);
      group.heading.hidden = true;
    });

    overview.hidden = !isOverview;
    productGroups.hidden = isOverview || !visible;
    displayOptions.hidden = productGroups.hidden;
    globalView.hidden = !isGlobalSearch;
    empty.hidden = isOverview || visible !== 0;
    allCategories.hidden = global;
    clearSearch.hidden = !query;
    familyField.hidden = activeType !== 'vidrarias';
    clearFilters.textContent = family || onlyClassA || capacity ? 'Limpar busca e filtros' : 'Limpar busca';
    resetFamily.hidden = !family;

    const categoryName = catalogLineNames.get(activeType) || categories.get(activeType)?.name;
    searchLabel.textContent = categoryName ? 'Buscar em ' + categoryName : 'Buscar produtos';
    resultsTitle.textContent = isOverview ? 'Todas as categorias' : isGlobalSearch ? 'Resultados da busca' :
      family ? familySelect.selectedOptions[0].textContent : categoryName;
    resultsHeader.classList.toggle('catalog-line-results', !isOverview);
    count.textContent = isOverview ? categories.size + ' categorias' : visible + (visible === 1 ? ' item' : ' itens');

    if (!global) {
      allCategoriesLabel.textContent = query ? 'Buscar em todas as categorias' : 'Voltar para todas as categorias';
      const url = new URL(location.href);
      url.searchParams.delete('tipo');
      url.searchParams.delete('familia');
      url.searchParams.delete('classe');
      url.searchParams.delete('capacidade');
      if (query) url.searchParams.set('q', query); else url.searchParams.delete('q');
      url.hash = 'resultados-produtos';
      allCategories.href = url.href;
    }
    if (syncUrl) updateSearchUrl();
  }

  function readSearchUrl() {
    const query = new URLSearchParams(location.search);
    search.value = query.get('q') || '';
    const type = query.get('tipo');
    activeType = categories.has(type) ? type : 'todos';
    const family = query.get('familia');
    familySelect.value = activeType === 'vidrarias' && validFamilies.has(family) ? family : '';
    classSelect.checked = activeType === 'vidrarias' && query.get('classe') === 'A';
    filterProducts(false, query.get('capacidade') || '');
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
    const facts = detail.querySelector('.detail-facts');
    facts.hidden = product.features.length === 0;
    facts.replaceChildren(...product.features.map(([label, value]) => {
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
    detail.querySelector('[data-detail-variant-summary]').textContent = [product.optionCount, product.availabilitySummary].filter(Boolean).join(' · ');
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
    storeLink.hidden = !product.storeUrl;
    if (product.storeUrl) storeLink.href = product.storeUrl;
    else storeLink.removeAttribute('href');
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
    const id = hash.get('produto');
    const product = productsById.get(id) || products.find(p => p.previousIds?.includes(id));
    const lineName = catalogLineNames.get(product?.type);
    const selectedDetail = product && (lineName
      ? catalogLineDetail
      : details.find(detail => detail.dataset.productDetail === product.id));
    document.body.classList.toggle('viewing-product', Boolean(selectedDetail));
    listView.hidden = Boolean(selectedDetail);
    detailView.hidden = !selectedDetail;
    let matchedVariant;
    if (selectedDetail && lineName) {
      renderCatalogLineDetail(selectedDetail, product, lineName);
      const variants = selectedDetail.querySelector('[data-detail-variants]');
      const previousMatch = variants.querySelector('[aria-current]');
      previousMatch?.removeAttribute('aria-current');
      previousMatch?.removeAttribute('tabindex');
      const position = hash.get('variacao');
      if (position !== null && /^\d+$/.test(position)) matchedVariant = variants.children[Number(position)];
      if (matchedVariant) {
        matchedVariant.setAttribute('aria-current', 'true');
        matchedVariant.tabIndex = -1;
        variants.closest('details').open = true;
      }
    }
    details.forEach(detail => { detail.hidden = detail !== selectedDetail; });
    if (selectedDetail) {
      updateInquiry(selectedDetail, product, lineName);
      currentId = product.id;
      document.title = lineName
        ? `${product.name} | ${lineName} | Plena-Lab`
        : `${product.name} ${product.subtitle} | Plena-Lab`;
      if (matchedVariant) {
        if (focus) matchedVariant.focus({ preventScroll: true });
        matchedVariant.scrollIntoView({ block: 'center', behavior: 'instant' });
      } else if (focus) {
        selectedDetail.querySelector('h1').focus({ preventScroll: true });
        detailView.scrollIntoView({ block: 'start', behavior: 'instant' });
      }
    } else {
      const previousId = currentId;
      currentId = null;
      document.title = 'Produtos e categorias para laboratório | Plena-Lab';
      if (focus && previousId) {
        const target = lastFocusedLink?.isConnected && !lastFocusedLink.closest('[hidden]') ? lastFocusedLink : search;
        target.focus({ preventScroll: true });
        if (listScroll !== null) window.scrollTo({ top: listScroll, behavior: 'instant' });
        else document.querySelector('.catalog-results-header').scrollIntoView({ block: 'start', behavior: 'instant' });
      }
    }
    lastSignature = location.search + location.hash;
  }
  function focusCatalog() {
    resultsTitle.focus({ preventScroll: true });
    catalog.scrollIntoView({ block: 'start', behavior: 'instant' });
  }

  function chooseCategory(category) {
    if (activeType !== category) {
      familySelect.value = '';
      classSelect.checked = false;
    }
    activeType = category;
    filterProducts(false);
    updateSearchUrl(true);
    focusCatalog();
  }

  function isPrimary(event) {
    return !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0;
  }

  search.addEventListener('input', () => filterProducts());
  displayButtons.forEach(button => button.addEventListener('click', () => {
    productGroups.dataset.catalogLayout = button.dataset.display;
    displayButtons.forEach(option => option.setAttribute('aria-pressed', String(option === button)));
  }));
  categories.forEach(({link}, category) => link.addEventListener('click', event => {
    if (!isPrimary(event)) return;
    event.preventDefault();
    chooseCategory(category);
  }));
  allCategories.addEventListener('click', event => {
    if (!isPrimary(event)) return;
    event.preventDefault();
    chooseCategory('todos');
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    filterProducts();
    resultsTitle.focus({ preventScroll: true });
    resultsHeader.scrollIntoView({ block: 'start', behavior: 'instant' });
  });
  function resetSearch() {
    search.value = '';
    filterProducts();
    search.focus();
  }
  clearSearch.addEventListener('click', resetSearch);
  clearFilters.addEventListener('click', () => {
    familySelect.value = '';
    classSelect.checked = false;
    resetSearch();
  });
  function applyGlassFilters() {
    filterProducts(false);
    updateSearchUrl(true);
  }
  familySelect.addEventListener('change', () => {
    capacitySelect.value = '';
    applyGlassFilters();
  });
  classSelect.addEventListener('change', applyGlassFilters);
  capacitySelect.addEventListener('change', applyGlassFilters);
  resetFamily.addEventListener('click', () => {
    familySelect.value = '';
    applyGlassFilters();
    familySelect.focus();
  });
  document.querySelectorAll('a[href^="#produto="]').forEach(link => link.addEventListener('click', event => {
    if (!isPrimary(event)) return;
    lastFocusedLink = link;
    const id = new URLSearchParams(link.hash.slice(1)).get('produto');
    const product = productsById.get(id);
    if (!product) return;
    event.preventDefault();
    listScroll = window.scrollY;
    const url = new URL(location.href);
    url.hash = link.hash;
    history.pushState(null, '', url);
    showRoute(true);
  }));
  back.addEventListener('click', () => {
    const url = new URL(location.href);
    url.hash = 'resultados-produtos';
    history.pushState(null, '', url);
    showRoute(true);
  });
  function onNavigation() {
    if (lastSignature === location.search + location.hash) return;
    const previousType = activeType;
    const wasDetail = Boolean(currentId);
    readSearchUrl();
    showRoute(true);
    if (!wasDetail && !currentId && previousType !== activeType) {
      if (activeType === 'todos' && !search.value.trim() && categories.has(previousType)) {
        categories.get(previousType).link.focus({ preventScroll: true });
      } else focusCatalog();
    }
  }
  addEventListener('hashchange', onNavigation);
  addEventListener('popstate', onNavigation);
  readSearchUrl();
  document.body.classList.add('catalog-enhanced');
  showRoute(false);
})();
