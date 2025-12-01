// Referências de formulário
const formElement = document.getElementById('form-ivcf');
const formFuncional = document.getElementById('form-funcional');

// Constantes de campos por escala
const camposAVDInstrumentais = ['q3', 'q4', 'q5'];
const camposFuncionais = ['q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15', 'q16', 'q17', 'q18', 'q19', 'q20'];
const camposIVCF = ['idade', 'percepcao', ...camposAVDInstrumentais, ...camposFuncionais];
const camposMAN = ['man1', 'man2', 'man3', 'man4', 'man5', 'man6'];
const camposLawton = ['lw1', 'lw2', 'lw3', 'lw4', 'lw5', 'lw6', 'lw7', 'lw8', 'lw9'];
const camposFrail = ['frail_fadiga', 'frail_resistencia', 'frail_deambulacao', 'frail_doencas', 'frail_peso'];
const camposSarcF = ['sarcf1', 'sarcf2', 'sarcf3', 'sarcf4', 'sarcf5'];
const camposBarthel = [
  'barthel_alimentacao', 'barthel_banho', 'barthel_vestuario', 'barthel_higiene',
  'barthel_evacuacoes', 'barthel_miccao', 'barthel_vaso', 'barthel_transfer',
  'barthel_deambulacao', 'barthel_escadas'
];
const camposKatz = ['katz_banho', 'katz_vestir', 'katz_banheiro', 'katz_mobilidade', 'katz_continencia', 'katz_alimentacao'];
const camposGDS = Array.from({ length: 15 }, (_, i) => `gds${i + 1}`);
const camposApgar = ['apgar_a', 'apgar_p', 'apgar_g', 'apgar_af', 'apgar_r'];
const camposPfeffer = Array.from({ length: 11 }, (_, index) => `pf${index + 1}`);
const campos10CSOrientacao = ['cs_orient_ano', 'cs_orient_mes', 'cs_orient_data'];
const campos10CSMemoria = ['cs_mem_vaso', 'cs_mem_carro', 'cs_mem_tijolo'];
const campos10CS = [...campos10CSOrientacao, ...campos10CSMemoria, 'cs_fluencia', 'cs_escolaridade'];
const camposZucchelli = ['zuc_idade', 'zuc_demencia', 'zuc_auditivo', 'zuc_psicotropicos'];
const camposCAM = ['cam1', 'cam2', 'cam3', 'cam4'];
const resultadoIds = ['resultado-srh', 'resultado-ivcf', 'resultado-cfs', 'resultado-frail', 'resultado-sarcf', 'resultado-barthel', 'resultado-katz', 'resultado-lawton', 'resultado-pfeffer', 'resultado-man', 'resultado-10cs', 'resultado-zucchelli', 'resultado-cam', 'resultado-gds', 'resultado-apgar'];
const resumoElement = () => document.getElementById('resumo-tests');

// Utilitários
function getCheckedValue(name) {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : null;
}

function collectFromNames(fd, names) {
  names.forEach((n) => {
    const v = getCheckedValue(n);
    if (v !== null) fd.set(n, v);
  });
}

function getFormData() {
  const fd = new FormData();
  if (formElement) new FormData(formElement).forEach((v, k) => fd.set(k, v));
  if (formFuncional) new FormData(formFuncional).forEach((v, k) => fd.set(k, v));
  collectFromNames(fd, [...camposMAN, ...camposFrail, ...camposSarcF, ...camposGDS, ...camposApgar, ...campos10CS]);
  collectFromNames(fd, camposZucchelli);
  collectFromNames(fd, camposCAM);
  return fd;
}

function somarCampos(fd, campos) {
  return campos.reduce((total, campo) => total + parseInt(fd.get(campo) ?? '0', 10), 0);
}

function contarRespostas(fd, campos) {
  return campos.reduce((total, campo) => total + (fd.get(campo) !== null ? 1 : 0), 0);
}

function exibirResultado(elementId, calcular, formatar, shouldScroll = false) {
  const container = document.getElementById(elementId);
  if (!container) return;
  const resultado = calcular();
  container.innerHTML = resultado ? formatar(resultado).trim() : '';
  atualizarResumo();
  if (shouldScroll && resultado) container.scrollIntoView({ behavior: 'smooth' });
}

function limparResultados() {
  resultadoIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '';
  });
  atualizarResumo();
}

