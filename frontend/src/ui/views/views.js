// ── FilterView ────────────────────────────────────────────────────────────────

const FilterView = (() => {
  let _filter = createFilterState();

  function render(cats, brnds) {
    const c =
      cats ||
      (_filter.type === "beauty" ? BEAUTY_CATEGORIES : FASHION_CATEGORIES);
    const b =
      brnds || (_filter.type === "beauty" ? BEAUTY_BRANDS : FASHION_BRANDS);
    UIUtils.setHtml(
      "category-pills",
      Components.categoryPills(c, _filter.category, "FilterView.setCategory"),
    );
    UIUtils.setHtml(
      "brand-pills",
      Components.brandPills(b, _filter.brand, "FilterView.setBrand"),
    );
    const sel = document.getElementById("sort-select");
    if (sel) sel.innerHTML = Components.sortOptions(_filter.sort);
    _renderLabel();
    ProductGridView.render(_filter);
  }

  function _renderLabel() {
    const catLabel =
      [...FASHION_CATEGORIES, ...BEAUTY_CATEGORIES].find(
        (c) => c.id === _filter.category,
      )?.label ?? "Semua";
    const brandLabel =
      BRANDS.find((b) => b.id === _filter.brand)?.label ?? "Semua Brand";
    let text = "Semua produk";
    if (_filter.category !== "semua" && _filter.brand !== "semua")
      text = `${brandLabel} · ${catLabel}`;
    else if (_filter.brand !== "semua") text = `Brand: ${brandLabel}`;
    else if (_filter.category !== "semua") text = `Kategori: ${catLabel}`;
    UIUtils.setText("active-filter-label", text);
  }

  function setCategory(id, el) {
    _filter.category = id;
    document
      .querySelectorAll("#category-pills .pill")
      .forEach((p) => p.classList.remove("active"));
    el?.classList.add("active");
    _renderLabel();
    ProductGridView.render(_filter);
  }

  function setBrand(id, el) {
    _filter.brand = id;
    document
      .querySelectorAll("#brand-pills .pill")
      .forEach((p) => p.classList.remove("active"));
    el?.classList.add("active");
    _renderLabel();
    ProductGridView.render(_filter);
  }

  function setSort(val) {
    _filter.sort = val;
    ProductGridView.render(_filter);
  }
  function setQuery(q) {
    _filter.query = q;
    ProductGridView.render(_filter);
  }
  function setType(type) {
    _filter.type = type;
  }

  function reset() {
    const currentType = _filter.type; // simpan type sebelum reset
    _filter = createFilterState();
    _filter.type = currentType; // kembalikan type setelah reset

    const sb = document.getElementById("search-box");
    if (sb) sb.value = "";
    const sel = document.getElementById("sort-select");
    if (sel) sel.value = "default";
  }

  function getCurrentFilter() {
    return { ..._filter };
  }

  return Object.freeze({
    render,
    setCategory,
    setBrand,
    setSort,
    setQuery,
    setType,
    reset,
    getCurrentFilter,
  });
})();

// ── ProductGridView ───────────────────────────────────────────────────────────

const ProductGridView = (() => {
  function render(filter) {
    const filtered = ProductService.getFiltered(filter);
    const grid = document.getElementById("product-grid");
    const empty = document.getElementById("empty-state");
    const count = document.getElementById("result-count");
    if (count) count.textContent = `${filtered.length} produk`;
    if (filtered.length === 0) {
      if (grid) grid.innerHTML = "";
      empty?.classList.remove("hidden");
    } else {
      empty?.classList.add("hidden");
      if (grid) grid.innerHTML = filtered.map(Components.productCard).join("");
    }
  }
  return Object.freeze({ render });
})();

// ── ProductModalView ──────────────────────────────────────────────────────────

const ProductModalView = (() => {
  const ID = "product-modal";

  function open(productId) {
    const p = ProductService.getById(productId);
    if (!p) return;
    const sizes = ProductService.getSizesForProduct(p);
    const colors = ProductService.getColorsForProduct(p);
    UIUtils.setHtml(
      "product-modal-content",
      Components.productModalBody(p, sizes, colors),
    );
    UIUtils.openModal(ID);
  }

  function close() {
    UIUtils.closeModal(ID);
  }

  function selectOption(el, group) {
    const gId = group === "color" ? "color-group" : "size-group";
    document
      .querySelectorAll(`#${gId} .option-btn`)
      .forEach((b) => b.classList.remove("active"));
    el.classList.add("active");
  }

  function addToCart(productId) {
    const p = ProductService.getById(productId);
    if (!p) return;
    const color =
      document.querySelector("#color-group .option-btn.active")?.dataset
        .value ?? "";
    const size =
      document.querySelector("#size-group  .option-btn.active")?.dataset
        .value ?? "";
    CartService.addItem(p, color, size);
    UIUtils.showToast(`${p.emoji} ${p.name} ditambahkan!`);
    close();
  }

  return Object.freeze({ open, close, selectOption, addToCart });
})();

