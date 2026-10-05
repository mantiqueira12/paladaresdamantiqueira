import { useEffect, useRef } from 'react';
import { criarGerenciadorDeModais } from './modalLifecycle';

const MARCADOR_HISTORICO = '__paladares_modal';
let overflowAnterior = '';
let focoAnterior: HTMLElement | null = null;
let fundosInertes = new Map<HTMLElement, boolean>();

function restaurarFundo() {
  fundosInertes.forEach((eraInerte, elemento) => {
    elemento.inert = eraInerte;
  });
  fundosInertes = new Map();
}

function atualizarFundo(dialogs: HTMLDivElement[]) {
  restaurarFundo();
  if (dialogs.length === 0) return;

  const overlays = new Set(
    dialogs
      .map((dialog) => dialog.closest<HTMLElement>('[data-modal-overlay]'))
      .filter((overlay): overlay is HTMLElement => Boolean(overlay)),
  );

  overlays.forEach((overlay) => {
    const container = overlay.parentElement;
    if (!container) return;
    Array.from(container.children).forEach((elemento) => {
      if (!(elemento instanceof HTMLElement) || overlays.has(elemento)) return;
      if (!fundosInertes.has(elemento)) fundosInertes.set(elemento, elemento.inert);
      elemento.inert = true;
    });
  });
}

let gerenciador: ReturnType<typeof criarGerenciadorDeModais<HTMLDivElement>>;
const aoVoltar = () => gerenciador.voltar();

gerenciador = criarGerenciadorDeModais<HTMLDivElement>({
  iniciar() {
    overflowAnterior = document.body.style.overflow;
    focoAnterior = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = 'hidden';
    // O ouvinte permanece: o popstate do history.back() de fechamento chega
    // depois de restaurar() e precisa ser consumido pelo gerenciador.
    window.addEventListener('popstate', aoVoltar);
  },
  restaurar() {
    document.body.style.overflow = overflowAnterior;
    restaurarFundo();
    if (focoAnterior?.isConnected) focoAnterior.focus();
    focoAnterior = null;
  },
  atualizarFundo,
  criarEntradaHistorico() {
    try {
      history.pushState({ ...(history.state ?? {}), [MARCADOR_HISTORICO]: true }, '');
    } catch {
      // Alguns navegadores incorporados restringem history.pushState.
    }
  },
  temEntradaHistorico() {
    return Boolean((history.state as Record<string, unknown> | null)?.[MARCADOR_HISTORICO]);
  },
  removerEntradaHistorico() {
    history.back();
  },
  adiar(tarefa) {
    queueMicrotask(tarefa);
  },
});

function estaVisivel(elemento: HTMLElement): boolean {
  if (elemento.hidden || elemento.closest('[hidden], [aria-hidden="true"]')) return false;
  const estilo = window.getComputedStyle(elemento);
  if (estilo.display === 'none' || estilo.visibility === 'hidden') return false;
  const checar = (elemento as HTMLElement & {
    checkVisibility?: (opcoes?: { checkOpacity?: boolean; checkVisibilityCSS?: boolean }) => boolean;
  }).checkVisibility;
  if (typeof checar === 'function') {
    return checar.call(elemento, { checkOpacity: false, checkVisibilityCSS: true });
  }
  return elemento.getClientRects().length > 0;
}

/**
 * Compartilha scroll lock, fundo inerte, foco e histórico entre os modais.
 * A troca direta de um diálogo por outro permanece na mesma sessão.
 */
export function useModalA11y(aberto: boolean, onFechar: () => void) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const fecharRef = useRef(onFechar);
  fecharRef.current = onFechar;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!aberto || !dialog) return;

    const focaveis = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [contenteditable="true"], [tabindex]:not([tabindex="-1"])',
        ),
      ).filter(estaVisivel);

    const token = gerenciador.abrir(dialog, () => fecharRef.current());
    (focaveis()[0] ?? dialog).focus();

    const aoTeclado = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') {
        evento.preventDefault();
        fecharRef.current();
        return;
      }
      if (evento.key !== 'Tab') return;
      const controles = focaveis();
      if (controles.length === 0) {
        evento.preventDefault();
        dialog.focus();
        return;
      }
      const primeiro = controles[0];
      const ultimo = controles[controles.length - 1];
      const focoFora = !dialog.contains(document.activeElement);
      if (focoFora || (evento.shiftKey && document.activeElement === primeiro)) {
        evento.preventDefault();
        (evento.shiftKey ? ultimo : primeiro).focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primeiro.focus();
      }
    };

    document.addEventListener('keydown', aoTeclado);
    return () => {
      document.removeEventListener('keydown', aoTeclado);
      gerenciador.fechar(token);
    };
  }, [aberto]);

  return dialogRef;
}
