const CartService = (() => {
  let _items = [];
  let _onChange = null;

  function subscribe(cb) {
    _onChange = cb;
  }
  function _notify() {
    if (typeof _onChange === "function") _onChange(getSnapshot());
  }

  function addItem(product, color, size) {
    const item = createCartItem(product, color, size);
    const existing = _items.find((i) => i.key === item.key);
    if (existing) {
      existing.qty++;
    } else {
      _items.push(item);
    }
    _notify();
  }

  function removeItem(key) {
    _items = _items.filter((i) => i.key !== key);
    _notify();
  }

  function changeQty(key, delta) {
    const item = _items.find((i) => i.key === key);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) removeItem(key);
    else _notify();
  }

  function removeSelected(keys) {
    _items = _items.filter((i) => !keys.includes(i.key));
    _notify();
  }

  function clear() {
    _items = [];
    _notify();
  }

  function getTotalCount() {
    return _items.reduce((s, i) => s + i.qty, 0);
  }
  function getTotalPrice() {
    return _items.reduce((s, i) => s + i.price * i.qty, 0);
  }

  function getSnapshot() {
    return Object.freeze({
      items: _items.map((i) => ({ ...i })),
      count: getTotalCount(),
      total: getTotalPrice(),
    });
  }

  return Object.freeze({
    subscribe,
    addItem,
    removeItem,
    changeQty,
    removeSelected,
    clear,
    getTotalCount,
    getTotalPrice,
    getSnapshot,
  });
})();