// ── CartView ──────────────────────────────────────────────────────────────────

const CartView = (() => {
  let _selected = new Set();

  function render({ items, count, total }) {
    _selected = new Set(
      [..._selected].filter((k) => items.some((i) => i.key === k)),
    );

    // Badges
    _setBadge("cart-count", count);
    _setBadge("bottom-cart-count", count);

    UIUtils.toggleHidden("cart-footer", count === 0);
    UIUtils.setText("cart-total", UIUtils.formatRp(total));

    if (count === 0) {
      UIUtils.setHtml("cart-actions-bar", "");
      UIUtils.setHtml("cart-items-list", Components.cartEmpty());
    } else {
      UIUtils.setHtml(
        "cart-actions-bar",
        Components.cartActions(count, _selected.size),
      );
      UIUtils.setHtml(
        "cart-items-list",
        items.map((i) => Components.cartItem(i, _selected.has(i.key))).join(""),
      );
    }
  }

  function _setBadge(id, count) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = count;
    el.classList.toggle("hidden", count === 0);
  }

  function open() {
    document.getElementById("cart-sidebar")?.classList.add("open");
    document.getElementById("cart-overlay")?.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    document.getElementById("cart-sidebar")?.classList.remove("open");
    document.getElementById("cart-overlay")?.classList.remove("open");
    document.body.style.overflow = "";
  }

  function isOpen() {
    return (
      document.getElementById("cart-sidebar")?.classList.contains("open") ??
      false
    );
  }

  function toggleSelect(key, checked) {
    if (checked) {
      _selected.add(key);
    } else {
      _selected.delete(key);
    }
    const { count } = CartService.getSnapshot();
    UIUtils.setHtml(
      "cart-actions-bar",
      Components.cartActions(count, _selected.size),
    );
    document
      .querySelector(`.cart-item[data-key="${key}"]`)
      ?.classList.toggle("cart-item--selected", checked);
  }

  function toggleSelectAll(checked) {
    const { items, count } = CartService.getSnapshot();
    if (checked) {
      items.forEach((i) => _selected.add(i.key));
    } else {
      _selected.clear();
    }
    UIUtils.setHtml(
      "cart-actions-bar",
      Components.cartActions(count, _selected.size),
    );
    UIUtils.setHtml(
      "cart-items-list",
      items.map((i) => Components.cartItem(i, _selected.has(i.key))).join(""),
    );
  }

  function removeItem(key) {
    const item = CartService.getSnapshot().items.find((i) => i.key === key);
    ConfirmService.show({
      title: "Hapus Item?",
      message: `Hapus "${item?.name ?? "item ini"}" dari keranjang?`,
      confirmLabel: "Ya, Hapus",
      onConfirm: () => {
        _selected.delete(key);
        CartService.removeItem(key);
        UIUtils.showToast("🗑️ Item dihapus dari keranjang");
      },
    });
  }

  function changeQty(key, delta) {
    if (delta === -1) {
      const item = CartService.getSnapshot().items.find((i) => i.key === key);
      if (item && item.qty === 1) {
        ConfirmService.show({
          title: "Hapus Item?",
          message: `"${item.name}" akan dihapus dari keranjang.`,
          confirmLabel: "Ya, Hapus",
          onConfirm: () => {
            _selected.delete(key);
            CartService.removeItem(key);
            UIUtils.showToast("🗑️ Item dihapus dari keranjang");
          },
        });
        return;
      }
    }
    CartService.changeQty(key, delta);
  }

  function deleteSelected() {
    if (_selected.size === 0) return;
    const n = _selected.size;
    ConfirmService.show({
      title: `Hapus ${n} Item?`,
      message: `Hapus ${n} item yang dipilih dari keranjang?`,
      confirmLabel: `Ya, Hapus ${n} Item`,
      onConfirm: () => {
        const keys = [..._selected];
        _selected.clear();
        CartService.removeSelected(keys);
        UIUtils.showToast(`🗑️ ${keys.length} item dihapus`);
      },
    });
  }

  return Object.freeze({
    render,
    open,
    close,
    isOpen,
    toggleSelect,
    toggleSelectAll,
    removeItem,
    changeQty,
    deleteSelected,
  });
})();

// ── OrderView ─────────────────────────────────────────────────────────────────

const OrderView = (() => {
  const ID = "order-modal";

  function open() {
    CartView.close();
    const { items, total } = CartService.getSnapshot();
    UIUtils.setHtml("order-summary", Components.orderSummary(items, total));
    UIUtils.openModal(ID);
  }

  function close() {
    UIUtils.closeModal(ID);
  }
  function isOpen() {
    return UIUtils.isModalOpen(ID);
  }

  async function submit() {
    const formData = {
      customerName: document.getElementById("order-name")?.value.trim() ?? "",
      customerPhone: document.getElementById("order-wa")?.value.trim() ?? "",
      address: document.getElementById("order-address")?.value.trim() ?? "",
      note: document.getElementById("order-note")?.value.trim() ?? "",
    };
    const { valid, message } = OrderService.validate(formData);
    if (!valid) {
      UIUtils.showToast(message);
      return;
    }

    const { items } = CartService.getSnapshot();
    const order = createOrder(items, formData);
    const result = await OrderService.submit(order);

    if (result.success) {
      CartService.clear();
      close();
      ["order-name", "order-wa", "order-address", "order-note"].forEach(
        (id) => {
          const el = document.getElementById(id);
          if (el) el.value = "";
        },
      );
      SuccessView.open(result.order);
    } else {
      UIUtils.showToast("❌ Gagal mengirim pesanan. Coba lagi.");
    }
  }

  return Object.freeze({ open, close, isOpen, submit });
})();

