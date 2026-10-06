import type { PedidoData } from './whatsapp';

export const FAIXAS_PESSOAS = [
  '2 a 7 pessoas',
  '8 a 12 pessoas',
  '13 a 20 pessoas',
  'Mais de 20 pessoas',
] as const;

export const OCASIOES = [
  'Aniversário',
  'Bodas / casamento',
  'Pedido de casamento',
  'Encontro a dois',
  'Reunião de família',
  'Confraternização',
  'Réveillon na serra',
  'Outra ocasião',
] as const;

export const OUTRA_EXPERIENCIA = 'Outra experiência / ideia';

export function dataLocalISO(data = new Date()): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

export function validarDataPedido(valor?: string, hoje = dataLocalISO()): string | null {
  if (!valor) return null;
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor);
  if (!partes) return 'Escolha uma data válida.';

  const ano = Number(partes[1]);
  const mes = Number(partes[2]);
  const dia = Number(partes[3]);
  const data = new Date(ano, mes - 1, dia);
  const existeNoCalendario =
    data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia;
  if (!existeNoCalendario) return 'Escolha uma data válida.';
  if (valor < hoje) return 'Escolha hoje ou uma data futura.';
  return null;
}

export function validarConvidadosPedido(valor?: string): string | null {
  if (!valor) return null;
  return /^\d+$/.test(valor) && Number.isSafeInteger(Number(valor)) && Number(valor) > 0
    ? null
    : 'Informe uma quantidade inteira maior que zero.';
}

export function validarHorarioPedido(valor?: string): string | null {
  if (!valor) return null;
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(valor)
    ? null
    : 'Informe um horário válido (HH:mm).';
}

/** Só categorias já permitidas pelo GA4; nunca envia a quantidade exata. */
export function faixaConvidadosPedido(valor?: string): string | undefined {
  if (!valor || validarConvidadosPedido(valor)) return undefined;
  const quantidade = Number(valor);
  if (quantidade < 2) return undefined;
  if (quantidade <= 7) return FAIXAS_PESSOAS[0];
  if (quantidade <= 12) return FAIXAS_PESSOAS[1];
  if (quantidade <= 20) return FAIXAS_PESSOAS[2];
  return FAIXAS_PESSOAS[3];
}

export function normalizarPedidoInicial(
  pedido: PedidoData,
  experiencias: readonly string[],
): PedidoData {
  const experiencia = pedido.experiencia?.trim();
  const ocasiao = pedido.ocasiao?.trim();
  const pessoas = pedido.pessoas?.trim();
  const horario = pedido.horario?.trim();
  const faixaLegada = pessoas && FAIXAS_PESSOAS.includes(pessoas as (typeof FAIXAS_PESSOAS)[number])
    ? pessoas
    : pedido.faixaPessoas;

  return {
    ...pedido,
    experiencia: experiencia
      ? experiencias.includes(experiencia)
        ? experiencia
        : OUTRA_EXPERIENCIA
      : undefined,
    ocasiao: ocasiao
      ? OCASIOES.includes(ocasiao as (typeof OCASIOES)[number])
        ? ocasiao
        : 'Outra ocasião'
      : undefined,
    pessoas: pessoas && !validarConvidadosPedido(pessoas) ? String(Number(pessoas)) : undefined,
    ...('horario' in pedido ? { horario: horario && !validarHorarioPedido(horario) ? horario : undefined } : {}),
    ...(faixaLegada || 'faixaPessoas' in pedido ? {
      faixaPessoas: FAIXAS_PESSOAS.includes(faixaLegada as (typeof FAIXAS_PESSOAS)[number])
        ? faixaLegada
        : undefined,
    } : {}),
  };
}
