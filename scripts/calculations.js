/**
 * Módulo de Cálculos
 * Contém todas as funções de cálculo das escalas geriátricas
 */

import { getFormData, somarCampos, contarRespostas } from './utils.js';
import * as constants from './constants.js';

/**
 * Calcula o IVCF-20
 */
export function calcularIVCF() {
  const fd = getFormData(constants);
  const respondidas = contarRespostas(fd, constants.camposIVCF);
  if (!respondidas) return null;

  const totalPerguntas = constants.camposIVCF.length;
  const completo = respondidas === totalPerguntas;
  let total = 0;

  total += parseInt(fd.get('idade') ?? '0', 10);
  total += parseInt(fd.get('percepcao') ?? '0', 10);
  total += Math.min(4, somarCampos(fd, constants.camposAVDInstrumentais));
  total += somarCampos(fd, constants.camposFuncionais);

  let risco = null;
  if (total <= 6) risco = 'Baixa (0–6)';
  else if (total <= 14) risco = 'Moderada (7–14)';
  else risco = 'Alta vulnerabilidade (≥15)';

  return { pontos: total, risco, respondidas, totalPerguntas, completo };
}

/**
 * Calcula a SRH (Pergunta Única Global)
 */
export function calcularSRH() {
  const fd = getFormData(constants);
  const valor = fd.get('srh');
  if (valor === null) return null;

  const descricao = parseInt(valor, 10) === 0 ? 'Boa/Muito boa/Excelente' : 'Regular/Ruim';
  return { descricao };
}

/**
 * Calcula o MAN (Mini Avaliação Nutricional)
 */
export function calcularMAN() {
  const fd = getFormData(constants);
  const respondidas = contarRespostas(fd, constants.camposMAN);
  if (!respondidas) return null;

  const totalPerguntas = constants.camposMAN.length;
  const completo = respondidas === totalPerguntas;
  const pontos = somarCampos(fd, constants.camposMAN);

  let classe = null;
  if (pontos >= 12) classe = 'Estado nutricional normal (12–14)';
  else if (pontos >= 8) classe = 'Risco de desnutrição (8–11)';
  else classe = 'Desnutrido (0–7)';

  return { pontos, classe, respondidas, totalPerguntas, completo };
}

/**
 * Calcula o Pfeffer
 */
export function calcularPfeffer() {
  const fd = getFormData(constants);
  const respondidas = contarRespostas(fd, constants.camposPfeffer);
  if (!respondidas) return null;

  const totalPerguntas = constants.camposPfeffer.length;
  const completo = respondidas === totalPerguntas;
  const pontos = somarCampos(fd, constants.camposPfeffer);
  const interpretacao = (pontos >= 6 ? 'Sugere declínio funcional (≥6)' : 'Sem evidência de declínio (<6)');

  return { pontos, interpretacao, respondidas, totalPerguntas, completo };
}

/**
 * Calcula o 10-CS (10-point Cognitive Screener)
 */
export function calcular10CS() {
  const fd = getFormData(constants);
  const respondidas = contarRespostas(fd, constants.campos10CS);
  if (!respondidas) return null;

  const totalPerguntas = constants.campos10CS.length;
  const completo = respondidas === totalPerguntas;

  let total = 0;
  total += somarCampos(fd, constants.campos10CSOrientacao);
  total += parseInt(fd.get('cs_fluencia') ?? '0', 10);
  total += somarCampos(fd, constants.campos10CSMemoria);
  total += parseInt(fd.get('cs_escolaridade') ?? '0', 10);

  let interpretacao = null;
  if (total >= 8) interpretacao = 'Normal (≥ 8 pontos)';
  else if (total >= 6) interpretacao = 'Possível comprometimento (6–7 pontos)';
  else interpretacao = 'Provável comprometimento (0–5 pontos)';

  return { pontos: total, interpretacao, respondidas, totalPerguntas, completo };
}

/**
 * Calcula a Escala Clínica de Fragilidade (CFS)
 */
export function calcularCFS() {
  const el = document.querySelector('input[name="cfs"]:checked');
  if (!el) return null;

  const v = parseInt(el.value, 10);
  const descs = {
    1: 'Muito ativo',
    2: 'Ativo',
    3: 'Regular',
    4: 'Vulnerável',
    5: 'Levemente frágil',
    6: 'Moderadamente frágil',
    7: 'Muito frágil',
    8: 'Severamente frágil',
    9: 'Doente terminal'
  };

  return { valor: v, descricao: descs[v] ?? '' };
}

/**
 * Calcula a Escala de Lawton
 */
export function calcularLawton() {
  const fd = getFormData(constants);
  const respondidas = contarRespostas(fd, constants.camposLawton);
  if (!respondidas) return null;

  const totalPerguntas = constants.camposLawton.length;
  const completo = respondidas === totalPerguntas;
  const pontos = somarCampos(fd, constants.camposLawton);

  let classificacao = '';
  if (pontos === 9) classificacao = 'Totalmente dependente';
  else if (pontos >= 10 && pontos <= 15) classificacao = 'Dependência grave';
  else if (pontos >= 16 && pontos <= 20) classificacao = 'Dependência moderada';
  else if (pontos >= 21 && pontos <= 25) classificacao = 'Dependência leve';
  else if (pontos >= 26) classificacao = 'Independente';

  return { pontos, classificacao, respondidas, totalPerguntas, completo };
}

/**
 * Calcula a Escala de Zucchelli
 */
