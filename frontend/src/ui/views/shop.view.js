const ShopView = (() => {
  let _activeType = "semua";

  function init() {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type") || "semua";
    _apply(type);
  }

  function setType(type, el) {
    document
      .querySelectorAll(".shop-tab")
      .forEach((t) => t.classList.remove("active"));
    el?.classList.add("active");
    _apply(type);

    const url = new URL(window.location.href);
    if (type === "semua") {
      url.searchParams.delete("type");
    } else {
      url.searchParams.set("type", type);
    }
    window.history.replaceState({}, "", url);
  }

  function _apply(type) {
    _activeType = type;

    // Update judul
    const titles = {
      semua: "Semua Produk",
      fashion: "👗 Muslim Fashion",
      beauty: "💄 Kosmetik Halal",
    };
    UIUtils.setText("shop-page-title", titles[type] || "Semua Produk");

    // Aktifkan tab yang benar
    const tabEl = document.getElementById(`tab-${type}`);
    if (tabEl) {
      document
        .querySelectorAll(".shop-tab")
        .forEach((t) => t.classList.remove("active"));
      tabEl.classList.add("active");
    }

    // Highlight bottom nav
    document
      .getElementById("bn-fashion")
      ?.classList.toggle("active", type === "fashion");
    document
      .getElementById("bn-beauty")
      ?.classList.toggle("active", type === "beauty");

    // Pilih kategori & brand sesuai tipe
    const cats =
      type === "beauty"
        ? BEAUTY_CATEGORIES
        : type === "fashion"
          ? FASHION_CATEGORIES
          : FASHION_CATEGORIES; // semua → default fashion cats

    const brnds =
      type === "beauty"
        ? BEAUTY_BRANDS
        : type === "fashion"
          ? FASHION_BRANDS
          : BRANDS; // semua → semua brand

    // Set type di filter lalu reset & render
    FilterView.setType(type);
    FilterView.reset();
    FilterView.render(cats, brnds);

    // Render price slider
    UIUtils.setHtml(
      "price-range-wrap",
      Components.priceRangeSlider(PRICE_RANGE.min, PRICE_RANGE.max),
    );

    // Render view toggle
    UIUtils.setHtml("view-toggle-wrap", Components.viewToggle("grid"));
  }

  function resetFilter() {
    const cats =
      _activeType === "beauty" ? BEAUTY_CATEGORIES : FASHION_CATEGORIES;
    const brnds = _activeType === "beauty" ? BEAUTY_BRANDS : FASHION_BRANDS;
    FilterView.setType(_activeType);
    FilterView.reset();
    FilterView.render(cats, brnds);
  }

  return Object.freeze({ init, setType, resetFilter });
})();
