const Components = (() => {
  // ── Filter pills ──────────────────────────────────────────────────────────

  function categoryPills(cats, activeId, onClickFn) {
    return cats
      .map(
        (c) => `
      <button class="pill ${c.id === activeId ? "active" : ""}"
        onclick="${onClickFn}('${c.id}', this)">${c.label}</button>
    `,
      )
      .join("");
  }

  function brandPills(brnds, activeId, onClickFn) {
    return brnds
      .map(
        (b) => `
      <button class="pill brand-pill brand-pill--${b.id} ${b.id === activeId ? "active" : ""}"
        onclick="${onClickFn}('${b.id}', this)">${b.label}</button>
    `,
      )
      .join("");
  }

  function sortOptions(activeId) {
    return SORT_OPTIONS.map(
      (s) => `
      <option value="${s.id}" ${s.id === activeId ? "selected" : ""}>${s.label}</option>
    `,
    ).join("");
  }

  // ── Product card ──────────────────────────────────────────────────────────

  function productCard(product) {
    const brand = ProductService.getBrandMeta(product);
    const showBrand = brand.color && product.brand !== "lainnya";
    const isWish = WishlistService.has(product.id);
    const shortDesc =
      product.desc.length > 62
        ? product.desc.substring(0, 62) + "…"
        : product.desc;

    return `
      <div class="product-card fade-in-up" onclick="ProductModalView.open(${product.id})">
        ${product.badge ? `<div class="product-card__badge">${product.badge}</div>` : ""}
        <div class="product-card__wish-btn" onclick="event.stopPropagation()">
          ${_wishBtn(product.id, isWish)}
        </div>
        <div class="product-card__img ${product.type === "beauty" ? "product-card__img--beauty" : ""}">
          ${product.emoji}
        </div>
        <div class="product-card__body">
          ${
            showBrand
              ? `<span class="product-card__brand"
            style="color:${brand.color};background:${brand.color}18">${brand.label}</span>`
              : ""
          }
          <h3 class="product-card__name">${product.name}</h3>
          <p class="product-card__desc">${shortDesc}</p>
          <p class="product-card__price">${formatRp(product.price)}</p>
          <button class="btn-add-cart"
            onclick="event.stopPropagation(); ProductModalView.open(${product.id})">
            Lihat Detail
          </button>
        </div>
      </div>`;
  }

  // ── Product modal ─────────────────────────────────────────────────────────

  function productModalBody(product, sizes, colors) {
    const brand = ProductService.getBrandMeta(product);
    const showBrand = brand.color && product.brand !== "lainnya";
    const isWish = WishlistService.has(product.id);
    const outOfStock = product.stock === 0;

    const colorBtns = colors
      .map(
        (c, i) => `
      <button class="option-btn ${i === 0 ? "active" : ""}"
        onclick="ProductModalView.selectOption(this,'color')"
        data-value="${c}">${c}</button>`,
      )
      .join("");

    const sizeBtns = sizes
      .map(
        (s, i) => `
      <button class="option-btn ${i === 0 ? "active" : ""}"
        onclick="ProductModalView.selectOption(this,'size')"
        data-value="${s}">${s}</button>`,
      )
      .join("");

    return `
      <div class="pmodal__close-btn">
        <span class="pmodal__close-title">${product.name}</span>
        <button class="pmodal__close" onclick="ProductModalView.close()">✕</button>
      </div>
      <div class="pmodal__img ${product.type === "beauty" ? "pmodal__img--beauty" : ""}">${product.emoji}</div>
      <div class="pmodal__body">
        <div class="pmodal__meta">
          ${product.badge ? `<span class="product-card__badge" style="position:static;display:inline-block;margin-right:6px">${product.badge}</span>` : ""}
          ${showBrand ? `<span class="product-card__brand" style="color:${brand.color};background:${brand.color}18">${brand.label}</span>` : ""}
        </div>
        <h2 class="pmodal__name">${product.name}</h2>
        <p class="pmodal__price">${formatRp(product.price)}</p>
        ${_stockBadge(product.stock)}
        <p class="pmodal__desc">${product.desc}</p>
        <div class="pmodal__section">
          <p class="pmodal__section-label">Pilih Warna</p>
          <div class="option-group" id="color-group">${colorBtns}</div>
        </div>
        <div class="pmodal__section">
          <p class="pmodal__section-label">Pilih Ukuran</p>
          <div class="option-group" id="size-group">${sizeBtns}</div>
        </div>
        <div class="pmodal__actions">
          <button class="btn-primary pmodal__btn-cart"
            ${outOfStock ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ""}
            onclick="ProductModalView.addToCart(${product.id})">
            ${outOfStock ? "❌ Stok Habis" : "🛒 Tambah ke Keranjang"}
          </button>
          ${_wishBtnLabel(product.id, isWish)}
        </div>
      </div>`;
  }

  // ── Cart ──────────────────────────────────────────────────────────────────

  function cartEmpty() {
    return `<div class="cart-empty">
      <div class="cart-empty__icon">🛒</div>
      <p class="cart-empty__text">Keranjang masih kosong</p>
      <p class="cart-empty__sub">Tambahkan produk favoritmu!</p>
    </div>`;
  }

  function cartActions(totalCount, selectedCount) {
    if (totalCount === 0) return "";
    const allSelected = selectedCount === totalCount;
    return `
      <div class="cart-actions">
        <label class="cart-actions__select-all">
          <input type="checkbox" id="cart-select-all" ${allSelected ? "checked" : ""}
            onchange="CartView.toggleSelectAll(this.checked)" />
          <span>Pilih Semua (${totalCount})</span>
        </label>
        <div class="cart-actions__right">
          ${
            selectedCount > 0
              ? `
            <span class="cart-actions__selected-info">${selectedCount} dipilih</span>
            <button class="cart-actions__delete-btn"
              onclick="CartView.deleteSelected()">🗑️ Hapus (${selectedCount})</button>
          `
              : ""
          }
        </div>
      </div>`;
  }

  function cartItem(item, isSelected) {
    const variant = [item.color, item.size].filter(Boolean).join(" · ");
    return `
      <div class="cart-item ${isSelected ? "cart-item--selected" : ""}" data-key="${item.key}">
        <label class="cart-item__checkbox-wrap">
          <input type="checkbox" class="cart-checkbox" data-key="${item.key}"
            ${isSelected ? "checked" : ""} onchange="CartView.toggleSelect('${item.key}',this.checked)" />
        </label>
        <div class="cart-item__img">${item.emoji}</div>
        <div class="cart-item__info">
          <p class="cart-item__name">${item.name}</p>
          ${variant ? `<p class="cart-item__variant">${variant}</p>` : ""}
          <p class="cart-item__price">${formatRp(item.price)}</p>
          <div class="qty-controls">
            <button class="qty-btn" onclick="CartView.changeQty('${item.key}',-1)">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" onclick="CartView.changeQty('${item.key}',1)">+</button>
          </div>
        </div>
        <div class="cart-item__controls">
          <button class="cart-item__remove" onclick="CartView.removeItem('${item.key}')">✕</button>
          <span class="cart-item__subtotal">${formatRp(item.price * item.qty)}</span>
        </div>
      </div>`;
  }

  // ── Order / success ───────────────────────────────────────────────────────

  function orderSummary(items, total) {
    return (
      items
        .map((i) => {
          const v = [i.color, i.size].filter(Boolean).join(", ");
          return `<div class="order-summary-item">
        <span>${i.emoji} ${i.name}${v ? ` (${v})` : ""} ×${i.qty}</span>
        <span>${formatRp(i.price * i.qty)}</span>
      </div>`;
        })
        .join("") +
      `<div class="order-summary__total"><span>Total</span><span>${formatRp(total)}</span></div>`
    );
  }

  function orderSuccess(order) {
    return `
      <div class="order-success">
        <div class="order-success__icon">🎉</div>
        <h2 class="order-success__title">Pesanan Terkirim!</h2>
        <p class="order-success__sub">Terima kasih <strong>${order.customerName}</strong>!<br/>
          Pesananmu sudah kami terima dan akan segera diproses.</p>
        <div class="order-success__summary">
          ${order.items
            .map((i) => {
              const v = [i.color, i.size].filter(Boolean).join(", ");
              return `<div class="order-success__item">
              <span>${i.emoji} ${i.name}${v ? ` (${v})` : ""} ×${i.qty}</span>
              <span>${formatRp(i.price * i.qty)}</span>
            </div>`;
            })
            .join("")}
          <div class="order-success__total">
            <span>Total</span><span>${formatRp(order.total)}</span>
          </div>
        </div>
        <p class="order-success__note">📲 Detail pesanan sudah dikirim via WhatsApp ke
          <strong>${order.customerPhone}</strong></p>
        <button class="btn-primary" style="margin-top:20px;width:100%"
          onclick="SuccessView.close()">Lanjut Belanja</button>
      </div>`;
  }

  // ── Wishlist ──────────────────────────────────────────────────────────────

  function wishlistEmpty() {
    return `<div class="cart-empty">
      <div class="cart-empty__icon">🤍</div>
      <p class="cart-empty__text">Wishlist masih kosong</p>
      <p class="cart-empty__sub">Tap ❤️ pada produk untuk menyimpannya!</p>
    </div>`;
  }

  function wishlistItem(product) {
    return `
      <div class="wishlist-item">
        <div class="wishlist-item__img">${product.emoji}</div>
        <div class="wishlist-item__info">
          <p class="wishlist-item__name">${product.name}</p>
          <p class="wishlist-item__price">${formatRp(product.price)}</p>
          <div class="wishlist-item__actions">
            <button class="btn-add-cart" style="font-size:.78rem;padding:7px 12px"
              onclick="WishlistView.moveToCart(${product.id})">+ Keranjang</button>
            <button class="wishlist-item__remove"
              onclick="WishlistView.remove(${product.id})">✕</button>
          </div>
        </div>
      </div>`;
  }

  // ── Skeleton ──────────────────────────────────────────────────────────────

  function skeletonGrid(count = 8) {
    return Array.from(
      { length: count },
      () => `
      <div class="skeleton-card">
        <div class="skeleton skeleton--img"></div>
        <div class="skeleton-card__body">
          <div class="skeleton skeleton--badge"></div>
          <div class="skeleton skeleton--title"></div>
          <div class="skeleton skeleton--desc"></div>
          <div class="skeleton skeleton--price"></div>
          <div class="skeleton skeleton--btn"></div>
        </div>
      </div>`,
    ).join("");
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  function _stockBadge(stock) {
    if (stock === 0)
      return `<div class="stock-badge stock-badge--empty">❌ Stok Habis</div>`;
    if (stock <= 5)
      return `<div class="stock-badge stock-badge--low">⚠️ Sisa ${stock} item</div>`;
    return `<div class="stock-badge stock-badge--ok">✅ Stok: ${stock} item</div>`;
  }

  function _wishBtn(id, isWish) {
    return `
      <button
        class="btn-wishlist-circle ${isWish ? "btn-wishlist-circle--active" : ""}"
        onclick="WishlistView.toggle(${id})"
        aria-label="${isWish ? "Hapus dari wishlist" : "Tambah ke wishlist"}">
        ${isWish ? "❤️" : "🤍"}
      </button>`;
  }

  function _wishBtnLabel(id, isWish) {
    return `
      <button
        class="btn-wishlist-pill ${isWish ? "btn-wishlist-pill--active" : ""}"
        onclick="WishlistView.toggle(${id})">
        ${isWish ? "❤️" : "🤍"}
        <span>${isWish ? "Tersimpan" : "Wishlist"}</span>
      </button>`;
  }

  // ── Price Range Slider ────────────────────────────────────────────────────

  function priceRangeSlider(priceMin, priceMax) {
    const min = PRICE_RANGE.min;
    const max = PRICE_RANGE.max;
    const pct1 = ((priceMin - min) / (max - min)) * 100;
    const pct2 = ((priceMax - min) / (max - min)) * 100;

    return `
      <div class="price-filter">
        <div class="price-filter__header">
          <span class="price-filter__label">💰 Rentang Harga</span>
          <div class="price-filter__values">
            <span class="price-filter__val" id="price-min-label">${formatRp(priceMin)}</span>
            <span class="price-filter__sep">—</span>
            <span class="price-filter__val" id="price-max-label">${formatRp(priceMax)}</span>
          </div>
        </div>
        <div class="price-slider-wrap">
          <div class="price-slider-track">
            <div class="price-slider-fill" id="price-slider-fill"
              style="left:${pct1}%;right:${100 - pct2}%"></div>
          </div>
          <input type="range" class="price-range-input price-range-input--min"
            id="price-range-min" min="${min}" max="${max}" step="${PRICE_RANGE.step}"
            value="${priceMin}" oninput="FilterView.setPriceMin(this.value)" />
          <input type="range" class="price-range-input price-range-input--max"
            id="price-range-max" min="${min}" max="${max}" step="${PRICE_RANGE.step}"
            value="${priceMax}" oninput="FilterView.setPriceMax(this.value)" />
        </div>
        <div class="price-filter__presets">
          <button class="price-preset" onclick="FilterView.setPricePreset(0,100000)">< 100rb</button>
          <button class="price-preset" onclick="FilterView.setPricePreset(100000,200000)">100–200rb</button>
          <button class="price-preset" onclick="FilterView.setPricePreset(200000,350000)">> 200rb</button>
        </div>
      </div>`;
  }

  // ── Active Filter Tags ────────────────────────────────────────────────────

  function activeFilterTags(filter) {
    const tags = [];
    const catLabel = [...FASHION_CATEGORIES, ...BEAUTY_CATEGORIES].find(
      (c) => c.id === filter.category && c.id !== "semua",
    )?.label;
    const brandLabel = BRANDS.find(
      (b) => b.id === filter.brand && b.id !== "semua",
    )?.label;
    const isPriceFiltered =
      filter.priceMin > PRICE_RANGE.min || filter.priceMax < PRICE_RANGE.max;

    if (catLabel)
      tags.push(
        `<span class="active-tag">${catLabel} <button onclick="FilterView.setCategory('semua',null)">✕</button></span>`,
      );
    if (brandLabel)
      tags.push(
        `<span class="active-tag">${brandLabel} <button onclick="FilterView.setBrand('semua',null)">✕</button></span>`,
      );
    if (isPriceFiltered)
      tags.push(
        `<span class="active-tag">${formatRp(filter.priceMin)}–${formatRp(filter.priceMax)} <button onclick="FilterView.resetPrice()">✕</button></span>`,
      );
    if (filter.query)
      tags.push(
        `<span class="active-tag">🔍 "${filter.query}" <button onclick="FilterView.setQuery('')">✕</button></span>`,
      );

    return tags.join("");
  }

  // ── View Toggle ───────────────────────────────────────────────────────────

  function viewToggle(activeView) {
    return `
      <div class="view-toggle">
        <button class="view-btn ${activeView === "grid" ? "active" : ""}"
          onclick="FilterView.setView('grid')" title="Tampilan Grid" aria-label="Grid view">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <rect x="0" y="0" width="6" height="6" rx="1.5" fill="currentColor"/>
            <rect x="8" y="0" width="6" height="6" rx="1.5" fill="currentColor"/>
            <rect x="0" y="8" width="6" height="6" rx="1.5" fill="currentColor"/>
            <rect x="8" y="8" width="6" height="6" rx="1.5" fill="currentColor"/>
          </svg>
        </button>
        <button class="view-btn ${activeView === "list" ? "active" : ""}"
          onclick="FilterView.setView('list')" title="Tampilan List" aria-label="List view">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <rect x="0" y="1"   width="14" height="2.5" rx="1.25" fill="currentColor"/>
            <rect x="0" y="5.5" width="14" height="2.5" rx="1.25" fill="currentColor"/>
            <rect x="0" y="10"  width="14" height="2.5" rx="1.25" fill="currentColor"/>
          </svg>
        </button>
      </div>`;
  }

  // ── Product List Item (for list view) ────────────────────────────────────

  function productListItem(product) {
    const brand = ProductService.getBrandMeta(product);
    const showBrand = brand.color && product.brand !== "lainnya";
    const isWish = WishlistService.has(product.id);

    const stockEl =
      product.stock === 0
        ? `<span class="list-stock list-stock--empty">❌ Habis</span>`
        : product.stock <= 5
          ? `<span class="list-stock list-stock--low">⚠️ Sisa ${product.stock}</span>`
          : `<span class="list-stock list-stock--ok">✅ Stok ${product.stock}</span>`;

    return `
      <div class="product-list-item fade-in-up" onclick="ProductModalView.open(${product.id})">
        <div class="product-list-item__img ${product.type === "beauty" ? "product-card__img--beauty" : ""}">
          ${product.emoji}
        </div>
        <div class="product-list-item__body">
          <div class="product-list-item__meta">
            ${showBrand ? `<span class="product-card__brand" style="color:${brand.color};background:${brand.color}18">${brand.label}</span>` : ""}
            ${product.badge ? `<span class="product-card__badge" style="position:static;display:inline-block">${product.badge}</span>` : ""}
            ${stockEl}
          </div>
          <h3 class="product-list-item__name">${product.name}</h3>
          <p class="product-list-item__desc">${product.desc}</p>
          <p class="product-list-item__price">${formatRp(product.price)}</p>
        </div>
        <div class="product-list-item__actions" onclick="event.stopPropagation()">
          <button class="btn-primary" style="font-size:.8rem;padding:9px 14px;border-radius:var(--r-md)"
            onclick="ProductModalView.open(${product.id})">
            🛒 Keranjang
          </button>
          <button class="btn-wishlist-pill ${isWish ? "btn-wishlist-pill--active" : ""}"
            style="padding:8px 14px;font-size:.8rem"
            onclick="WishlistView.toggle(${product.id})">
            ${isWish ? "❤️" : "🤍"}
          </button>
        </div>
      </div>`;
  }
  return Object.freeze({
    categoryPills,
    brandPills,
    sortOptions,
    productCard,
    productModalBody,
    cartEmpty,
    cartActions,
    cartItem,
    orderSummary,
    orderSuccess,
    wishlistEmpty,
    wishlistItem,
    skeletonGrid,
    priceRangeSlider,
    activeFilterTags,
    viewToggle,
    productListItem, // ← tambah
  });
})();
