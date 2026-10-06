import { describe, expect, it } from 'vitest';
import { sanitizarEventoSentry } from '../../src/lib/monitoramento';

describe('privacidade do monitoramento', () => {
  it('remove IP e cabeçalhos de cookie do evento antes do envio', () => {
    const evento = {
      user: { id: 'anonimo', ip_address: '203.0.113.8' },
      request: { headers: { Cookie: 'session=segredo', authorization: 'token' } },
      message: 'erro de interface',
    };

    expect(sanitizarEventoSentry(evento)).toEqual({
      user: { id: 'anonimo' },
      request: { headers: { authorization: 'token' } },
      message: 'erro de interface',
    });
  });
});
