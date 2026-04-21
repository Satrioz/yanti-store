function createProduct(raw) {
  return {
    id: Number(raw.id) || 0,
    name: String(raw.name) || "",
    category: String(raw.category) || "wanita",
    brand: String(raw.brand) || "lainnya",
    type: String(raw.type) || "fashion",
    price: Number(raw.price) || 0,
    emoji: String(raw.emoji) || "👗",
    badge: raw.badge || null,
    desc: String(raw.desc) || "",
    stock: Number(raw.stock) || 0,
  };
}

function createCartItem(product, color, size) {
  return {
    key: `${product.id}__${color}__${size}`,
    id: product.id,
    name: product.name,
    emoji: product.emoji,
    price: product.price,
    color,
    size,
    qty: 1,
  };
}

function createFilterState() {
  return { ...DEFAULT_FILTER };
}

function createOrder(
  items,
  { customerName, customerPhone, address, note = "" },
) {
  return {
    items,
    total: items.reduce((sum, i) => sum + i.price * i.qty, 0),
    customerName,
    customerPhone,
    address,
    note,
  };
}
