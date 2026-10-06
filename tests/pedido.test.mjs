import assert from 'node:assert/strict';
import test from 'node:test';
import { importTypeScript } from './import-typescript.mjs';

const {
  OUTRA_EXPERIENCIA,
  dataLocalISO,
  normalizarPedidoInicial,
  validarDataPedido,
  validarConvidadosPedido,
  validarHorarioPedido,
  faixaConvidadosPedido,
} = await importTypeScript('../src/lib/pedido.ts', import.meta.url);
const { linkWhatsApp, montarMensagem } = await importTypeScript('../src/lib/whatsapp.ts', import.meta.url);

test('dataLocalISO usa os componentes locais, inclusive perto da meia-noite', () => {
  const instanteLocal = new Date(2026, 8, 19, 23, 45, 0);

  assert.equal(dataLocalISO(instanteLocal), '2026-09-19');
});

test('validarDataPedido aceita campo opcional e uma data real de hoje ou futura', () => {
  assert.equal(validarDataPedido('', '2026-09-19'), null);
  assert.equal(validarDataPedido('2026-09-19', '2026-09-19'), null);
  assert.equal(validarDataPedido('2027-01-01', '2026-09-19'), null);
});

test('validarDataPedido rejeita data passada e datas impossíveis', () => {
  assert.equal(validarDataPedido('2026-09-18', '2026-09-19'), 'Escolha hoje ou uma data futura.');
  assert.equal(validarDataPedido('2026-02-29', '2026-09-19'), 'Escolha uma data válida.');
  assert.equal(validarDataPedido('2026-13-01', '2026-09-19'), 'Escolha uma data válida.');
});

test('normalizarPedidoInicial mantém opções reais e converte valores livres em opções seguras', () => {
  assert.deepEqual(
    normalizarPedidoInicial(
      {
        experiencia: 'Menu secreto da Ana',
        ocasiao: 'Festa na Rua Particular 123',
        pessoas: 'centenas',
        cidade: 'Campos do Jordão',
      },
      ['Origens da Serra'],
    ),
    {
      experiencia: OUTRA_EXPERIENCIA,
      ocasiao: 'Outra ocasião',
      pessoas: undefined,
      cidade: 'Campos do Jordão',
    },
  );
});

test('pedido inicial conserva quantidade exata e horário, sem perder cidade e data', () => {
  const pedido = normalizarPedidoInicial({ pessoas: ' 037 ', horario: ' 18:30 ', cidade: 'Gonçalves', data: '2026-12-05' }, []);
  assert.equal(pedido.pessoas, '37');
  assert.equal(pedido.horario, '18:30');
  assert.equal(pedido.cidade, 'Gonçalves');
  assert.equal(pedido.data, '2026-12-05');
});

test('prefill antigo conserva faixa sem inventar quantidade exata', () => {
  const pedido = normalizarPedidoInicial({ pessoas: '8 a 12 pessoas' }, []);
  assert.equal(pedido.pessoas, undefined);
  assert.equal(pedido.faixaPessoas, '8 a 12 pessoas');
  assert.match(montarMensagem(pedido), /Convidados \(faixa informada\): 8 a 12 pessoas/);
});

test('prefill descarta quantidade e horário inválidos ou texto livre', () => {
  for (const pessoas of ['0', '-2', '1.5', '1e2', 'Infinity', '9007199254740992', '37 convidados']) {
    const pedido = normalizarPedidoInicial({ pessoas, horario: '25:61', faixaPessoas: 'Festa privada' }, []);
    assert.equal(pedido.pessoas, undefined);
    assert.equal(pedido.horario, undefined);
    assert.equal(pedido.faixaPessoas, undefined);
  }
});

test('quantidade opcional aceita inteiro positivo e rejeita fração, zero, negativo e expoente', () => {
  for (const pessoas of ['', undefined, '1', '37']) assert.equal(validarConvidadosPedido(pessoas), null);
  for (const pessoas of ['0', '-1', '1.5', '1e2', '9007199254740992', 'texto']) assert.ok(validarConvidadosPedido(pessoas));
});

