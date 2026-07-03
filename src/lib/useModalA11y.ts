import { useEffect, useRef } from 'react';

/**
 * Acessibilidade e robustez de modal (doc 13 §3.1):
 * - Esc fecha;
 * - foco inicial vai para o diálogo e retorna ao elemento anterior ao fechar;
 * - Tab circula somente dentro do modal (focus trap);
 * - botão "voltar" do Android/iOS fecha o modal em vez de sair do site.
 * Roda apenas no cliente, pós-hidratação — sem risco de mismatch com o SSG.
 */
export function useModalA11y(aberto: boolean, onFechar: () => void) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const fecharRef = useRef(onFechar);
  fecharRef.current = onFechar;

  useEffect(() => {
    if (!aberto) return;

    const anterior = document.activeElement as HTMLElement | null;

    const focaveis = () => {
      const dialog = dialogRef.current;
      if (!dialog) return [] as HTMLElement[];
      return Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      );
    };

    focaveis()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        fecharRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const els = focaveis();
      if (els.length === 0) return;
      const primeiro = els[0];
      const ultimo = els[els.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    };

    // Entrada extra no histórico: o "voltar" dispara popstate e fecha o modal.
    history.pushState({ modal: true }, '');
    const onPop = () => fecharRef.current();

    document.addEventListener('keydown', onKey);
    window.addEventListener('popstate', onPop);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('popstate', onPop);
      // Fechou pela UI (botão/backdrop/Esc): remove a entrada extra do histórico.
      // (O listener já saiu, então este back() não reabre nada.)
      if ((history.state as { modal?: boolean } | null)?.modal) history.back();
      anterior?.focus();
    };
  }, [aberto]);

  return dialogRef;
}
