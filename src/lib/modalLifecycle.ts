export interface AdaptadorModal<TDialog> {
  iniciar: () => void;
  restaurar: () => void;
  atualizarFundo: (dialogs: TDialog[]) => void;
  criarEntradaHistorico: () => void;
  temEntradaHistorico: () => boolean;
  removerEntradaHistorico: () => void;
  adiar: (tarefa: () => void) => void;
}

interface ModalAtivo<TDialog> {
  dialog: TDialog;
  onFechar: () => void;
}

/**
 * Coordena todos os diálogos como uma única sessão. O encerramento é adiado
 * por uma microtarefa para que a troca detalhe → pedido preserve scroll,
 * histórico, fundo inerte e o foco original sem depender de animação/timer.
 */
export function criarGerenciadorDeModais<TDialog>(adapter: AdaptadorModal<TDialog>) {
  const ativos = new Map<symbol, ModalAtivo<TDialog>>();
  let sessaoAtiva = false;
  let historicoConsumido = false;
  // history.back() é assíncrono: o popstate dele pode chegar depois de um novo
  // abrir(). Cada retorno emitido por nós é descartado quando o evento chegar.
  let retornosPendentes = 0;

  const dialogs = () => Array.from(ativos.values(), ({ dialog }) => dialog);

  const finalizarSeVazio = () => {
    if (ativos.size > 0 || !sessaoAtiva) return;
    adapter.atualizarFundo([]);
    sessaoAtiva = false;
    if (!historicoConsumido && adapter.temEntradaHistorico()) {
      retornosPendentes++;
      adapter.removerEntradaHistorico();
    }
    adapter.restaurar();
    historicoConsumido = false;
  };

  return {
    abrir(dialog: TDialog, onFechar: () => void): symbol {
      if (!sessaoAtiva) {
        sessaoAtiva = true;
        historicoConsumido = false;
        adapter.iniciar();
        adapter.criarEntradaHistorico();
      }
      const token = Symbol('modal');
      ativos.set(token, { dialog, onFechar });
      adapter.atualizarFundo(dialogs());
      return token;
    },

    fechar(token: symbol): void {
      ativos.delete(token);
      if (ativos.size > 0) adapter.atualizarFundo(dialogs());
      else adapter.adiar(finalizarSeVazio);
    },

    voltar(): void {
      if (retornosPendentes > 0) {
        retornosPendentes--;
        return;
      }
      if (!sessaoAtiva || ativos.size === 0) return;
      historicoConsumido = true;
      const atual = Array.from(ativos.values()).at(-1);
      atual?.onFechar();
    },
  };
}
