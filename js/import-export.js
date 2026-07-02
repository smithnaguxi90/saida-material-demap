import { parseCsv, serializeCsv } from "./planilha.mjs";
import { normalizarLancamentoImportado } from "./normalizacao.mjs";
import { showToast } from "./ui.js";
import { validarArquivoImportacao } from "./utils.js";

export const importarBasePlanilha = (file, { onSuccess, onError }) => {
  const validacao = validarArquivoImportacao(file);
  if (!validacao.ok) {
    showToast(validacao.message, "error");
    return false;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    try {
      const text = new TextDecoder("utf-8").decode(event.target.result);
      const rows = parseCsv(text);
      const novaBase = {};
      for (let i = 1; i < rows.length; i += 1) {
        const row = rows[i];
        if (row && row.length >= 4) {
          const cod = String(row[1] || "")
            .replace(/(^"|"$)/g, "")
            .trim();
          const nome = String(row[3] || "")
            .replace(/(^"|"$)/g, "")
            .trim();
          if (cod && nome && cod !== "undefined" && nome !== "undefined")
            novaBase[cod] = nome;
        }
      }
      onSuccess(novaBase);
    } catch (error) {
      onError(error);
    }
  };
  reader.readAsArrayBuffer(file);
  return true;
};

export const importarHistoricoPlanilha = (file, { onSuccess, onError }) => {
  const validacao = validarArquivoImportacao(file);
  if (!validacao.ok) {
    showToast(validacao.message, "error");
    return false;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    try {
      const text = new TextDecoder("utf-8").decode(event.target.result);
      const rows = parseCsv(text);
      const headers = rows[0] || [];
      const lancamentos = [];
      for (let i = 1; i < rows.length; i += 1) {
        const row = Object.fromEntries(
          headers.map((header, index) => [header, rows[i][index] ?? ""]),
        );
        const lancamento = normalizarLancamentoImportado(row);
        if (lancamento.codigo && lancamento.quantidade > 0 && lancamento.data) {
          lancamentos.push(lancamento);
        }
      }
      onSuccess(lancamentos);
    } catch (error) {
      onError(error);
    }
  };
  reader.readAsArrayBuffer(file);
  return true;
};

export const exportarLancamentosCsv = (
  dadosFiltrados,
  colunasSelecionadas,
  filtrosResumo,
) => {
  const colunasValidas = (colunasSelecionadas || []).filter((coluna) =>
    Object.prototype.hasOwnProperty.call(
      {
        data: "Data",
        codigo: "Código",
        material: "Material",
        quantidade: "Quantidade",
        encarregado: "Encarregado",
        baixa: "Baixa",
      },
      coluna,
    ),
  );
  const data = dadosFiltrados.map((i) => {
    const linha = {};
    (colunasValidas.length
      ? colunasValidas
      : Object.keys({
          data: "Data",
          codigo: "Código",
          material: "Material",
          quantidade: "Quantidade",
          encarregado: "Encarregado",
          baixa: "Baixa",
        })
    ).forEach((coluna) => {
      if (coluna === "data") {
        linha["Data"] = i.data;
      } else if (coluna === "quantidade") {
        linha["Quantidade"] = Number(i.quantidade);
      } else if (coluna === "codigo") {
        linha["Código"] = i.codigo || "";
      } else if (coluna === "material") {
        linha["Material"] = i.material || "";
      } else if (coluna === "encarregado") {
        linha["Encarregado"] = i.encarregado || "";
      } else if (coluna === "baixa") {
        linha["Baixa"] = i.baixa || "";
      }
    });
    return linha;
  });

  const headers = Object.keys(data[0] || {}).map((key) => key);
  const rows = [
    headers,
    ...data.map((item) => headers.map((key) => item[key] ?? "")),
  ];
  const csv = serializeCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `DEMAP_Lançamentos_${new Date().toISOString().split("T")[0]}${filtrosResumo.length ? "_filtrado" : ""}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast("Relatório baixado com sucesso!", "success");
};