// ── SuccessView ───────────────────────────────────────────────────────────────

const SuccessView = (() => {
  const ID = "success-modal";
  function open(order) {
    UIUtils.setHtml("success-modal-content", Components.orderSuccess(order));
    UIUtils.openModal(ID);
  }
  function close() {
    UIUtils.closeModal(ID);
  }
  return Object.freeze({ open, close });
})();

// ── WishlistView ──────────────────────────────────────────────────────────────

const WishlistView = (() => {
  function render({ products, count }) {
    // Badges
    _setBadge("wishlist-count", count);
    _setBadge("bottom-wishlist-count", count);

    UIUtils.setHtml(
      "wishlist-items-list",
      products.length === 0
        ? Components.wishlistEmpty()
        : products.map(Components.wishlistItem).join(""),
    );

    // Re-render grid agar icon ❤️ ikut update

    // Update tombol wishlist di modal jika sedang terbuka
    _syncModalBtn();
  }

  function _setBadge(id, count) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = count;
    el.classList.toggle("hidden", count === 0);
  }

  function _syncModalBtn() {
    const container = document.querySelector(".pmodal__actions .btn-wishlist");
    if (!container) return;
    const productId = parseInt(
      container.getAttribute("onclick")?.match(/\d+/)?.[0],
    );
    if (!productId) return;
    const isWish = WishlistService.has(productId);
    container.className = `btn-wishlist ${isWish ? "btn-wishlist--active" : ""}`;
    container.innerHTML = `${isWish ? "❤️" : "🤍"} <span>${isWish ? "Tersimpan" : "Wishlist"}</span>`;
  }

  function open() {
    document.getElementById("wishlist-sidebar")?.classList.add("open");
    document.getElementById("wishlist-overlay")?.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    document.getElementById("wishlist-sidebar")?.classList.remove("open");
    document.getElementById("wishlist-overlay")?.classList.remove("open");
    document.body.style.overflow = "";
  }

  function isOpen() {
    return (
      document.getElementById("wishlist-sidebar")?.classList.contains("open") ??
      false
    );
  }

  function toggle(productId) {
    const wasWish = WishlistService.has(productId);
    WishlistService.toggle(productId);
    const p = ProductService.getById(productId);

    // Update SEMUA tombol wishlist untuk produk ini — langsung tanpa re-render grid
    _updateAllWishBtns(productId, !wasWish);

    UIUtils.showToast(
      wasWish
        ? `🤍 ${p?.name} dihapus dari wishlist`
        : `❤️ ${p?.name} ditambahkan ke wishlist!`,
    );
  }

  function _updateAllWishBtns(productId, isWish) {
    // Update tombol bulat di product card
    document
      .querySelectorAll(`.btn-wishlist-circle[onclick*="${productId}"]`)
      .forEach((btn) => {
        btn.className = `btn-wishlist-circle ${isWish ? "btn-wishlist-circle--active" : ""}`;
        btn.innerHTML = isWish ? "❤️" : "🤍";
      });

    // Update tombol di product modal (jika terbuka)
    document
      .querySelectorAll(`.btn-wishlist-pill[onclick*="${productId}"]`)
      .forEach((btn) => {
        btn.className = `btn-wishlist-pill ${isWish ? "btn-wishlist-pill--active" : ""}`;
        btn.innerHTML = `${isWish ? "❤️" : "🤍"} <span>${isWish ? "Tersimpan" : "Wishlist"}</span>`;
      });
  }

  function remove(productId) {
    WishlistService.remove(productId);
    UIUtils.showToast("🤍 Dihapus dari wishlist");
  }

  function moveToCart(productId) {
    WishlistService.remove(productId);
    close();
    ProductModalView.open(productId);
    UIUtils.showToast("🛒 Pilih varian untuk produk ini");
  }

  return Object.freeze({
    render,
    open,
    close,
    isOpen,
    toggle,
    remove,
    moveToCart,
  });
})();

// ── HeroView ──────────────────────────────────────────────────────────────────

const HeroView = (() => {
  function render() {
    const counts = ProductService.getCountByType();
    UIUtils.setText("hero-count-fashion", `${counts.fashion} Produk`);
    UIUtils.setText("hero-count-beauty", `${counts.beauty} Produk`);
    UIUtils.setText("hero-count-promo", `${counts.promo} Promo`);
  }
  return Object.freeze({ render });
})();