test('horário opcional aceita HH:mm de 00:00 a 23:59 e rejeita valores impossíveis', () => {
  for (const horario of ['', undefined, '00:00', '18:30', '23:59']) assert.equal(validarHorarioPedido(horario), null);
  for (const horario of ['24:00', '12:60', '8:30', '18h30', 'texto']) assert.ok(validarHorarioPedido(horario));
});

test('analytics recebe somente faixas permitidas derivadas dos limites numéricos', () => {
  const casos = [['1', undefined], ['2', '2 a 7 pessoas'], ['7', '2 a 7 pessoas'], ['8', '8 a 12 pessoas'], ['12', '8 a 12 pessoas'], ['13', '13 a 20 pessoas'], ['20', '13 a 20 pessoas'], ['21', 'Mais de 20 pessoas'], ['37', 'Mais de 20 pessoas'], ['', undefined], ['-1', undefined], ['1e2', undefined]];
  for (const [pessoas, faixa] of casos) assert.equal(faixaConvidadosPedido(pessoas), faixa);
});

test('mensagem conserva quantidade exata e horário desejado para o WhatsApp', () => {
  const pedido = { pessoas: '37', horario: '18:30', data: '2026-12-05', cidade: 'Gonçalves' };
  const mensagem = montarMensagem(pedido);
  assert.match(mensagem, /• Convidados: 37/);
  assert.match(mensagem, /• Horário desejado: 18:30/);
  assert.match(mensagem, /• Data desejada: 05\/12\/2026/);
  assert.match(mensagem, /• Local: Gonçalves/);
  assert.equal(new URL(linkWhatsApp(pedido)).searchParams.get('text'), mensagem);
});

test('montarMensagem inclui todos os detalhes válidos e formata a data sem fuso', () => {
  const mensagem = montarMensagem({
    nome: 'Lia',
    experiencia: 'Origens da Serra',
    ocasiao: 'Bodas / casamento',
    pessoas: '8 a 12 pessoas',
    data: '2026-12-05',
    cidade: 'Santo Antônio do Pinhal',
    soServico: false,
  });

  assert.equal(
    mensagem,
    [
      'Olá, Chef Rafael! Aqui é Lia. 🌿',
      'Gostaria de solicitar a experiência *Origens da Serra*.',
      '• Ocasião: Bodas / casamento\n• Convidados: 8 a 12 pessoas\n• Data desejada: 05/12/2026\n• Local: Santo Antônio do Pinhal',
      'Pode me dizer se a data está disponível e qual é o próximo passo?',
    ].join('\n\n'),
  );
});

test('montarMensagem funciona sem nenhum campo opcional', () => {
  assert.equal(
    montarMensagem({}),
    [
      'Olá, Chef Rafael! 🌿',
      'Gostaria de planejar uma experiência com você — ainda estou escolhendo qual combina mais com o momento.',
      'Pode me dizer se a data está disponível e qual é o próximo passo?',
    ].join('\n\n'),
  );
});

test('montarMensagem trata a opção Outra como conversa aberta, sem nome de pacote artificial', () => {
  const mensagem = montarMensagem({ experiencia: OUTRA_EXPERIENCIA });

  assert.equal(mensagem.includes(`*${OUTRA_EXPERIENCIA}*`), false);
  assert.equal(mensagem.includes('tenho outra ideia para conversar'), true);
});

test('linkWhatsApp codifica exatamente a mensagem produzida', () => {
  const pedido = { nome: 'João & Bia', cidade: 'São Bento do Sapucaí' };
  const url = new URL(linkWhatsApp(pedido));

  assert.equal(url.origin + url.pathname, 'https://wa.me/5512997710040');
  assert.equal(url.searchParams.get('text'), montarMensagem(pedido));
  assert.equal(linkWhatsApp(pedido).includes('João'), false);
  assert.equal(linkWhatsApp(pedido).includes('& Bia'), false);
});

test('montarMensagem só promete Só o Serviço quando o pedido o exige', () => {
  assert.equal(montarMensagem({ experiencia: 'Feito na Brasa' }).includes('Só o Serviço'), false);
  assert.equal(
    montarMensagem({ experiencia: 'Feijoada dos Chegados', soServico: true }).includes(
      'Tenho interesse no formato *Só o Serviço*',
    ),
    true,
  );
});
