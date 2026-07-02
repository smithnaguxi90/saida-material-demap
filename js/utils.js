const MAX_TAMANHO_ARQUIVO = 5 * 1024 * 1024;
const TIPOS_ARQUIVO_PERMITIDOS = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
  "application/csv",
  "application/vnd.ms-excel",
];

export const escapeHTML = (str) => {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const formatarDataParaDisplay = (valor) => {
  if (!valor) return "";
  const texto = String(valor);
  return texto.includes("-") ? texto.split("-").reverse().join("/") : texto;
};

export const atualizarTextoSeExiste = (id, valor) => {
  const el = document.getElementById(id);
  if (el) el.textContent = valor;
};

export const abrirModal = (modalId, contentId, callback) => {
  const modal = document.getElementById(modalId);
  const content = document.getElementById(contentId);
  if (!modal || !content) return;

  modal.classList.remove("hidden");
  requestAnimationFrame(() => {
    modal.classList.remove("opacity-0");
    content.classList.remove("scale-95");
    if (typeof callback === "function") callback();
  });
};

export const fecharModal = (modalId, contentId) => {
  const modal = document.getElementById(modalId);
  const content = document.getElementById(contentId);
  if (!modal || !content) return;
  modal.classList.add("opacity-0");
  content.classList.add("scale-95");
  setTimeout(() => modal.classList.add("hidden"), 300);
};

export const validarArquivoImportacao = (file) => {
  if (!file) {
    return { ok: false, message: "Nenhum arquivo selecionado." };
  }

  if (file.size > MAX_TAMANHO_ARQUIVO) {
    return {
      ok: false,
      message: "O arquivo é muito grande. Envie um arquivo menor que 5 MB.",
    };
  }

  const nome = (file.name || "").toLowerCase();
  const tipo = file.type || "";
  const eCsv = nome.endsWith(".csv");
  const eXlsx = nome.endsWith(".xlsx");
  const permitido = TIPOS_ARQUIVO_PERMITIDOS.includes(tipo) || eCsv || eXlsx;

  if (!permitido) {
    return { ok: false, message: "Tipo de arquivo não suportado." };
  }

  return { ok: true };
};