export function calcularZucchelli() {
  const fd = getFormData(constants);
  const respondidas = contarRespostas(fd, constants.camposZucchelli);
  if (!respondidas) return null;

  const totalPerguntas = constants.camposZucchelli.length;
  const completo = respondidas === totalPerguntas;
  const pontos = somarCampos(fd, constants.camposZucchelli);
  const risco = pontos >= 3 ? 'Alto risco de delirium (≥3)' : 'Risco não elevado (<3)';

  return { pontos, risco, respondidas, totalPerguntas, completo };
}

/**
 * Calcula o CAM (Confusion Assessment Method)
 */
export function calcularCAM() {
  const fd = getFormData(constants);
  const respondidas = contarRespostas(fd, constants.camposCAM);
  if (!respondidas) return null;

  const totalPerguntas = constants.camposCAM.length;
  const completo = respondidas === totalPerguntas;

  const v1 = parseInt(fd.get('cam1') ?? '0', 10) === 1;
  const v2 = parseInt(fd.get('cam2') ?? '0', 10) === 1;
  const v3 = parseInt(fd.get('cam3') ?? '0', 10) === 1;
  const v4 = parseInt(fd.get('cam4') ?? '0', 10) === 1;

  const camPositivo = v1 && v2 && (v3 || v4);
  const status = camPositivo ? 'Delirium provável (CAM positivo)' : 'CAM negativo';

  return { status, respondidas, totalPerguntas, completo, camPositivo };
}

/**
 * Calcula a Escala FRAIL
 */
export function calcularFrail() {
  const fd = getFormData(constants);
  const respondidas = contarRespostas(fd, constants.camposFrail);
  if (!respondidas) return null;

  const totalPerguntas = constants.camposFrail.length;
  const completo = respondidas === totalPerguntas;
  const pontos = somarCampos(fd, constants.camposFrail);

  let classificacao = null;
  if (pontos >= 3) classificacao = 'Frágil (3-5 pontos)';
  else if (pontos >= 1) classificacao = 'Pré-frágil (1-2 pontos)';
  else classificacao = 'Robusto (0 ponto)';

  return { pontos, classificacao, respondidas, totalPerguntas, completo };
}

/**
 * Calcula o SARC-F
 */
export function calcularSarcF() {
  const fd = getFormData(constants);
  const respondidas = contarRespostas(fd, constants.camposSarcF);
  if (!respondidas) return null;

  const totalPerguntas = constants.camposSarcF.length;
  const completo = respondidas === totalPerguntas;
  const pontos = somarCampos(fd, constants.camposSarcF);
  const risco = (pontos >= 4 ? 'Risco de sarcopenia (≥4)' : 'Sem risco (<4)');

  return { pontos, risco, respondidas, totalPerguntas, completo };
}

/**
 * Calcula o Índice de Barthel
 */
export function calcularBarthel() {
  const fd = getFormData(constants);
  const respondidas = contarRespostas(fd, constants.camposBarthel);
  if (!respondidas) return null;

  const totalPerguntas = constants.camposBarthel.length;
  const completo = respondidas === totalPerguntas;
  const pontos = somarCampos(fd, constants.camposBarthel);

  let classificacao = null;
  if (pontos < 20) classificacao = 'Dependência total (<20)';
  else if (pontos <= 35) classificacao = 'Dependência grave (20-35)';
  else if (pontos <= 55) classificacao = 'Dependência moderada (40-55)';
  else if (pontos <= 95) classificacao = 'Dependência leve (60-95)';
  else classificacao = 'Independente (100)';

  return { pontos, classificacao, respondidas, totalPerguntas, completo };
}

/**
 * Calcula a Escala de Katz
 */
export function calcularKatz() {
  const fd = getFormData(constants);
  const respondidas = contarRespostas(fd, constants.camposKatz);
  if (!respondidas) return null;

  const totalPerguntas = constants.camposKatz.length;
  const completo = respondidas === totalPerguntas;
  const pontos = somarCampos(fd, constants.camposKatz);

  let classificacao = '';
  if (pontos === 6) classificacao = 'Independente';
  else if (pontos >= 4) classificacao = 'Dependência moderada';
  else classificacao = 'Dependência severa';

  return { pontos, classificacao, respondidas, totalPerguntas, completo };
}

/**
 * Calcula o GDS-15 (Escala de Depressão Geriátrica)
 */
export function calcularGDS() {
  const fd = getFormData(constants);
  const respondidas = contarRespostas(fd, constants.camposGDS);
  if (!respondidas) return null;

  const totalPerguntas = constants.camposGDS.length;
  const completo = respondidas === totalPerguntas;
  const pontos = somarCampos(fd, constants.camposGDS);

  let classificacao = null;
  if (pontos <= 5) classificacao = 'Normal (0-5 pontos)';
  else if (pontos <= 10) classificacao = 'Depressão leve (6-10 pontos)';
  else classificacao = 'Depressão severa (11-15 pontos)';

  return { pontos, classificacao, respondidas, totalPerguntas, completo };
}

/**
 * Calcula o APGAR da Família
 */
export function calcularApgar() {
  const fd = getFormData(constants);
  const respondidas = contarRespostas(fd, constants.camposApgar);
  if (!respondidas) return null;

  const totalPerguntas = constants.camposApgar.length;
  const completo = respondidas === totalPerguntas;
  const pontos = somarCampos(fd, constants.camposApgar);

  let classificacao = null;
  if (pontos <= 3) classificacao = 'Disfuncional (0-3 pontos)';
  else if (pontos <= 6) classificacao = 'Moderadamente disfuncional (4-6 pontos)';
  else classificacao = 'Funcional (7-10 pontos)';

  return { pontos, classificacao, respondidas, totalPerguntas, completo };
}
