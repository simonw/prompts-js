const Prompts = (function () {
  // Common styles
  const dialogStyle = {
    border: "none",
    borderRadius: "6px",
    padding: "20px",
    minWidth: "300px",
    maxWidth: "80%",
    boxSizing: "border-box",
    fontFamily: "sans-serif",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    background: "#fff",
  };

  const messageStyle = {
    marginBottom: "20px",
    fontSize: "16px",
    color: "#333",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
  };

  const buttonRowStyle = {
    textAlign: "right",
    marginTop: "20px",
  };

  const buttonStyle = {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "8px 12px",
    fontSize: "14px",
    cursor: "pointer",
    marginLeft: "8px",
  };

  const cancelButtonStyle = {
    backgroundColor: "#6c757d",
  };

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "8px",
    fontSize: "14px",
    marginBottom: "20px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  };

  function applyStyles(element, styles) {
    Object.assign(element.style, styles);
  }

  function createDialog(message) {
    const dialog = document.createElement("dialog");
    applyStyles(dialog, dialogStyle);
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");

    const form = document.createElement("form");
    form.method = "dialog"; // Allows form to close the dialog on submission.

    const msg = document.createElement("div");
    applyStyles(msg, messageStyle);
    msg.textContent = message;

    form.appendChild(msg);
    dialog.appendChild(form);

    return { dialog, form };
  }

  function createButton(label, value, customStyles = {}) {
    const btn = document.createElement("button");
    applyStyles(btn, buttonStyle);
    applyStyles(btn, customStyles);
    btn.type = "submit";
    btn.value = value; // form submission will set dialog.returnValue to this
    btn.textContent = label;
    return btn;
  }

  async function alert(message) {
    return new Promise((resolve) => {
      const { dialog, form } = createDialog(message);

      const buttonRow = document.createElement("div");
      applyStyles(buttonRow, buttonRowStyle);

      const okBtn = createButton("OK", "ok");
      buttonRow.appendChild(okBtn);
      form.appendChild(buttonRow);

      dialog.addEventListener("close", () => {
        resolve();
        dialog.remove();
      });

      document.body.appendChild(dialog);
      dialog.showModal();
      okBtn.focus();
    });
  }

  async function confirm(message) {
    return new Promise((resolve) => {
      const { dialog, form } = createDialog(message);

      const buttonRow = document.createElement("div");
      applyStyles(buttonRow, buttonRowStyle);

      const cancelBtn = createButton("Cancel", "cancel", cancelButtonStyle);
      const okBtn = createButton("OK", "ok");

      buttonRow.appendChild(cancelBtn);
      buttonRow.appendChild(okBtn);
      form.appendChild(buttonRow);

      dialog.addEventListener("close", () => {
        // dialog.returnValue will be "ok", "cancel", or "" (if ESC pressed)
        const val = dialog.returnValue;
        resolve(val === "ok");
        dialog.remove();
      });

      document.body.appendChild(dialog);
      dialog.showModal();
      // Set focus to the OK button so pressing Enter will confirm
      okBtn.focus();
    });
  }

  async function prompt(message) {
    return new Promise((resolve) => {
      const { dialog, form } = createDialog(message);

      const input = document.createElement("input");
      applyStyles(input, inputStyle);
      input.type = "text";
      input.name = "promptInput";

      form.appendChild(input);

      const buttonRow = document.createElement("div");
      applyStyles(buttonRow, buttonRowStyle);

      const cancelBtn = createButton("Cancel", "cancel", cancelButtonStyle);
      const okBtn = createButton("OK", "ok");

      buttonRow.appendChild(cancelBtn);
      buttonRow.appendChild(okBtn);
      form.appendChild(buttonRow);

      dialog.addEventListener("close", () => {
        const val = dialog.returnValue === "ok" ? input.value : null;
        resolve(val);
        dialog.remove();
      });

      document.body.appendChild(dialog);
      dialog.showModal();
      input.focus();
    });
  }

  return { alert, confirm, prompt };
})();