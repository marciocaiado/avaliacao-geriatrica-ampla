/**
 * Módulo de Constantes
 * Centraliza todas as constantes da aplicação
 */

// Campos por escala
export const camposAVDInstrumentais = ['q3', 'q4', 'q5'];
export const camposFuncionais = ['q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15', 'q16', 'q17', 'q18', 'q19', 'q20'];
export const camposIVCF = ['idade', 'percepcao', ...camposAVDInstrumentais, ...camposFuncionais];
export const camposMAN = ['man1', 'man2', 'man3', 'man4', 'man5', 'man6'];
export const camposLawton = ['lw1', 'lw2', 'lw3', 'lw4', 'lw5', 'lw6', 'lw7', 'lw8', 'lw9'];
export const camposFrail = ['frail_fadiga', 'frail_resistencia', 'frail_deambulacao', 'frail_doencas', 'frail_peso'];
export const camposSarcF = ['sarcf1', 'sarcf2', 'sarcf3', 'sarcf4', 'sarcf5'];
export const camposBarthel = [
  'barthel_alimentacao', 'barthel_banho', 'barthel_vestuario', 'barthel_higiene',
  'barthel_evacuacoes', 'barthel_miccao', 'barthel_vaso', 'barthel_transfer',
  'barthel_deambulacao', 'barthel_escadas'
];
export const camposKatz = ['katz_banho', 'katz_vestir', 'katz_banheiro', 'katz_mobilidade', 'katz_continencia', 'katz_alimentacao'];
export const camposGDS = Array.from({ length: 15 }, (_, i) => `gds${i + 1}`);
export const camposApgar = ['apgar_a', 'apgar_p', 'apgar_g', 'apgar_af', 'apgar_r'];
export const camposPfeffer = Array.from({ length: 11 }, (_, index) => `pf${index + 1}`);
export const campos10CSOrientacao = ['cs_orient_ano', 'cs_orient_mes', 'cs_orient_data'];
export const campos10CSMemoria = ['cs_mem_vaso', 'cs_mem_carro', 'cs_mem_tijolo'];
export const campos10CS = [...campos10CSOrientacao, ...campos10CSMemoria, 'cs_fluencia', 'cs_escolaridade'];
export const camposZucchelli = ['zuc_idade', 'zuc_demencia', 'zuc_auditivo', 'zuc_psicotropicos'];
export const camposCAM = ['cam1', 'cam2', 'cam3', 'cam4'];

// IDs dos elementos de resultado
export const resultadoIds = [
  'resultado-srh', 'resultado-ivcf', 'resultado-cfs', 'resultado-frail',
  'resultado-sarcf', 'resultado-barthel', 'resultado-katz', 'resultado-lawton',
  'resultado-pfeffer', 'resultado-man', 'resultado-10cs', 'resultado-zucchelli',
  'resultado-cam', 'resultado-gds', 'resultado-apgar'
];

// Constantes do modal de fluência
export const MAX_SECONDS = 60;
