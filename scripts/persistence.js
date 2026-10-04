/**
 * Módulo de Persistência do Formulário
 * Salva e restaura o estado do formulário usando localStorage, para que a
 * avaliação sobreviva ao fechamento da aba (comum no mobile quando o
 * navegador vai para segundo plano).
 */

const STORAGE_KEY = 'formState';

// Avaliações salvas há mais tempo que isso são descartadas (dados sensíveis)
const EXPIRACAO_MS = 12 * 60 * 60 * 1000;

/**
 * Lê o estado atual de todos os campos do formulário
 * @returns {Object} Mapa de chave → valor dos campos
 */
export function capturarEstado() {
  const main = document.querySelector('main');
  const state = {};
  if (!main) return state;

  main.querySelectorAll('input, textarea, select').forEach(el => {
    const key = el.name || el.id;
    if (!key) return;

    if (el.type === 'radio') {
      if (el.checked) {
        state[`radio:${key}`] = el.value;
      }
    } else if (el.type === 'checkbox') {
      state[`checkbox:${key}:${el.value}`] = el.checked;
    } else {
      state[key] = el.value;
    }
  });

  return state;
}

/**
 * Aplica um estado capturado por capturarEstado() aos campos do formulário
 * @param {Object} state - Estado a aplicar
 */
export function aplicarEstado(state) {
  const main = document.querySelector('main');
  if (!main || !state) return;

  for (const [key, value] of Object.entries(state)) {
    if (key.startsWith('radio:')) {
      const name = key.substring(6);
      const radio = main.querySelector(`input[type="radio"][name="${name}"][value="${value}"]`);
      if (radio) radio.checked = true;
    } else if (key.startsWith('checkbox:')) {
      const parts = key.substring(9);
      const lastColon = parts.lastIndexOf(':');
      const name = parts.substring(0, lastColon);
      const cbValue = parts.substring(lastColon + 1);
      const cb = Array.from(main.querySelectorAll(`input[type="checkbox"][name="${name}"]`))
        .find(c => c.value === cbValue);
      if (cb) cb.checked = value;
    } else {
      const el = main.querySelector(`[name="${key}"], [id="${key}"]`);
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT')) {
        el.value = value;
      }
    }
  }
}

/**
 * Salva o estado atual do formulário
 * @returns {boolean} true se salvou com sucesso
 */
export function salvarFormulario() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ savedAt: Date.now(), state: capturarEstado() }));
    return true;
  } catch (e) {
    console.warn('[Persistência] Erro ao salvar:', e);
    return false;
  }
}

/**
 * Lê a avaliação salva, migrando o formato antigo (sessionStorage) e
 * descartando avaliações expiradas
 * @returns {{savedAt: number, state: Object}|null}
 */
export function lerEstadoSalvo() {
  try {
    const legado = sessionStorage.getItem(STORAGE_KEY);
    if (legado && !localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ savedAt: Date.now(), state: JSON.parse(legado) }));
    }
    sessionStorage.removeItem(STORAGE_KEY);

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const salvo = JSON.parse(raw);
    if (!salvo?.state || Date.now() - salvo.savedAt > EXPIRACAO_MS) {
      limparFormularioSalvo();
      return null;
    }
    return salvo;
  } catch (e) {
    console.warn('[Persistência] Erro ao ler dados salvos:', e);
    return null;
  }
}

/**
 * Restaura o estado do formulário salvo
 * @returns {{savedAt: number, state: Object}|null} A avaliação restaurada, se havia uma
 */
export function restaurarFormulario() {
  const salvo = lerEstadoSalvo();
  if (salvo) aplicarEstado(salvo.state);
  return salvo;
}

/**
 * Remove os dados salvos
 */
export function limparFormularioSalvo() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('[Persistência] Erro ao limpar:', e);
  }
}
