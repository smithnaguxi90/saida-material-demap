import { svgIcon } from "./ui.js";
import { escapeHTML, formatarDataParaDisplay } from "./utils.js";

export function renderizarGridLancamentos(
  DOM,
  {
    dadosFiltrados,
    paginaAtual,
    itensPorPagina,
    isLoading,
    isAdmin,
    renderizarSkeleton,
  },
) {
  if (isLoading) {
    renderizarSkeleton();
    return;
  }

  DOM.grid.innerHTML = "";
  const total = dadosFiltrados.length;
  const paginas = Math.ceil(total / itensPorPagina) || 1;

  if (total === 0) {
    DOM.grid.innerHTML = `<div class="col-span-1 md:col-span-2 xl:col-span-3 flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-3xl border border-slate-200 border-dashed">
      <div class="bg-slate-50 p-5 rounded-full mb-4 ring-8 ring-slate-50/50 opacity-50">${svgIcon("folder-open", "w-10 h-10")}</div>
      <h4 class="font-extrabold text-lg text-slate-700">Nenhum registro encontrado</h4>
      <p class="text-sm mt-1">Altere os filtros de pesquisa ou adicione um novo lançamento.</p>
    </div>`;
    DOM.tabInfo.textContent = "0 registros";
    DOM.btnPrev.disabled = true;
    DOM.btnNext.disabled = true;
    return;
  }

  const paginaCorrigida = Math.max(1, Math.min(paginaAtual, paginas));
  const start = (paginaCorrigida - 1) * itensPorPagina;
  const end = Math.min(start + itensPorPagina, total);

  let itensHTML = "";
  dadosFiltrados.slice(start, end).forEach((item) => {
    const dataBR = formatarDataParaDisplay(item.data);
    const idArg = item.isGrouped
      ? `[${item.ids.map((id) => `'${id}'`).join(",")}]`
      : `'${item.id}'`;
    const baixaAtual = item.baixa || "Não";
    const borderColor =
      baixaAtual === "Sim" ? "border-t-emerald-500" : "border-t-amber-500";

    const materialSeguro = escapeHTML(item.material);
    const encarregadoSeguro = escapeHTML(item.encarregado);

    const btnBaixa =
      baixaAtual === "Sim"
        ? `<button data-action="toggle-baixa" data-id="${idArg}" data-status="Sim" class="flex-1 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5">${svgIcon("check-double", "w-4 h-4")} Concluído</button>`
        : `<button data-action="toggle-baixa" data-id="${idArg}" data-status="Não" class="flex-1 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5">${svgIcon("clock", "w-4 h-4")} Pendente</button>`;

    itensHTML += `
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200/80 border-t-4 ${borderColor} p-4 sm:p-6 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
        <div class="flex justify-between items-start mb-4">
          <div class="bg-slate-100/80 px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-500 tracking-widest border border-slate-200">
            CÓD: ${escapeHTML(item.codigo)}
          </div>
          <div class="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1">
            ${svgIcon("calendar", "w-4 h-4")} ${dataBR}
          </div>
        </div>
        <h3 class="font-black text-slate-800 text-base leading-tight line-clamp-2 mb-4" title="${materialSeguro}">${materialSeguro}</h3>
        <div class="flex items-center gap-3 sm:gap-4 bg-slate-50/50 rounded-xl p-3 border border-slate-100 mb-4">
          <svg class="text-brand-500 text-sm mr-2" aria-hidden="true"><use href="#icon-users-gear"></use></svg>
          <div class="flex-1 min-w-0">
            <p class="text-[10px] font-bold text-slate-400 uppercase">Responsável</p>
            <p class="font-bold text-slate-700 text-sm truncate" title="${encarregadoSeguro}">${encarregadoSeguro}</p>
          </div>
          <div class="text-right">
            <p class="text-[10px] font-bold text-slate-400 uppercase">Qtd</p>
            <p class="font-black text-brand-600 text-lg leading-none">${item.quantidade.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}</p>
          </div>
        </div>
        <div class="mt-auto flex gap-2 pt-2 border-t border-slate-100">
          ${btnBaixa}
          ${
            item.isGrouped
              ? `<div class="w-16 flex-shrink-0 py-2.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-sm">${svgIcon("layer", "w-4 h-4")} ${item.ids.length}x</div>`
              : isAdmin
                ? `<button data-action="deletar-lancamento" data-id="${item.id}" class="w-16 flex-shrink-0 py-2.5 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-colors flex items-center justify-center shadow-sm" title="Excluir Registro">${svgIcon("trash-can", "w-4 h-4")}</button>`
                : `<div class="w-16 flex-shrink-0 py-2.5 bg-slate-50 text-slate-300 rounded-xl transition-colors flex items-center justify-center shadow-sm cursor-not-allowed" title="Sem permissão para excluir">${svgIcon("trash-can", "w-4 h-4")}</div>`
          }
        </div>
      </div>`;
  });
  DOM.grid.innerHTML = itensHTML;

  DOM.tabInfo.textContent = `Pág. ${paginaCorrigida} de ${paginas} (${total} itens)`;
  DOM.pagInfo.textContent = `${paginaCorrigida} / ${paginas}`;
  DOM.btnPrev.disabled = paginaCorrigida === 1;
  DOM.btnNext.disabled = paginaCorrigida === paginas;

  return paginaCorrigida;
}

export const mudarPagina = (dir, renderCallback) => {
  renderCallback(dir);
};