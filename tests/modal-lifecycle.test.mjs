import assert from 'node:assert/strict';
import test from 'node:test';
import { importTypeScript } from './import-typescript.mjs';

const { criarGerenciadorDeModais } = await importTypeScript('../src/lib/modalLifecycle.ts', import.meta.url);

function ambienteFalso() {
  const tarefas = [];
  const log = [];
  let marcador = false;
  return {
    log,
    flush() {
      while (tarefas.length) tarefas.shift()();
    },
    adapter: {
      iniciar: () => log.push('iniciar'),
      restaurar: () => log.push('restaurar'),
      atualizarFundo: (dialogs) => log.push(`fundo:${dialogs.join(',')}`),
      criarEntradaHistorico: () => {
        marcador = true;
        log.push('push');
      },
      temEntradaHistorico: () => marcador,
      removerEntradaHistorico: () => {
        marcador = false;
        log.push('back');
      },
      adiar: (tarefa) => tarefas.push(tarefa),
    },
  };
}

test('troca direta mantém uma única sessão de modal, histórico e fundo bloqueado', () => {
  const falso = ambienteFalso();
  const gerente = criarGerenciadorDeModais(falso.adapter);
  const fecharUm = () => {};
  const fecharDois = () => {};

  const um = gerente.abrir('detalhe', fecharUm);
  gerente.fechar(um);
  gerente.abrir('pedido', fecharDois);
  falso.flush();

  assert.deepEqual(falso.log, [
    'iniciar',
    'push',
    'fundo:detalhe',
    'fundo:pedido',
  ]);
});

test('fechamento pela interface remove a entrada de histórico e restaura a página uma vez', () => {
  const falso = ambienteFalso();
  const gerente = criarGerenciadorDeModais(falso.adapter);
  const token = gerente.abrir('pedido', () => {});

  gerente.fechar(token);
  falso.flush();

  assert.deepEqual(falso.log, [
    'iniciar',
    'push',
    'fundo:pedido',
    'fundo:',
    'back',
    'restaurar',
  ]);
});

test('Voltar chama somente o modal ativo e não volta duas vezes no histórico', () => {
  const falso = ambienteFalso();
  const gerente = criarGerenciadorDeModais(falso.adapter);
  let fechamentos = 0;
  const token = gerente.abrir('pedido', () => fechamentos++);

  gerente.voltar();
  gerente.fechar(token);
  falso.flush();

  assert.equal(fechamentos, 1);
  assert.equal(falso.log.includes('back'), false);
  assert.equal(falso.log.at(-1), 'restaurar');
});

test('popstate atrasado do fechamento anterior não fecha o modal reaberto', () => {
  const falso = ambienteFalso();
  const gerente = criarGerenciadorDeModais(falso.adapter);
  const token = gerente.abrir('pedido', () => {});
  gerente.fechar(token);
  falso.flush(); // history.back() disparado; popstate ainda não chegou

  let fechamentos = 0;
  gerente.abrir('pedido', () => fechamentos++);
  gerente.voltar(); // popstate atrasado da primeira sessão
  assert.equal(fechamentos, 0);

  gerente.voltar(); // Voltar real do visitante
  assert.equal(fechamentos, 1);
});
