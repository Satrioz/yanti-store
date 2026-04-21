const WishlistService = (() => {
  const KEY = "yanti_wishlist";
  let _ids = _load();
  let _onChange = null;

  function _load() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch {
      return [];
    }
  }
  function _save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(_ids));
    } catch {}
  }
  function _notify() {
    if (typeof _onChange === "function") _onChange(getSnapshot());
  }

  function subscribe(cb) {
    _onChange = cb;
  }

  function toggle(id) {
    if (has(id)) {
      _ids = _ids.filter((x) => x !== id);
    } else {
      _ids.push(id);
    }
    _save();
    _notify();
  }

  function remove(id) {
    _ids = _ids.filter((x) => x !== id);
    _save();
    _notify();
  }

  function has(id) {
    return _ids.includes(id);
  }
  function getCount() {
    return _ids.length;
  }
  function getProducts() {
    return _ids.map((id) => ProductService.getById(id)).filter(Boolean);
  }

  function getSnapshot() {
    return Object.freeze({
      ids: [..._ids],
      count: _ids.length,
      products: getProducts(),
    });
  }

  return Object.freeze({
    subscribe,
    toggle,
    remove,
    has,
    getCount,
    getProducts,
    getSnapshot,
  });
})();
