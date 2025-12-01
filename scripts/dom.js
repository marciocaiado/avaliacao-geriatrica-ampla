/**
 * Módulo de Manipulação do DOM
 * Funções para exibir resultados e interagir com a interface
 */

import { resultadoIds } from './constants.js';

/**
 * Elemento do resumo de testes
 */
const resumoElement = () => document.getElementById('resumo-tests');

/**
 * Exibe o resultado de uma escala
 * @param {string} elementId - ID do elemento onde exibir
 * @param {Function} calcular - Função que calcula o resultado
 * @param {Function} formatar - Função que formata o resultado em HTML
 * @param {boolean} shouldScroll - Se deve fazer scroll para o resultado
 */
export function exibirResultado(elementId, calcular, formatar, shouldScroll = false) {
  const container = document.getElementById(elementId);
  if (!container) return;

  const resultado = calcular();
  container.innerHTML = resultado ? formatar(resultado).trim() : '';
  atualizarResumo();

  if (shouldScroll && resultado) {
    container.scrollIntoView({ behavior: 'smooth' });
  }
}

/**
 * Limpa todos os resultados
 */
export function limparResultados() {
  resultadoIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '';
  });
  atualizarResumo();
}

/**
 * Atualiza o resumo de todos os testes
 */
export function atualizarResumo() {
  const el = resumoElement();
  if (!el) return;

  const blocos = [];
  const secoes = [];

  const coleta = [
    ['SRH', 'resultado-srh'],
    ['IVCF-20', 'resultado-ivcf'],
    ['CFS', 'resultado-cfs'],
    ['FRAIL', 'resultado-frail'],
    ['SARC-F', 'resultado-sarcf'],
    ['Barthel', 'resultado-barthel'],
    ['Katz', 'resultado-katz'],
    ['Lawton', 'resultado-lawton'],
    ['Pfeffer', 'resultado-pfeffer'],
    ['MAN', 'resultado-man'],
    ['10-CS', 'resultado-10cs'],
    ['Zucchelli', 'resultado-zucchelli'],
    ['CAM', 'resultado-cam'],
    ['GDS-15', 'resultado-gds'],
    ['APGAR', 'resultado-apgar'],
  ];

  coleta.forEach(([titulo, id]) => {
    const src = document.getElementById(id);
    const rawHTML = src ? src.innerHTML.trim() : '';

    if (rawHTML) {
      blocos.push(`<div class="item">${src.innerHTML}</div>`);
      secoes.push({
        titulo,
        resultado: src.innerText.trim(),
      });
    }
  });

  el.innerHTML = blocos.join('');

  try {
    localStorage.setItem('resumoTestsHTML', el.innerHTML);
    const nome = (document.getElementById('nome')?.value || '').trim();
    const data = (document.getElementById('data_avaliacao')?.value || '').trim();

    localStorage.setItem('dadosAvaliacao', JSON.stringify({
      nome,
      data,
      secoes,
    }));
  } catch (error) {
    console.warn('[Resumo] Não foi possível armazenar o snapshot do resumo:', error);
  }
}
