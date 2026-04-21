const OrderService = (() => {
  function validate({ customerName, customerPhone, address }) {
    if (!customerName.trim())
      return { valid: false, message: "⚠️ Nama lengkap harus diisi." };
    if (!customerPhone.trim())
      return { valid: false, message: "⚠️ Nomor WhatsApp harus diisi." };
    if (!/^\d{8,15}$/.test(customerPhone.trim())) {
      return {
        valid: false,
        message: "⚠️ Nomor WhatsApp tidak valid (8–15 digit angka).",
      };
    }
    if (!address.trim())
      return { valid: false, message: "⚠️ Alamat pengiriman harus diisi." };
    return { valid: true, message: "" };
  }

  async function submit(order) {
    if (!AppConfig.USE_MOCK_DATA) {
      try {
        const res = await fetch(`${AppConfig.API_BASE_URL}/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_name: order.customerName,
            customer_phone: order.customerPhone,
            address: order.address,
            note: order.note,
            items: order.items.map((i) => ({
              product_id: i.id,
              color: i.color,
              size: i.size,
              qty: i.qty,
            })),
          }),
        });
        const json = await res.json();
        if (!json.success) return { success: false };
      } catch (err) {
        console.error("Order API error:", err);
        return { success: false };
      }
    }
    const message = _buildWAMessage(order);
    window.open(
      `https://wa.me/${AppConfig.STORE_WA}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
    return { success: true, order };
  }

  function _buildWAMessage(order) {
    const lines = order.items
      .map((i) => {
        const v = [i.color, i.size].filter(Boolean).join(", ");
        return `• ${i.emoji} ${i.name}${v ? ` (${v})` : ""} x${i.qty} = ${formatRp(i.price * i.qty)}`;
      })
      .join("\n");
    return [
      "🛍️ *PESANAN BARU - Yanti Store*",
      "",
      `👤 *Nama:* ${order.customerName}`,
      `📱 *WA:* ${order.customerPhone}`,
      `📍 *Alamat:* ${order.address}`,
      order.note ? `📝 *Catatan:* ${order.note}` : null,
      "",
      "*Detail Pesanan:*",
      lines,
      "",
      `💰 *Total: ${formatRp(order.total)}*`,
      "",
      "Terima kasih sudah berbelanja! 🙏",
    ]
      .filter((l) => l !== null)
      .join("\n");
  }

  return Object.freeze({ validate, submit });
})();