function atualizarResumo() {
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

// Cálculos e exibições (mesma lógica já existente)
function calcularIVCF() {
  const fd = getFormData();
  const respondidas = contarRespostas(fd, camposIVCF);
  if (!respondidas) return null;
  const totalPerguntas = camposIVCF.length;
  const completo = respondidas === totalPerguntas;
  let total = 0;
  total += parseInt(fd.get('idade') ?? '0', 10);
  total += parseInt(fd.get('percepcao') ?? '0', 10);
  total += Math.min(4, somarCampos(fd, camposAVDInstrumentais));
  total += somarCampos(fd, camposFuncionais);
  let risco = null;
  // Exibe classificação baseada na pontuação atual, mesmo parcial
  if (total <= 6) risco = 'Baixa (0–6)';
  else if (total <= 14) risco = 'Moderada (7–14)';
  else risco = 'Alta vulnerabilidade (≥15)';
  return { pontos: total, risco, respondidas, totalPerguntas, completo };
}

function mostrarIVCF() {
  exibirResultado('resultado-ivcf', calcularIVCF, ({ pontos, risco, respondidas, totalPerguntas, completo }) => {
    const progresso = `<div class="score">Respostas: ${respondidas}/${totalPerguntas}</div>`;
    const cabecalho = `<div><strong>${completo ? 'IVCF-20' : 'IVCF-20 (parcial)'}:</strong> ${pontos} pontos</div>`;
    const classificacao = `<div class="score"><strong>Classificação:</strong> ${risco}</div>`;
    return `${cabecalho}${classificacao}${progresso}`;
  });
}

function calcularSRH() {
  const fd = getFormData();
  const valor = fd.get('srh');
  if (valor === null) {
    return null;
  }
  const descricao = parseInt(valor, 10) === 0 ? 'Boa/Muito boa/Excelente' : 'Regular/Ruim';
  return { descricao };
}

function mostrarSRH() {
  exibirResultado('resultado-srh', calcularSRH, ({ descricao }) => `
    <div><strong>SRH:</strong> ${descricao}</div>
  `);
}

function calcularMAN() {
  const fd = getFormData();
  const respondidas = contarRespostas(fd, camposMAN);
  if (!respondidas) return null;
  const totalPerguntas = camposMAN.length;
  const completo = respondidas === totalPerguntas;
  const pontos = somarCampos(fd, camposMAN);
  let classe = null;
  // Classificação exibida conforme a pontuação atual
  if (pontos >= 12) classe = 'Estado nutricional normal (12–14)';
  else if (pontos >= 8) classe = 'Risco de desnutrição (8–11)';
  else classe = 'Desnutrido (0–7)';
  return { pontos, classe, respondidas, totalPerguntas, completo };
}

function mostrarMAN() {
  exibirResultado('resultado-man', calcularMAN, ({ pontos, classe, respondidas, totalPerguntas, completo }) => {
    const progresso = `<div class="score">Respostas: ${respondidas}/${totalPerguntas}</div>`;
    return `
      <div><strong>${completo ? 'MAN' : 'MAN (parcial)'}:</strong> ${pontos} pontos - ${classe}</div>
      <div class="help"><strong>Interpretação (MAN):</strong> ≥ 12 pontos: Estado nutricional normal; 8–11 pontos: Risco de desnutrição; 0–7 pontos: Desnutrido.</div>
      ${progresso}
    `;
  });
}

function calcularPfeffer() {
  const fd = getFormData();
  const respondidas = contarRespostas(fd, camposPfeffer);
  if (!respondidas) return null;
  const totalPerguntas = camposPfeffer.length;
  const completo = respondidas === totalPerguntas;
  const pontos = somarCampos(fd, camposPfeffer);
  const interpretacao = (pontos >= 6 ? 'Sugere declínio funcional (≥6)' : 'Sem evidência de declínio (<6)');
  return { pontos, interpretacao, respondidas, totalPerguntas, completo };
}

function mostrarPfeffer() {
  exibirResultado('resultado-pfeffer', calcularPfeffer, ({ pontos, interpretacao, respondidas, totalPerguntas, completo }) => {
    const progresso = `<div class="score">Respostas: ${respondidas}/${totalPerguntas}</div>`;
    const legenda = `
      <div class="help"><strong>Interpretação (Pfeffer):</strong> ≥ 6 sugere declínio funcional; < 6 sem evidência de declínio.</div>
    `;
    return `
      <div><strong>${completo ? 'Pfeffer' : 'Pfeffer (parcial)'}:</strong> ${pontos} pontos — ${interpretacao}</div>
      ${legenda}
      ${progresso}
    `;
  });
}

function calcular10CS() {
  const fd = getFormData();
  const respondidas = contarRespostas(fd, campos10CS);
  if (!respondidas) return null;
  const totalPerguntas = campos10CS.length;
  const completo = respondidas === totalPerguntas;
  let total = 0;
  total += somarCampos(fd, campos10CSOrientacao);
  total += parseInt(fd.get('cs_fluencia') ?? '0', 10);
  total += somarCampos(fd, campos10CSMemoria);
  total += parseInt(fd.get('cs_escolaridade') ?? '0', 10);
  let interpretacao = null;
  // Sempre classifica pela pontuação atual
  if (total >= 8) interpretacao = 'Normal (≥ 8 pontos)';
  else if (total >= 6) interpretacao = 'Possível comprometimento (6–7 pontos)';
  else interpretacao = 'Provável comprometimento (0–5 pontos)';
  return { pontos: total, interpretacao, respondidas, totalPerguntas, completo };
}

function mostrar10CS() {
  exibirResultado('resultado-10cs', calcular10CS, ({ pontos, interpretacao, respondidas, totalPerguntas, completo }) => {
    const progresso = `<div class="score">Respostas: ${respondidas}/${totalPerguntas}</div>`;
    const legenda = `
      <div class="help">
        <strong>Interpretação 10-CS:</strong><br />
        Normal (≥ 8 pontos)<br />
        Possível comprometimento (6–7 pontos)<br />
        Provável comprometimento (0–5 pontos)
      </div>
    `;
    return `
      <div><strong>${completo ? '10-CS' : '10-CS (parcial)'}:</strong> ${pontos} pontos — ${interpretacao}</div>
      ${legenda}
      ${progresso}
    `;
  });
}

function mostrarCFS() {
  exibirResultado('resultado-cfs', () => {
    const el = document.querySelector('input[name="cfs"]:checked');
    if (!el) return null;
    const v = parseInt(el.value, 10);
    const descs = { 1: 'Muito ativo', 2: 'Ativo', 3: 'Regular', 4: 'Vulnerável', 5: 'Levemente frágil', 6: 'Moderadamente frágil', 7: 'Muito frágil', 8: 'Severamente frágil', 9: 'Doente terminal' };
    return { valor: v, descricao: descs[v] ?? '' };
  }, ({ valor, descricao }) => `
    <div><strong>Escala Clínica de Fragilidade (CFS):</strong> Opção ${valor} - ${descricao}</div>
    <div class="score"><strong>Classificação:</strong> ${descricao}</div>
    <div class="help"><strong>Escala CFS (1–9):</strong> 1 Muito ativo; 2 Ativo; 3 Regular; 4 Vulnerável; 5 Levemente frágil; 6 Moderadamente frágil; 7 Muito frágil; 8 Severamente frágil; 9 Doente terminal.</div>
  `);
}

function calcularLawton() {
  const fd = getFormData();
  const respondidas = contarRespostas(fd, camposLawton);
  if (!respondidas) return null;
  const totalPerguntas = camposLawton.length;
  const completo = respondidas === totalPerguntas;
  const pontos = somarCampos(fd, camposLawton);
  let classificacao = '';
  if (pontos === 9) classificacao = 'Totalmente dependente';
  else if (pontos >= 10 && pontos <= 15) classificacao = 'Dependência grave';
  else if (pontos >= 16 && pontos <= 20) classificacao = 'Dependência moderada';
  else if (pontos >= 21 && pontos <= 25) classificacao = 'Dependência leve';
  else if (pontos >= 26) classificacao = 'Independente';
  return { pontos, classificacao, respondidas, totalPerguntas, completo };
}

function mostrarLawton() {
  exibirResultado('resultado-lawton', calcularLawton, ({ pontos, classificacao, respondidas, totalPerguntas, completo }) => {
    const progresso = `<div class="score">Respostas: ${respondidas}/${totalPerguntas}</div>`;
    const legenda = `
      <div class="help">
        <strong>Interpretação (Lawton):</strong><br />
        9 pontos – totalmente dependente;<br />
        10 a 15 pontos – dependência grave;<br />
        16 a 20 pontos – dependência moderada;<br />
        21 a 25 pontos – dependência leve;<br />
        25 a 27 pontos – independente.
      </div>
    `;
    return `
      <div><strong>${completo ? 'Lawton' : 'Lawton (parcial)'}:</strong> ${pontos} pontos</div>
      <div class="score"><strong>Classificação:</strong> ${classificacao}</div>
      ${legenda}
      ${progresso}
    `;
  });
}

function calcularZucchelli() {
  const fd = getFormData();
  const respondidas = contarRespostas(fd, camposZucchelli);
  if (!respondidas) return null;
  const totalPerguntas = camposZucchelli.length;
  const completo = respondidas === totalPerguntas;
  const pontos = somarCampos(fd, camposZucchelli);
  const risco = pontos >= 3 ? 'Alto risco de delirium (≥3)' : 'Risco não elevado (<3)';
  return { pontos, risco, respondidas, totalPerguntas, completo };
}

function mostrarZucchelli() {
  exibirResultado('resultado-zucchelli', calcularZucchelli, ({ pontos, risco, respondidas, totalPerguntas, completo }) => {
    const progresso = `<div class="score">Respostas: ${respondidas}/${totalPerguntas}</div>`;
    const legenda = `
      <div class="help">
        Pacientes com pontuação ≥ 3 pontos têm alto risco de delirium.
      </div>
    `;
    return `
      <div><strong>${completo ? 'Zucchelli' : 'Zucchelli (parcial)'}:</strong> ${pontos} pontos</div>
      <div class="score"><strong>Classificação:</strong> ${risco}</div>
      ${legenda}
      ${progresso}
    `;
  });
}

function calcularCAM() {
  const fd = getFormData();
  const respondidas = contarRespostas(fd, camposCAM);
  if (!respondidas) return null;
  const totalPerguntas = camposCAM.length;
  const completo = respondidas === totalPerguntas;
  const v1 = parseInt(fd.get('cam1') ?? '0', 10) === 1;
  const v2 = parseInt(fd.get('cam2') ?? '0', 10) === 1;
  const v3 = parseInt(fd.get('cam3') ?? '0', 10) === 1;
  const v4 = parseInt(fd.get('cam4') ?? '0', 10) === 1;
  const camPositivo = v1 && v2 && (v3 || v4);
  const status = camPositivo ? 'Delirium provável (CAM positivo)' : 'CAM negativo';
  return { status, respondidas, totalPerguntas, completo, camPositivo };
}

function mostrarCAM() {
  exibirResultado('resultado-cam', calcularCAM, ({ status, respondidas, totalPerguntas, completo }) => {
    const progresso = `<div class="score">Respostas: ${respondidas}/${totalPerguntas}</div>`;
    const legenda = `
      <div class="help">O diagnóstico de delirium requer: (1) Início agudo/curso flutuante E (2) Desatenção E (3) Pensamento desorganizado OU (4) Alteração do nível de consciência.</div>
    `;
    return `
      <div><strong>${completo ? 'CAM' : 'CAM (parcial)'}:</strong> ${status}</div>
      ${legenda}
      ${progresso}
    `;
  });
}

function calcularFrail() {
  const fd = getFormData();
  const respondidas = contarRespostas(fd, camposFrail);
  if (!respondidas) return null;
  const totalPerguntas = camposFrail.length;
  const completo = respondidas === totalPerguntas;
  const pontos = somarCampos(fd, camposFrail);
  let classificacao = null;
  // Classificação com base nos pontos atuais
  if (pontos >= 3) classificacao = 'Frágil (3-5 pontos)';
  else if (pontos >= 1) classificacao = 'Pré-frágil (1-2 pontos)';
  else classificacao = 'Robusto (0 ponto)';
  return { pontos, classificacao, respondidas, totalPerguntas, completo };
}

function mostrarFrail() {
  exibirResultado('resultado-frail', calcularFrail, ({ pontos, classificacao, respondidas, totalPerguntas, completo }) => {
    const progresso = `<div class="score">Respostas: ${respondidas}/${totalPerguntas}</div>`;
    const legenda = `
      <div class="help">
        <strong>Interpretação (FRAIL):</strong><br />
        Frágil: 3-5 pontos<br />
        Pré-frágil: 1-2 pontos<br />
        Robusto: 0 ponto
      </div>
    `;
    return `
      <div><strong>${completo ? 'FRAIL' : 'FRAIL (parcial)'}:</strong> ${pontos} pontos</div>
      <div class="score"><strong>Classificação:</strong> ${classificacao}</div>
      ${legenda}
      ${progresso}
    `;
  });
}

function calcularSarcF() {
  const fd = getFormData();
  const respondidas = contarRespostas(fd, camposSarcF);
  if (!respondidas) return null;
  const totalPerguntas = camposSarcF.length;
  const completo = respondidas === totalPerguntas;
  const pontos = somarCampos(fd, camposSarcF);
  const risco = (pontos >= 4 ? 'Risco de sarcopenia (≥4)' : 'Sem risco (<4)');
  return { pontos, risco, respondidas, totalPerguntas, completo };
}

function mostrarSarcF() {
  exibirResultado('resultado-sarcf', calcularSarcF, ({ pontos, risco, respondidas, totalPerguntas, completo }) => {
    const progresso = `<div class="score">Respostas: ${respondidas}/${totalPerguntas}</div>`;
    const legenda = `
      <div class="help">
        <strong>Corte SARC-F:</strong> pontuação maior ou igual a 4 indica risco de sarcopenia.
      </div>
    `;
    return `
      <div><strong>${completo ? 'SARC-F' : 'SARC-F (parcial)'}:</strong> ${pontos} pontos</div>
      <div class="score"><strong>Classificação:</strong> ${risco}</div>
      ${legenda}
      ${progresso}
    `;
  });
}

function calcularBarthel() {
  const fd = getFormData();
  const respondidas = contarRespostas(fd, camposBarthel);
  if (!respondidas) return null;
  const totalPerguntas = camposBarthel.length;
  const completo = respondidas === totalPerguntas;
  const pontos = somarCampos(fd, camposBarthel);
  let classificacao = null;
  // Classificação conforme pontuação atual
  if (pontos < 20) classificacao = 'Dependência total (<20)';
  else if (pontos <= 35) classificacao = 'Dependência grave (20-35)';
  else if (pontos <= 55) classificacao = 'Dependência moderada (40-55)';
  else if (pontos <= 95) classificacao = 'Dependência leve (60-95)';
  else classificacao = 'Independente (100)';
  return { pontos, classificacao, respondidas, totalPerguntas, completo };
}

function mostrarBarthel() {
  exibirResultado('resultado-barthel', calcularBarthel, ({ pontos, classificacao, respondidas, totalPerguntas, completo }) => {
    const progresso = `<div class="score">Respostas: ${respondidas}/${totalPerguntas}</div>`;
    const legenda = `
      <div class="help">
        <strong>Classificação (Índice de Barthel):</strong><br />
        < 20: Dependência total<br />
        20 a 35: Dependência grave<br />
        40 a 55: Dependência moderada<br />
        60 a 95: Dependência leve<br />
        100: Independente
      </div>
    `;
    return `
      <div><strong>${completo ? 'Barthel' : 'Barthel (parcial)'}:</strong> ${pontos} pontos</div>
      <div class="score"><strong>Classificação:</strong> ${classificacao}</div>
      ${legenda}
      ${progresso}
    `;
  });
}

function calcularKatz() {
  const fd = getFormData();
  const respondidas = contarRespostas(fd, camposKatz);
  if (!respondidas) return null;
  const totalPerguntas = camposKatz.length;
  const completo = respondidas === totalPerguntas;
  const pontos = somarCampos(fd, camposKatz);
  let classificacao = '';
  if (pontos === 6) classificacao = 'Independente';
  else if (pontos >= 4) classificacao = 'Dependência moderada';
  else classificacao = 'Dependência severa';
  return { pontos, classificacao, respondidas, totalPerguntas, completo };
}

function mostrarKatz() {
  exibirResultado('resultado-katz', calcularKatz, ({ pontos, classificacao, respondidas, totalPerguntas, completo }) => {
    const progresso = `<div class="score">Respostas: ${respondidas}/${totalPerguntas}</div>`;
    const legenda = `
      <div class="help">        <strong>Classificação (Escala de Katz):</strong><br>
        6 pontos: Independente<br>
        4–5 pontos: Dependência moderada<br>
        0–3 pontos: Dependência severa
      </div>
    `;
    return `
      <div><strong>${completo ? 'Katz' : 'Katz (parcial)'}:</strong> ${pontos} pontos</div>
      <div class="score"><strong>Classificação:</strong> ${classificacao}</div>
      ${legenda}
      ${progresso}
    `;
  });
}

function calcularGDS() {
  const fd = getFormData();
  const respondidas = contarRespostas(fd, camposGDS);
  if (!respondidas) return null;
  const totalPerguntas = camposGDS.length;
  const completo = respondidas === totalPerguntas;
  const pontos = somarCampos(fd, camposGDS);
  let classificacao = null;
  // Classificação conforme pontuação atual
  if (pontos <= 5) classificacao = 'Normal (0-5 pontos)';
  else if (pontos <= 10) classificacao = 'Depressão leve (6-10 pontos)';
  else classificacao = 'Depressão severa (11-15 pontos)';
  return { pontos, classificacao, respondidas, totalPerguntas, completo };
}

function mostrarGDS() {
  exibirResultado('resultado-gds', calcularGDS, ({ pontos, classificacao, respondidas, totalPerguntas, completo }) => {
    const progresso = `<div class="score">Respostas: ${respondidas}/${totalPerguntas}</div>`;
    const legenda = `
      <div class="help">
        <strong>Interpretação (GDS-15):</strong><br />
        0-5: Normal<br />
        6-10: Depressão leve<br />
        11-15: Depressão severa
      </div>
    `;
    return `
      <div><strong>${completo ? 'GDS-15' : 'GDS-15 (parcial)'}:</strong> ${pontos} pontos</div>
      <div class="score"><strong>Classificação:</strong> ${classificacao}</div>
      ${legenda}
      ${progresso}
    `;
  });
}

function calcularApgar() {
  const fd = getFormData();
  const respondidas = contarRespostas(fd, camposApgar);
  if (!respondidas) return null;
  const totalPerguntas = camposApgar.length;
  const completo = respondidas === totalPerguntas;
  const pontos = somarCampos(fd, camposApgar);
  let classificacao = null;
  // Classificação conforme pontuação atual
  if (pontos <= 3) classificacao = 'Disfuncional (0-3 pontos)';
  else if (pontos <= 6) classificacao = 'Moderadamente disfuncional (4-6 pontos)';
  else classificacao = 'Funcional (7-10 pontos)';
  return { pontos, classificacao, respondidas, totalPerguntas, completo };
}

function mostrarApgar() {
  exibirResultado('resultado-apgar', calcularApgar, ({ pontos, classificacao, respondidas, totalPerguntas, completo }) => {
    const progresso = `<div class="score">Respostas: ${respondidas}/${totalPerguntas}</div>`;
    const legenda = `
      <div class="help">
        <strong>Interpretação (APGAR):</strong><br />
        0-3: Disfuncional<br />
        4-6: Moderadamente disfuncional<br />
        7-10: Funcional
      </div>
    `;
    return `
      <div><strong>${completo ? 'APGAR da Família' : 'APGAR da Família (parcial)'}:</strong> ${pontos} pontos</div>
      <div class="score"><strong>Classificação:</strong> ${classificacao}</div>
      ${legenda}
      ${progresso}
    `;
  });
}

function aoAlterarResposta(event) {
  const { name } = event.target;
  if (!name) return;
  if (camposIVCF.includes(name)) mostrarIVCF();
  if (name === 'srh') mostrarSRH();
  if (camposMAN.includes(name)) mostrarMAN();
  if (camposPfeffer.includes(name)) mostrarPfeffer();
  if (campos10CS.includes(name)) mostrar10CS();
  if (camposZucchelli.includes(name)) mostrarZucchelli();
  if (camposCAM.includes(name)) mostrarCAM();
  if (camposLawton.includes(name)) mostrarLawton();
  if (camposBarthel.includes(name)) mostrarBarthel();
  if (camposKatz.includes(name)) mostrarKatz();
  if (camposFrail.includes(name)) mostrarFrail();
  if (camposSarcF.includes(name)) mostrarSarcF();
  if (name === 'cfs') mostrarCFS();
  if (camposGDS.includes(name)) mostrarGDS();
  if (camposApgar.includes(name)) mostrarApgar();
}

function resetRadiosByNames(names) {
  names.forEach((nome) => {
    document.querySelectorAll(`input[name="${nome}"]`).forEach((el) => {
      if (el instanceof HTMLInputElement && el.type === 'radio') el.checked = false;
    });
  });
}

function visualizarResultado() {
  const nomeEl = document.getElementById('nome');
  const dataEl = document.getElementById('data_avaliacao');
  const nome = nomeEl ? nomeEl.value : 'paciente';
  const data = dataEl ? dataEl.value : new Date().toLocaleDateString('pt-BR');

  // Coletar TODOS os dados da seção de Anamnese automaticamente
  const anamneseSection = document.querySelector('main > section.collapsible');
  const anamnese = {};
  let hasAnamneseData = false;

  if (anamneseSection) {
    // Coletar todos os inputs, textareas e selects dentro da seção de Anamnese
    const elementos = anamneseSection.querySelectorAll('input, textarea, select');

    elementos.forEach(element => {
      const name = element.name || element.id;
      if (!name) return;

      if (element.type === 'radio') {
        // Para radio buttons, só adicionar se estiver checked
        if (element.checked) {
          // Pegar o texto do label associado
          const label = element.closest('label');
          const labelText = label ? label.textContent.trim() : element.value;
          anamnese[name] = { value: element.value, label: labelText };
          hasAnamneseData = true;
        }
      } else if (element.type === 'checkbox') {
        // Para checkboxes, só adicionar se estiver checked
        if (element.checked) {
          const label = element.closest('label');
          const labelText = label ? label.textContent.trim() : name;

          // Se já existe o campo (múltiplos checkboxes com mesmo name), adicionar ao array
          if (anamnese[name]) {
            if (Array.isArray(anamnese[name])) {
              anamnese[name].push(labelText);
            } else {
              anamnese[name] = [anamnese[name], labelText];
            }
          } else {
            anamnese[name] = labelText;
          }
          hasAnamneseData = true;
        }
      } else {
        // Para text, textarea, etc
        const value = element.value.trim();
        if (value) {
          anamnese[name] = { value: value, label: null };
          hasAnamneseData = true;
        }
      }
    });

    // Coletar medicamentos adicionados dinamicamente
    const medicamentos = [];
    const medicamentoItems = anamneseSection.querySelectorAll('.medicamento-item');

    medicamentoItems.forEach((item, index) => {
      const id = item.getAttribute('data-medicamento-id') || (index + 1);
      const nome = item.querySelector(`[name="med${id}_nome"]`)?.value || '';
      const justificativa = item.querySelector(`[name="med${id}_justificativa"]`)?.value || '';
      const dose = item.querySelector(`[name="med${id}_dose"]`)?.value || '';
      const tempo = item.querySelector(`[name="med${id}_tempo"]`)?.value || '';

      if (nome || justificativa || dose || tempo) {
        medicamentos.push({
          id,
          nome,
          justificativa,
          dose,
          tempo
        });
        hasAnamneseData = true;
      }
    });

    if (medicamentos.length > 0) {
      anamnese.medicamentos = medicamentos;
    }
  }

  const secoes = [];
  const sections = document.querySelectorAll('main > form > section, main > h1, main > h2, main > section');

  for (const section of sections) {
    // Skip Anamnese section to avoid duplication
    if (anamneseSection && section === anamneseSection) continue;

    const hasAnswer = section.querySelector('input:checked');
    if (!hasAnswer) {
      continue;
    }

    const h2 = section.querySelector('h2');
    const titulo = h2 ? h2.innerText : '';
    const questoes = [];

    const questions = section.querySelectorAll('.q');
    for (const question of questions) {
      const label = question.querySelector('label:first-child');
      const checked = question.querySelector('input:checked');
      if (label && checked) {
        const answerLabel = document.querySelector(`label[for="${checked.id}"]`) || checked.parentElement;
        questoes.push({
          pergunta: label.innerText,
          resposta: answerLabel.innerText,
        });
      }
    }

    const resultado = section.querySelector('.resultado');
    secoes.push({
      titulo,
      questoes,
      resultado: resultado ? resultado.innerText : ''
    });
  }

  const dadosAvaliacao = {
    nome,
    data,
    anamnese: hasAnamneseData ? anamnese : null,
    secoes,
  };

  localStorage.setItem('dadosAvaliacao', JSON.stringify(dadosAvaliacao));
  window.location.href = 'resultado.html';
}

function bindActions() {
  if (formElement) {
    formElement.addEventListener('submit', (e) => e.preventDefault());
  }
  const mainElement = document.querySelector('main');
  if (mainElement) {
    mainElement.addEventListener('change', aoAlterarResposta);
    // Toggle de colapsáveis ao clicar no h2, h3 ou h4
    mainElement.addEventListener('click', (e) => {
      const header = e.target.closest('section.collapsible > h1, section.collapsible > h2, section.collapsible > h3, section.collapsible > h4');
      if (header) {
        const section = header.parentElement;
        section.classList.toggle('open');
      }
    });
  }

  const calcularImc = () => {
    const pesoEl = document.getElementById('peso');
    const alturaEl = document.getElementById('altura');
    const imcEl = document.getElementById('imc');

    if (!pesoEl || !alturaEl || !imcEl) return;

    const peso = parseFloat(pesoEl.value);
    const altura = parseFloat(alturaEl.value) / 100; // Converter cm para metros

    if (isNaN(peso) || isNaN(altura) || peso <= 0 || altura <= 0) {
      imcEl.value = '';
      return;
    }

    const imc = peso / (altura * altura);
    imcEl.value = imc.toFixed(2); // Formatar para 2 casas decimais
  };

  const visualizarResultadoButton = document.getElementById('visualizar-resultado');
  if (visualizarResultadoButton) {
    visualizarResultadoButton.addEventListener('click', visualizarResultado);
  }

  const pesoInput = document.getElementById('peso');
  const alturaInput = document.getElementById('altura');

  if (pesoInput) pesoInput.addEventListener('input', calcularImc);
  if (alturaInput) alturaInput.addEventListener('input', calcularImc);

  // Ref ref: atualizar SRH imediatamente ao clique
  const srhInputs = document.querySelectorAll('input[name="srh"]');
  if (srhInputs && srhInputs.length) {
    srhInputs.forEach((el) => {
      el.addEventListener('change', () => {
        mostrarSRH();
      });
    });
  }

  const limparButton = document.querySelector('[data-action="limpar"]');
  if (limparButton && formElement) {
    limparButton.addEventListener('click', () => {
      formElement.reset();
      limparResultados();
    });
  }
  const limparResumoButton = document.querySelector('[data-action="limpar-resumo"]');
  if (limparResumoButton) {
    limparResumoButton.addEventListener('click', () => {
      const el = resumoElement();
      if (el) el.innerHTML = '';
    });
  }

  const limparSRHButton = document.querySelector('[data-action="limpar-srh"]');
  if (limparSRHButton) {
    limparSRHButton.addEventListener('click', () => {
      resetRadiosByNames(['srh']);
      const el = document.getElementById('resultado-srh');
      if (el) el.innerHTML = '';
    });
  }

  const limparFuncionalButton = document.querySelector('[data-action="limpar-funcional"]');
  if (limparFuncionalButton && formFuncional) {
    limparFuncionalButton.addEventListener('click', () => {
      formFuncional.reset();
      ['resultado-barthel', 'resultado-katz'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '';
      });
    });
  }

  const limparBarthelButton = document.querySelector('[data-action="limpar-barthel"]');
  if (limparBarthelButton) {
    limparBarthelButton.addEventListener('click', () => {
      resetRadiosByNames(camposBarthel);
      const el = document.getElementById('resultado-barthel');
      if (el) el.innerHTML = '';
    });
  }

  const limparKatzButton = document.querySelector('[data-action="limpar-katz"]');
  if (limparKatzButton) {
    limparKatzButton.addEventListener('click', () => {
      resetRadiosByNames(camposKatz);
      const el = document.getElementById('resultado-katz');
      if (el) el.innerHTML = '';
    });
  }

  const limparFisicaButton = document.querySelector('[data-action="limpar-fisica"]');
  if (limparFisicaButton) {
    limparFisicaButton.addEventListener('click', () => {
      resetRadiosByNames([...camposFrail, ...camposSarcF, 'cfs']);
      ['resultado-frail', 'resultado-sarcf', 'resultado-cfs'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '';
      });
    });
  }

  const limpar10csButton = document.querySelector('[data-action="limpar-10cs"]');
  if (limpar10csButton) {
    limpar10csButton.addEventListener('click', () => {
      resetRadiosByNames(campos10CS);
      const el = document.getElementById('resultado-10cs');
      if (el) el.innerHTML = '';
    });
  }

  const limparZucchelliButton = document.querySelector('[data-action="limpar-zucchelli"]');
  if (limparZucchelliButton) {
    limparZucchelliButton.addEventListener('click', () => {
      resetRadiosByNames(camposZucchelli);
      const el = document.getElementById('resultado-zucchelli');
      if (el) el.innerHTML = '';
    });
  }

  const limparCFSButton = document.querySelector('[data-action="limpar-cfs"]');
  if (limparCFSButton) {
    limparCFSButton.addEventListener('click', () => {
      resetRadiosByNames(['cfs']);
      const el = document.getElementById('resultado-cfs');
      if (el) el.innerHTML = '';
    });
  }

  const limparFrailButton = document.querySelector('[data-action="limpar-frail"]');
  if (limparFrailButton) {
    limparFrailButton.addEventListener('click', () => {
      resetRadiosByNames(camposFrail);
      const el = document.getElementById('resultado-frail');
      if (el) el.innerHTML = '';
    });
  }

  const limparSarcfButton = document.querySelector('[data-action="limpar-sarcf"]');
  if (limparSarcfButton) {
    limparSarcfButton.addEventListener('click', () => {
      resetRadiosByNames(camposSarcF);
      const el = document.getElementById('resultado-sarcf');
      if (el) el.innerHTML = '';
    });
  }

  const limparMANButton = document.querySelector('[data-action="limpar-man"]');
  if (limparMANButton) {
    limparMANButton.addEventListener('click', () => {
      resetRadiosByNames(camposMAN);
      const el = document.getElementById('resultado-man');
      if (el) el.innerHTML = '';
    });
  }

  const limparPfefferButton = document.querySelector('[data-action="limpar-pfeffer"]');
  if (limparPfefferButton) {
    limparPfefferButton.addEventListener('click', () => {
      resetRadiosByNames(camposPfeffer);
      const el = document.getElementById('resultado-pfeffer');
      if (el) el.innerHTML = '';
    });
  }

  const limparLawtonButton = document.querySelector('[data-action="limpar-lawton"]');
  if (limparLawtonButton) {
    limparLawtonButton.addEventListener('click', () => {
      resetRadiosByNames(camposLawton);
      const el = document.getElementById('resultado-lawton');
      if (el) el.innerHTML = '';
    });
  }

  const limparGDSButton = document.querySelector('[data-action="limpar-gds"]');
  if (limparGDSButton) {
    limparGDSButton.addEventListener('click', () => {
      resetRadiosByNames(camposGDS);
      const el = document.getElementById('resultado-gds');
      if (el) el.innerHTML = '';
    });
  }

  const limparApgarButton = document.querySelector('[data-action="limpar-apgar"]');
  if (limparApgarButton) {
    limparApgarButton.addEventListener('click', () => {
      resetRadiosByNames(camposApgar);
      const el = document.getElementById('resultado-apgar');
      if (el) el.innerHTML = '';
    });
  }

  const limparCAMButton = document.querySelector('[data-action="limpar-cam"]');
  if (limparCAMButton) {
    limparCAMButton.addEventListener('click', () => {
      resetRadiosByNames(camposCAM);
      const el = document.getElementById('resultado-cam');
      if (el) el.innerHTML = '';
    });
  }
}

