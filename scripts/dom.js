/**
 * Módulo de Manipulação do DOM
 * Funções para exibir resultados e interagir com a interface
 */

import { resultadoIds } from './constants.js?v=2';

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
const collectMedicamentosFromDOM = () => {
  const medicamentos = [];
  document.querySelectorAll('.medicamento-item').forEach((item, index) => {
    const id = item.getAttribute('data-medicamento-id') || index + 1;
    const medNome = item.querySelector(`[name="med${id}_nome"]`)?.value?.trim() || '';
    const justificativa = item.querySelector(`[name="med${id}_justificativa"]`)?.value?.trim() || '';
    const dose = item.querySelector(`[name="med${id}_dose"]`)?.value?.trim() || '';
    const tempo = item.querySelector(`[name="med${id}_tempo"]`)?.value?.trim() || '';

    if (medNome || justificativa || dose || tempo) {
      medicamentos.push({ nome: medNome, justificativa, dose, tempo });
    }
  });
  return medicamentos;
};

const buildMedicamentosResumoHTML = (medicamentos) => {
  if (!Array.isArray(medicamentos) || medicamentos.length === 0) return '';

  const itens = medicamentos
    .map((med, index) => {
      const campos = [];
      if (med.nome) {
        campos.push(`<div class="info-item"><span class="info-label">Nome:</span> <span class="info-value">${med.nome}</span></div>`);
      }
      if (med.justificativa) {
        campos.push(`<div class="info-item"><span class="info-label">Justificativa:</span> <span class="info-value">${med.justificativa}</span></div>`);
      }
      if (med.dose) {
        campos.push(`<div class="info-item"><span class="info-label">Dose e Posologia:</span> <span class="info-value">${med.dose}</span></div>`);
      }
      if (med.tempo) {
        campos.push(`<div class="info-item"><span class="info-label">Tempo de Uso:</span> <span class="info-value">${med.tempo}</span></div>`);
      }
      if (!campos.length) return '';
      return `
        <div class="item medicamento-card">
          <h4>Medicamento ${index + 1}</h4>
          <div class="info-grid">
            ${campos.join('')}
          </div>
        </div>`;
    })
    .filter(Boolean)
    .join('');

  if (!itens) return '';

  return `
    <div class="item medicamento-summary">
      <h3>Medicamentos em Uso</h3>
      ${itens}
    </div>`;
};

export function atualizarResumo() {
  const el = resumoElement();
  if (!el) return;

  const blocos = [];
  const secoes = [];

  const coleta = [
    ['IVCF-20', 'resultado-ivcf'],
    ['FRAIL', 'resultado-frail'],
    ['SARC-F', 'resultado-sarcf'],
    ['Barthel', 'resultado-barthel'],
    ['Katz', 'resultado-katz'],
    ['Lawton', 'resultado-lawton'],
    ['MAN', 'resultado-man'],
    ['10-CS', 'resultado-10cs'],
    ['Zucchelli', 'resultado-zucchelli'],
    ['CAM', 'resultado-cam'],
    ['GDS-15', 'resultado-gds'],
    ['EDG-4', 'resultado-edg4'],
    ['APGAR', 'resultado-apgar'],
    ['AGC-10', 'resultado-agc10'],
    ['MEEM', 'resultado-meem'],
    ['Velocidade de Marcha', 'resultado-marcha'],
    ['Sentar e Levantar', 'resultado-sentar-levantar'],
  ];

  coleta.forEach(([titulo, id]) => {
    const src = document.getElementById(id);
    const rawHTML = src ? src.innerHTML.trim() : '';
    if (rawHTML) {
      blocos.push(`<div class="item">${src.innerHTML}</div>`);
      secoes.push({
        titulo,
        resultado: src.textContent.trim(),
      });
    }
  });

  const medicamentos = collectMedicamentosFromDOM();
  const medicamentosResumo = buildMedicamentosResumoHTML(medicamentos);
  if (medicamentosResumo) {
    blocos.push(medicamentosResumo);
  }

  el.innerHTML = blocos.join('');

  try {
    localStorage.setItem('resumoTestsHTML', el.innerHTML);
    const nome = (document.getElementById('anamnese_nome')?.value || '').trim();
    const data = new Date().toLocaleDateString('pt-BR');
    const idade = (document.getElementById('anamnese_idade')?.value || '').trim();
    const numAtendimento = (document.getElementById('anamnese_num_atendimento')?.value || '').trim();

    localStorage.setItem('dadosAvaliacao', JSON.stringify({
      nome,
      data,
      idade,
      numAtendimento,
      secoes,
    }));
  } catch (error) {
    console.warn('[Resumo] Não foi possível armazenar o snapshot do resumo:', error);
  }
}
