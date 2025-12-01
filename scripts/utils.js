/**
 * Módulo de Utilitários
 * Funções auxiliares reutilizáveis
 */

/**
 * Obtém o valor do radio button selecionado
 * @param {string} name - Nome do grupo de radio buttons
 * @returns {string|null} Valor selecionado ou null
 */
export function getCheckedValue(name) {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : null;
}

/**
 * Coleta valores de radio buttons e adiciona ao FormData
 * @param {FormData} fd - Objeto FormData
 * @param {string[]} names - Array de nomes dos campos
 */
export function collectFromNames(fd, names) {
  names.forEach((n) => {
    const v = getCheckedValue(n);
    if (v !== null) fd.set(n, v);
  });
}

/**
 * Obtém todos os dados dos formulários
 * @param {Object} constants - Objeto com as constantes dos campos
 * @returns {FormData} FormData com todos os dados coletados
 */
export function getFormData(constants = {}) {
  const fd = new FormData();
  const formElement = document.getElementById('form-ivcf');
  const formFuncional = document.getElementById('form-funcional');

  if (formElement) new FormData(formElement).forEach((v, k) => fd.set(k, v));
  if (formFuncional) new FormData(formFuncional).forEach((v, k) => fd.set(k, v));

  // Coletar campos específicos se as constantes foram fornecidas
  if (constants.camposMAN && constants.camposFrail && constants.camposSarcF &&
      constants.camposGDS && constants.camposApgar && constants.campos10CS) {
    collectFromNames(fd, [
      ...constants.camposMAN,
      ...constants.camposFrail,
      ...constants.camposSarcF,
      ...constants.camposGDS,
      ...constants.camposApgar,
      ...constants.campos10CS
    ]);
  }

  if (constants.camposZucchelli) {
    collectFromNames(fd, constants.camposZucchelli);
  }

  if (constants.camposCAM) {
    collectFromNames(fd, constants.camposCAM);
  }

  return fd;
}

/**
 * Soma os valores dos campos especificados
 * @param {FormData} fd - FormData contendo os valores
 * @param {string[]} campos - Array de nomes dos campos a somar
 * @returns {number} Soma dos valores
 */
export function somarCampos(fd, campos) {
  return campos.reduce((total, campo) => total + parseInt(fd.get(campo) ?? '0', 10), 0);
}

/**
 * Conta quantos campos foram respondidos
 * @param {FormData} fd - FormData contendo os valores
 * @param {string[]} campos - Array de nomes dos campos
 * @returns {number} Quantidade de respostas
 */
export function contarRespostas(fd, campos) {
  return campos.reduce((total, campo) => total + (fd.get(campo) !== null ? 1 : 0), 0);
}

/**
 * Reseta radio buttons pelos nomes dos campos
 * @param {string[]} names - Array de nomes dos campos
 */
export function resetRadiosByNames(names) {
  names.forEach((nome) => {
    document.querySelectorAll(`input[name="${nome}"]`).forEach((el) => {
      if (el instanceof HTMLInputElement && el.type === 'radio') el.checked = false;
    });
  });
}

/**
 * Formata entrada de data automaticamente (DD/MM/AAAA)
 * @param {HTMLInputElement} input - Elemento de input
 */
export function formatDateInput(input) {
  input.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número

    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    if (value.length >= 5) {
      value = value.substring(0, 5) + '/' + value.substring(5, 9);
    }

    e.target.value = value;
  });
}

/**
 * Calcula a idade a partir de uma data de nascimento
 * @param {string} birthDateString - Data no formato DD/MM/AAAA
 * @returns {string} Idade ou string vazia se inválida
 */
export function calculateAge(birthDateString) {
  const parts = birthDateString.split('/');
  if (parts.length !== 3) return '';

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  if (isNaN(day) || isNaN(month) || isNaN(year) || year < 1900 || year > new Date().getFullYear()) return '';

  const birthDate = new Date(year, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age.toString() : '';
}