// Função para formatar datas automaticamente (DD/MM/AAAA)
function formatDateInput(input) {
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

// Inicializa
document.addEventListener('DOMContentLoaded', () => {
  bindActions();

  // Aplica formatação automática no campo de data de nascimento
  const dataNascimentoInput = document.getElementById('anamnese_data_nascimento');
  if (dataNascimentoInput) {
    formatDateInput(dataNascimentoInput);

    // Função para calcular a idade
    const calculateAge = (birthDateString) => {
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
    };

    const idadeInput = document.getElementById('anamnese_idade');
    dataNascimentoInput.addEventListener('input', () => {
      idadeInput.value = calculateAge(dataNascimentoInput.value);
    });
  }

  // Medication Modal Logic
  const modal = document.getElementById('medicamento-modal');
  const btnOpenModal = document.getElementById('btn-adicionar-medicamento');
  const spanClose = document.getElementsByClassName('close-button')[0];
  const formModal = document.getElementById('form-medicamento-modal');
  const medicamentosContainer = document.getElementById('medicamentos-container');
  const addMedicationButtonContainer = btnOpenModal.parentElement;

  btnOpenModal.onclick = function() {
    modal.style.display = 'block';
  }

  spanClose.onclick = function() {
    modal.style.display = 'none';
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  }

  formModal.onsubmit = function(event) {
    event.preventDefault();
    const newId = (document.querySelectorAll('.medicamento-item').length || 0) + 1;

    const nome = document.getElementById('modal_med_nome').value;
    const justificativa = document.getElementById('modal_med_justificativa').value;
    const dose = document.getElementById('modal_med_dose').value;
    const tempo = document.getElementById('modal_med_tempo').value;

    const newMedicamento = document.createElement('div');
    newMedicamento.className = 'medicamento-item';
    newMedicamento.setAttribute('data-medicamento-id', newId);
    newMedicamento.innerHTML = `
      <section class="open">
        <h4 style="margin: 8px;">Medicamento ${newId} <span class="delete-medicamento" style="margin: 8px;" data-id="${newId}">&times;</span></h4>
        <div class="section-body">
          <div class="q">
            <label for="med${newId}_nome">Nome</label>
            <input class="form-input" type="text" id="med${newId}_nome" name="med${newId}_nome" value="${nome}" />
          </div>
          <div class="q">
            <label for="med${newId}_justificativa">Justificativa de uso</label>
            <input class="form-input" type="text" id="med${newId}_justificativa" name="med${newId}_justificativa" value="${justificativa}" />
          </div>
          <div class="q">
            <label for="med${newId}_dose">Dose e posologia</label>
            <input class="form-input" type="text" id="med${newId}_dose" name="med${newId}_dose" value="${dose}" />
          </div>
          <div class="q">
            <label for="med${newId}_tempo">Tempo de uso</label>
            <input class="form-input" type="text" id="med${newId}_tempo" name="med${newId}_tempo" value="${tempo}" />
          </div>
        </div>
      </section>
    `;

    medicamentosContainer.appendChild(newMedicamento);
    // Move the button container after the new element
    medicamentosContainer.insertAdjacentElement('afterend', addMedicationButtonContainer);


    formModal.reset();
    modal.style.display = 'none';
  }

  // Event delegation for delete medication buttons
  medicamentosContainer.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-medicamento')) {
      const medicamentoId = event.target.getAttribute('data-id');
      const medicamentoItem = document.querySelector(`.medicamento-item[data-medicamento-id="${medicamentoId}"]`);
      if (medicamentoItem) {
        medicamentoItem.remove();
      }
    }
  });
});