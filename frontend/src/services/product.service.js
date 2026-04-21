const ProductService = (() => {
  let _products = [];

  async function init() {
    _products = await ProductRepository.getAll();
  }

  function getAll() {
    return [..._products];
  }
  function getById(id) {
    return _products.find((p) => p.id === id) ?? null;
  }

  function getFiltered(filter) {
    const q = (filter.query || "").toLowerCase().trim();

    let results = _products.filter((p) => {
      const typeMatch =
        !filter.type || filter.type === "semua" ? true : p.type === filter.type;

      const categoryMatch =
        !filter.category || filter.category === "semua"
          ? true
          : filter.category === "promo"
            ? p.badge === "Promo"
            : p.category === filter.category;

      const brandMatch =
        !filter.brand || filter.brand === "semua"
          ? true
          : p.brand === filter.brand;

      const searchMatch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q);

      return typeMatch && categoryMatch && brandMatch && searchMatch;
    });

    const sorted = [...results];
    switch (filter.sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name, "id"));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name, "id"));
        break;
    }
    return sorted;
  }

  function getFashionFeatured(limit = 4) {
    return _products.filter((p) => p.type === "fashion").slice(0, limit);
  }

  function getBeautyFeatured(limit = 4) {
    return _products.filter((p) => p.type === "beauty").slice(0, limit);
  }

  function getCountByType() {
    return {
      fashion: _products.filter((p) => p.type === "fashion").length,
      beauty: _products.filter((p) => p.type === "beauty").length,
      promo: _products.filter((p) => p.badge === "Promo").length,
    };
  }

  function getSizesForProduct(product) {
    if (product.type === "beauty") return ["Semua Ukuran"];
    if (product.category === "anak") return SIZE_OPTIONS.children;
    if (SARONG_EMOJIS.includes(product.emoji)) return SIZE_OPTIONS.sarong;
    if (HEADWEAR_EMOJIS.includes(product.emoji)) return SIZE_OPTIONS.headwear;
    return SIZE_OPTIONS.clothing;
  }

  function getColorsForProduct(product) {
    return product.type === "beauty" ? BEAUTY_COLOR_OPTIONS : COLOR_OPTIONS;
  }

  function getBrandMeta(product) {
    return (
      BRANDS.find((b) => b.id === product.brand) ?? { label: "", color: null }
    );
  }

  return Object.freeze({
    init,
    getAll,
    getById,
    getFiltered,
    getFashionFeatured,
    getBeautyFeatured,
    getCountByType,
    getSizesForProduct,
    getColorsForProduct,
    getBrandMeta,
  });
})();
