const UIUtils = (() => {
  function formatRp(amount) {
    return "Rp " + amount.toLocaleString("id-ID");
  }

  let _timer = null;
  function showToast(msg) {
    const el = document.getElementById("toast");
    const m = document.getElementById("toast-msg");
    if (!el || !m) return;
    m.textContent = msg;
    el.classList.add("show");
    clearTimeout(_timer);
    _timer = setTimeout(
      () => el.classList.remove("show"),
      AppConfig.TOAST_DURATION_MS,
    );
  }

  function openModal(id) {
    document.getElementById(id)?.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal(id) {
    document.getElementById(id)?.classList.remove("open");
    document.body.style.overflow = "";
  }

  function isModalOpen(id) {
    return document.getElementById(id)?.classList.contains("open") ?? false;
  }

  function setHtml(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function toggleHidden(id, hide) {
    document.getElementById(id)?.classList.toggle("hidden", hide);
  }

  return Object.freeze({
    formatRp,
    showToast,
    openModal,
    closeModal,
    isModalOpen,
    setHtml,
    setText,
    toggleHidden,
  });
})();

function formatRp(amount) {
  return UIUtils.formatRp(amount);
}
