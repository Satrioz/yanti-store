const ConfirmService = (() => {
  let _onConfirm = null;

  function show({ title, message, confirmLabel = "Hapus", onConfirm }) {
    _onConfirm = onConfirm;
    UIUtils.setText("confirm-title", title);
    UIUtils.setText("confirm-message", message);
    UIUtils.setText("confirm-btn", confirmLabel);
    UIUtils.openModal("confirm-modal");
  }

  function confirm() {
    UIUtils.closeModal("confirm-modal");
    if (typeof _onConfirm === "function") _onConfirm();
    _onConfirm = null;
  }

  function cancel() {
    UIUtils.closeModal("confirm-modal");
    _onConfirm = null;
  }

  return Object.freeze({ show, confirm, cancel });
})();
