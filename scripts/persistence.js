/**
 * Módulo de Persistência do Formulário
 * Salva e restaura o estado do formulário usando sessionStorage
 */

const STORAGE_KEY = 'formState';

/**
 * Salva o estado atual de todos os campos do formulário em sessionStorage
 */
export function salvarFormulario() {
  const main = document.querySelector('main');
  if (!main) return;

  const state = {};
  const elementos = main.querySelectorAll('input, textarea, select');

  elementos.forEach(el => {
    const key = el.name || el.id;
    if (!key) return;

    if (el.type === 'radio') {
      if (el.checked) {
        state[`radio:${key}`] = el.value;
      }
    } else if (el.type === 'checkbox') {
      const uniqueKey = `checkbox:${key}:${el.value}`;
      state[uniqueKey] = el.checked;
    } else {
      state[key] = el.value;
    }
  });

  // Salvar medicamentos adicionados dinamicamente
  const medicamentos = [];
  document.querySelectorAll('.medicamento-item').forEach(item => {
    const nome = item.querySelector('[id^="med_nome_"]');
    const justificativa = item.querySelector('[id^="med_justificativa_"]');
    const dose = item.querySelector('[id^="med_dose_"]');
    const tempo = item.querySelector('[id^="med_tempo_"]');
    medicamentos.push({
      nome: nome ? nome.value : '',
      justificativa: justificativa ? justificativa.value : '',
      dose: dose ? dose.value : '',
      tempo: tempo ? tempo.value : '',
    });
  });

  if (medicamentos.length > 0) {
    state['__medicamentos__'] = medicamentos;
  }

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('[Persistência] Erro ao salvar:', e);
  }
}

/**
 * Restaura o estado do formulário a partir do sessionStorage
 */
export function restaurarFormulario() {
  let state;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    state = JSON.parse(raw);
  } catch (e) {
    console.warn('[Persistência] Erro ao ler dados salvos:', e);
    return;
  }

  const main = document.querySelector('main');
  if (!main) return;

  // Restaurar campos de texto, textarea e select
  for (const [key, value] of Object.entries(state)) {
    if (key.startsWith('radio:') || key.startsWith('checkbox:') || key === '__medicamentos__') continue;

    const el = main.querySelector(`[name="${key}"], [id="${key}"]`);
    if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT')) {
      el.value = value;
    }
  }

  // Restaurar radio buttons
  for (const [key, value] of Object.entries(state)) {
    if (!key.startsWith('radio:')) continue;
    const name = key.substring(6);
    const radio = main.querySelector(`input[type="radio"][name="${name}"][value="${value}"]`);
    if (radio) radio.checked = true;
  }

  // Restaurar checkboxes
  for (const [key, value] of Object.entries(state)) {
    if (!key.startsWith('checkbox:')) continue;
    const parts = key.substring(9);
    const lastColon = parts.lastIndexOf(':');
    const name = parts.substring(0, lastColon);
    const cbValue = parts.substring(lastColon + 1);
    const cb = main.querySelector(`input[type="checkbox"][name="${name}"][value="${cbValue}"]`);
    if (cb) cb.checked = value;
  }
}

/**
 * Remove os dados salvos do sessionStorage
 */
export function limparFormularioSalvo() {
  sessionStorage.removeItem(STORAGE_KEY);
}
