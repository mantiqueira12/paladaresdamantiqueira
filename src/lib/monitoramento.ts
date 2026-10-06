type EventoSanitizavel = {
  user?: { [campo: string]: unknown };
  request?: { headers?: Record<string, unknown> };
  [campo: string]: unknown;
};

/** Remove identificadores de rede/cookies mesmo se uma integração os anexar. */
export function sanitizarEventoSentry<T>(evento: T): T {
  const sanitizavel = evento as EventoSanitizavel;
  if (sanitizavel.user) delete sanitizavel.user.ip_address;
  const headers = sanitizavel.request?.headers;
  if (headers) {
    delete headers.cookie;
    delete headers.Cookie;
    delete headers['set-cookie'];
    delete headers['Set-Cookie'];
  }
  return evento;
}

export function iniciarMonitoramento(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn || !import.meta.env.PROD || typeof window === 'undefined') return;

  const ligar = () => {
    import('@sentry/browser')
      .then((Sentry) => {
        Sentry.init({
          dsn,
          environment: 'producao',
          sendDefaultPii: false,
          tracesSampleRate: 0,
          beforeSend: (evento) => sanitizarEventoSentry(evento),
        });
      })
      .catch(() => {
        // Monitoramento nunca pode derrubar o site.
      });
  };

  if ('requestIdleCallback' in window) window.requestIdleCallback(ligar, { timeout: 4000 });
  else setTimeout(ligar, 2000);
}
