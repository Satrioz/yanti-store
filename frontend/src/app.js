document.addEventListener("DOMContentLoaded", async () => {
  // 1. Boot
  await ProductService.init();

  // 2. Hero counts
  HeroView.render();

  // 3. Featured sections
  _renderFeatured();

  // 4. Cart
  CartService.subscribe(CartView.render);
  CartView.render(CartService.getSnapshot());

  // 5. Wishlist
  WishlistService.subscribe(WishlistView.render);
  WishlistView.render(WishlistService.getSnapshot());

  // 6. Events
  document.addEventListener("keydown", _handleKeyDown);
  _bindBackdrops();
  _initPhoneInput();

  // 7. Back to top
  const btn = document.getElementById("back-to-top");
  window.addEventListener("scroll", () =>
    btn?.classList.toggle("visible", window.scrollY > 400),
  );
});

function _renderFeatured() {
  const fashionGrid = document.getElementById("fashion-grid");
  const beautyGrid = document.getElementById("beauty-grid");
  if (fashionGrid)
    fashionGrid.innerHTML = ProductService.getFashionFeatured(4)
      .map(Components.productCard)
      .join("");
  if (beautyGrid)
    beautyGrid.innerHTML = ProductService.getBeautyFeatured(4)
      .map(Components.productCard)
      .join("");
}

function _bindBackdrops() {
  document.getElementById("product-modal")?.addEventListener("click", (e) => {
    if (e.target.id === "product-modal") ProductModalView.close();
  });
  document.getElementById("order-modal")?.addEventListener("click", (e) => {
    if (e.target.id === "order-modal") OrderView.close();
  });
  document.getElementById("confirm-modal")?.addEventListener("click", (e) => {
    if (e.target.id === "confirm-modal") ConfirmService.cancel();
  });
  document.getElementById("success-modal")?.addEventListener("click", (e) => {
    if (e.target.id === "success-modal") SuccessView.close();
  });
}

function _handleKeyDown(e) {
  if (e.key !== "Escape") return;
  if (UIUtils.isModalOpen("product-modal")) {
    ProductModalView.close();
  } else if (UIUtils.isModalOpen("confirm-modal")) {
    ConfirmService.cancel();
  } else if (OrderView.isOpen()) {
    OrderView.close();
  } else if (UIUtils.isModalOpen("success-modal")) {
    SuccessView.close();
  } else if (CartView.isOpen()) {
    CartView.close();
  } else if (WishlistView.isOpen()) {
    WishlistView.close();
  }
}

function _initPhoneInput() {
  const input = document.getElementById("order-wa");
  if (!input) return;
  const ALLOWED = new Set([
    "Backspace",
    "Delete",
    "Tab",
    "Escape",
    "Enter",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Home",
    "End",
  ]);
  input.addEventListener("keydown", (e) => {
    if (ALLOWED.has(e.key)) return;
    if ((e.ctrlKey || e.metaKey) && /^[acvx]$/i.test(e.key)) return;
    if (/^\d$/.test(e.key)) return;
    e.preventDefault();
  });
  input.addEventListener("input", () => {
    input.value = input.value
      .replace(/[^0-9]/g, "")
      .slice(0, AppConfig.PHONE_MAX_LENGTH);
  });
  input.addEventListener("paste", (e) => {
    e.preventDefault();
    const d = (e.clipboardData ?? window.clipboardData)
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, AppConfig.PHONE_MAX_LENGTH);
    input.value = d;
  });
}

function smoothScrollTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
