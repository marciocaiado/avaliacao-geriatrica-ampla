/**
 * Aplicação Principal - Avaliação Geriátrica Ampla
 * Arquivo principal que coordena todas as funcionalidades
 */

// Importações dos módulos
import * as constants from './constants.js';
import * as utils from './utils.js';
import * as calculations from './calculations.js';
import * as dom from './dom.js';

// Funções de formatação dos resultados

function formatarIVCF({ pontos, risco, respondidas, totalPerguntas, completo }) {
  const progresso = `<div class="score">Respostas: ${respondidas}/${totalPerguntas}</div>`;
  const cabecalho = `<div><strong>${completo ? 'IVCF-20' : 'IVCF-20 (parcial)'}:</strong> ${pontos} pontos</div>`;
  const classificacao = `<div class="score"><strong>Classificação:</strong> ${risco}</div>`;
  return `${cabecalho}${classificacao}${progresso}`;
}

function formatarSRH({ descricao }) {
  return `<div><strong>SRH:</strong> ${descricao}</div>`;
}

function formatarMAN({ pontos, classe, respondidas, totalPerguntas, completo }) {
  const progresso = `<div class="score">Respostas: ${respondidas}/${totalPerguntas}</div>`;
  return `
    <div><strong>${completo ? 'MAN' : 'MAN (parcial)'}:</strong> ${pontos} pontos - ${classe}</div>
    <div class="help"><strong>Interpretação (MAN):</strong> ≥ 12 pontos: Estado nutricional normal; 8–11 pontos: Risco de desnutrição; 0–7 pontos: Desnutrido.</div>
    ${progresso}
  `;
}

function formatarPfeffer({ pontos, interpretacao, respondidas, totalPerguntas, completo }) {
  const progresso = `<div class="score">Respostas: ${respondidas}/${totalPerguntas}</div>`;
  const legenda = `<div class="help"><strong>Interpretação (Pfeffer):</strong> ≥ 6 sugere declínio funcional; < 6 sem evidência de declínio.</div>`;
  return `
    <div><strong>${completo ? 'Pfeffer' : 'Pfeffer (parcial)'}:</strong> ${pontos} pontos — ${interpretacao}</div>
    ${legenda}
    ${progresso}
  `;
}

function formatar10CS({ pontos, interpretacao, respondidas, totalPerguntas, completo }) {
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
}

function formatarCFS({ valor, descricao }) {
  return `
    <div><strong>Escala Clínica de Fragilidade (CFS):</strong> Opção ${valor} - ${descricao}</div>
    <div class="score"><strong>Classificação:</strong> ${descricao}</div>
    <div class="help"><strong>Escala CFS (1–9):</strong> 1 Muito ativo; 2 Ativo; 3 Regular; 4 Vulnerável; 5 Levemente frágil; 6 Moderadamente frágil; 7 Muito frágil; 8 Severamente frágil; 9 Doente terminal.</div>
  `;
}

function formatarLawton({ pontos, classificacao, respondidas, totalPerguntas, completo }) {
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
}

function formatarZucchelli({ pontos, risco, respondidas, totalPerguntas, completo }) {
  const progresso = `<div class="score">Respostas: ${respondidas}/${totalPerguntas}</div>`;
  const legenda = `<div class="help">Pacientes com pontuação ≥ 3 pontos têm alto risco de delirium.</div>`;
  return `
    <div><strong>${completo ? 'Zucchelli' : 'Zucchelli (parcial)'}:</strong> ${pontos} pontos</div>
    <div class="score"><strong>Classificação:</strong> ${risco}</div>
    ${legenda}
    ${progresso}
  `;
}

function formatarCAM({ status, respondidas, totalPerguntas, completo }) {
  const progresso = `<div class="score">Respostas: ${respondidas}/${totalPerguntas}</div>`;
  const legenda = `<div class="help">O diagnóstico de delirium requer: (1) Início agudo/curso flutuante E (2) Desatenção E (3) Pensamento desorganizado OU (4) Alteração do nível de consciência.</div>`;
  return `
    <div><strong>${completo ? 'CAM' : 'CAM (parcial)'}:</strong> ${status}</div>
    ${legenda}
    ${progresso}
  `;
}

function formatarFrail({ pontos, classificacao, respondidas, totalPerguntas, completo }) {
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
}

function formatarSarcF({ pontos, risco, respondidas, totalPerguntas, completo }) {
  const progresso = `<div class="score">Respostas: ${respondidas}/${totalPerguntas}</div>`;
  const legenda = `<div class="help"><strong>Corte SARC-F:</strong> pontuação maior ou igual a 4 indica risco de sarcopenia.</div>`;
  return `
    <div><strong>${completo ? 'SARC-F' : 'SARC-F (parcial)'}:</strong> ${pontos} pontos</div>
    <div class="score"><strong>Classificação:</strong> ${risco}</div>
    ${legenda}
    ${progresso}
  `;
}

function formatarBarthel({ pontos, classificacao, respondidas, totalPerguntas, completo }) {
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
}

function formatarKatz({ pontos, classificacao, respondidas, totalPerguntas, completo }) {
  const progresso = `<div class="score">Respostas: ${respondidas}/${totalPerguntas}</div>`;
  const legenda = `
    <div class="help">
      <strong>Classificação (Escala de Katz):</strong><br>
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
}

function formatarGDS({ pontos, classificacao, respondidas, totalPerguntas, completo }) {
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
}

function formatarApgar({ pontos, classificacao, respondidas, totalPerguntas, completo }) {
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
}

// Funções de exibição (wrapper das funções de cálculo e formatação)

function mostrarIVCF() {
  dom.exibirResultado('resultado-ivcf', calculations.calcularIVCF, formatarIVCF);
}

function mostrarSRH() {
  dom.exibirResultado('resultado-srh', calculations.calcularSRH, formatarSRH);
}

function mostrarMAN() {
  dom.exibirResultado('resultado-man', calculations.calcularMAN, formatarMAN);
}

function mostrarPfeffer() {
  dom.exibirResultado('resultado-pfeffer', calculations.calcularPfeffer, formatarPfeffer);
}

function mostrar10CS() {
  dom.exibirResultado('resultado-10cs', calculations.calcular10CS, formatar10CS);
}

function mostrarCFS() {
  dom.exibirResultado('resultado-cfs', calculations.calcularCFS, formatarCFS);
}

function mostrarLawton() {
  dom.exibirResultado('resultado-lawton', calculations.calcularLawton, formatarLawton);
}

function mostrarZucchelli() {
  dom.exibirResultado('resultado-zucchelli', calculations.calcularZucchelli, formatarZucchelli);
}

function mostrarCAM() {
  dom.exibirResultado('resultado-cam', calculations.calcularCAM, formatarCAM);
}

function mostrarFrail() {
  dom.exibirResultado('resultado-frail', calculations.calcularFrail, formatarFrail);
}

function mostrarSarcF() {
  dom.exibirResultado('resultado-sarcf', calculations.calcularSarcF, formatarSarcF);
}

function mostrarBarthel() {
  dom.exibirResultado('resultado-barthel', calculations.calcularBarthel, formatarBarthel);
}

function mostrarKatz() {
  dom.exibirResultado('resultado-katz', calculations.calcularKatz, formatarKatz);
}

function mostrarGDS() {
  dom.exibirResultado('resultado-gds', calculations.calcularGDS, formatarGDS);
}

function mostrarApgar() {
  dom.exibirResultado('resultado-apgar', calculations.calcularApgar, formatarApgar);
}

// Handler de mudanças nos inputs
function aoAlterarResposta(event) {
  const { name } = event.target;
  if (!name) return;

  if (constants.camposIVCF.includes(name)) mostrarIVCF();
  if (name === 'srh') mostrarSRH();
  if (constants.camposMAN.includes(name)) mostrarMAN();
  if (constants.camposPfeffer.includes(name)) mostrarPfeffer();
  if (constants.campos10CS.includes(name)) mostrar10CS();
  if (constants.camposZucchelli.includes(name)) mostrarZucchelli();
  if (constants.camposCAM.includes(name)) mostrarCAM();
  if (constants.camposLawton.includes(name)) mostrarLawton();
  if (constants.camposBarthel.includes(name)) mostrarBarthel();
  if (constants.camposKatz.includes(name)) mostrarKatz();
  if (constants.camposFrail.includes(name)) mostrarFrail();
  if (constants.camposSarcF.includes(name)) mostrarSarcF();
  if (name === 'cfs') mostrarCFS();
  if (constants.camposGDS.includes(name)) mostrarGDS();
  if (constants.camposApgar.includes(name)) mostrarApgar();
}

// Função para visualizar resultado completo
function visualizarResultado() {
  const nomeEl = document.getElementById('nome');
  const dataEl = document.getElementById('data_avaliacao');
  const nome = nomeEl ? nomeEl.value : 'paciente';
  const data = dataEl ? dataEl.value : new Date().toLocaleDateString('pt-BR');

  // Coletar dados da seção de Anamnese
  const anamneseSection = document.querySelector('main > section.collapsible');
  const anamnese = {};
  let hasAnamneseData = false;

  if (anamneseSection) {
    const elementos = anamneseSection.querySelectorAll('input, textarea, select');

    elementos.forEach(element => {
      const name = element.name || element.id;
      if (!name) return;

      if (element.type === 'radio') {
        if (element.checked) {
          const label = element.closest('label');
          const labelText = label ? label.textContent.trim() : element.value;
          anamnese[name] = { value: element.value, label: labelText };
          hasAnamneseData = true;
        }
      } else if (element.type === 'checkbox') {
        if (element.checked) {
          const label = element.closest('label');
          const labelText = label ? label.textContent.trim() : name;

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
        const value = element.value.trim();
        if (value) {
          anamnese[name] = { value: value, label: null };
          hasAnamneseData = true;
        }
      }
    });

    // Coletar medicamentos
    const medicamentos = [];
    const medicamentoItems = anamneseSection.querySelectorAll('.medicamento-item');

    medicamentoItems.forEach((item, index) => {
      const id = item.getAttribute('data-medicamento-id') || (index + 1);
      const nome = item.querySelector(`[name="med${id}_nome"]`)?.value || '';
      const justificativa = item.querySelector(`[name="med${id}_justificativa"]`)?.value || '';
      const dose = item.querySelector(`[name="med${id}_dose"]`)?.value || '';
      const tempo = item.querySelector(`[name="med${id}_tempo"]`)?.value || '';

      if (nome || justificativa || dose || tempo) {
        medicamentos.push({ id, nome, justificativa, dose, tempo });
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
    if (anamneseSection && section === anamneseSection) continue;

    const hasAnswer = section.querySelector('input:checked');
    if (!hasAnswer) continue;

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

// Função de bind dos event listeners
function bindActions() {
  const formElement = document.getElementById('form-ivcf');
  if (formElement) {
    formElement.addEventListener('submit', (e) => e.preventDefault());
  }

  const mainElement = document.querySelector('main');
  if (mainElement) {
    mainElement.addEventListener('change', aoAlterarResposta);

    // Toggle de colapsáveis
    mainElement.addEventListener('click', (e) => {
      const header = e.target.closest('section.collapsible > h1, section.collapsible > h2, section.collapsible > h3, section.collapsible > h4');
      if (header) {
        const section = header.parentElement;
        section.classList.toggle('open');
      }
    });
  }

  // Cálculo do IMC
  const calcularImc = () => {
    const pesoEl = document.getElementById('peso');
    const alturaEl = document.getElementById('altura');
    const imcEl = document.getElementById('imc');

    if (!pesoEl || !alturaEl || !imcEl) return;

    const peso = parseFloat(pesoEl.value);
    const altura = parseFloat(alturaEl.value) / 100;

    if (isNaN(peso) || isNaN(altura) || peso <= 0 || altura <= 0) {
      imcEl.value = '';
      return;
    }

    const imc = peso / (altura * altura);
    imcEl.value = imc.toFixed(2);
  };

  const pesoInput = document.getElementById('peso');
  const alturaInput = document.getElementById('altura');
  if (pesoInput) pesoInput.addEventListener('input', calcularImc);
  if (alturaInput) alturaInput.addEventListener('input', calcularImc);

  // Botão visualizar resultado
  const visualizarResultadoButton = document.getElementById('visualizar-resultado');
  if (visualizarResultadoButton) {
    visualizarResultadoButton.addEventListener('click', visualizarResultado);
  }

  // Botões de limpar
  setupLimparButtons();

  // Modal de fluência verbal
  setupFluenciaModal();

  // Modal de teste de marcha
  setupMarchaModal();

  // Modal de teste de sentar e levantar
  setupSentarLevantar();

  // Modal de medicamentos
  setupMedicamentosModal();
}

// Configuração dos botões de limpar
function setupLimparButtons() {
  const limparButton = document.querySelector('[data-action="limpar"]');
  const formElement = document.getElementById('form-ivcf');
  if (limparButton && formElement) {
    limparButton.addEventListener('click', () => {
      formElement.reset();
      dom.limparResultados();
    });
  }

  const limparResumoButton = document.querySelector('[data-action="limpar-resumo"]');
  if (limparResumoButton) {
    limparResumoButton.addEventListener('click', () => {
      const el = document.getElementById('resumo-tests');
      if (el) el.innerHTML = '';
    });
  }

  // Configurar botões específicos de limpar
  const limparConfig = [
    { action: 'limpar-srh', campos: ['srh'], resultados: ['resultado-srh'] },
    { action: 'limpar-barthel', campos: constants.camposBarthel, resultados: ['resultado-barthel'] },
    { action: 'limpar-katz', campos: constants.camposKatz, resultados: ['resultado-katz'] },
    { action: 'limpar-10cs', campos: constants.campos10CS, resultados: ['resultado-10cs'] },
    { action: 'limpar-zucchelli', campos: constants.camposZucchelli, resultados: ['resultado-zucchelli'] },
    { action: 'limpar-cfs', campos: ['cfs'], resultados: ['resultado-cfs'] },
    { action: 'limpar-frail', campos: constants.camposFrail, resultados: ['resultado-frail'] },
    { action: 'limpar-sarcf', campos: constants.camposSarcF, resultados: ['resultado-sarcf'] },
    { action: 'limpar-man', campos: constants.camposMAN, resultados: ['resultado-man'] },
    { action: 'limpar-pfeffer', campos: constants.camposPfeffer, resultados: ['resultado-pfeffer'] },
    { action: 'limpar-lawton', campos: constants.camposLawton, resultados: ['resultado-lawton'] },
    { action: 'limpar-gds', campos: constants.camposGDS, resultados: ['resultado-gds'] },
    { action: 'limpar-apgar', campos: constants.camposApgar, resultados: ['resultado-apgar'] },
    { action: 'limpar-cam', campos: constants.camposCAM, resultados: ['resultado-cam'] },
  ];

  limparConfig.forEach(({ action, campos, resultados }) => {
    const button = document.querySelector(`[data-action="${action}"]`);
    if (button) {
      button.addEventListener('click', () => {
        utils.resetRadiosByNames(campos);
        resultados.forEach((id) => {
          const el = document.getElementById(id);
          if (el) el.innerHTML = '';
        });
      });
    }
  });

  // Botões compostos
  const limparFuncionalButton = document.querySelector('[data-action="limpar-funcional"]');
  const formFuncional = document.getElementById('form-funcional');
  if (limparFuncionalButton && formFuncional) {
    limparFuncionalButton.addEventListener('click', () => {
      formFuncional.reset();
      ['resultado-barthel', 'resultado-katz'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '';
      });
    });
  }

  const limparFisicaButton = document.querySelector('[data-action="limpar-fisica"]');
  if (limparFisicaButton) {
    limparFisicaButton.addEventListener('click', () => {
      utils.resetRadiosByNames([...constants.camposFrail, ...constants.camposSarcF, 'cfs']);
      ['resultado-frail', 'resultado-sarcf', 'resultado-cfs'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '';
      });
    });
  }
}

// Modal de Fluência Verbal
function setupFluenciaModal() {
  const btnIniciarFluencia = document.getElementById('btn-iniciar-fluencia');
  const modalFluencia = document.getElementById('fluencia-modal');
  const closeFluencia = document.querySelector('.close-button-fluencia');
  const btnContar = document.getElementById('btn-contar-animal');
  const btnReiniciar = document.getElementById('btn-reiniciar-fluencia');
  const btnConcluir = document.getElementById('btn-concluir-fluencia');
  const timerDisplay = document.getElementById('timer-display');
  const counterDisplay = document.getElementById('counter-display');

  let fluenciaInterval;
  let fluenciaSeconds = 0;
  let fluenciaCount = 0;

  const updateFluenciaUI = () => {
    if (timerDisplay) timerDisplay.textContent = fluenciaSeconds < 10 ? `0${fluenciaSeconds}` : fluenciaSeconds;
    if (counterDisplay) counterDisplay.textContent = `${fluenciaCount} animal(is)`;
  };

  const stopFluencia = () => {
    clearInterval(fluenciaInterval);
    fluenciaInterval = null;
    if (btnContar) btnContar.disabled = true;
    if (timerDisplay) timerDisplay.style.color = 'red';
  };

  const startFluencia = () => {
    clearInterval(fluenciaInterval);
    fluenciaSeconds = 0;
    fluenciaCount = 0;
    updateFluenciaUI();
    if (timerDisplay) timerDisplay.style.color = '#3f51b5';
    if (btnContar) btnContar.disabled = false;
    if (modalFluencia) modalFluencia.style.display = 'block';

    fluenciaInterval = setInterval(() => {
      fluenciaSeconds++;
      updateFluenciaUI();
      if (fluenciaSeconds >= constants.MAX_SECONDS) {
        stopFluencia();
      }
    }, 1000);
  };

  if (btnIniciarFluencia) btnIniciarFluencia.addEventListener('click', startFluencia);

  if (closeFluencia) {
    closeFluencia.addEventListener('click', () => {
      if (modalFluencia) modalFluencia.style.display = 'none';
      clearInterval(fluenciaInterval);
    });
  }

  if (btnReiniciar) btnReiniciar.addEventListener('click', startFluencia);

  if (btnContar) {
    btnContar.addEventListener('click', () => {
      if (fluenciaSeconds < constants.MAX_SECONDS) {
        fluenciaCount++;
        updateFluenciaUI();
      }
    });
  }

  if (btnConcluir) {
    btnConcluir.addEventListener('click', () => {
      clearInterval(fluenciaInterval);
      if (modalFluencia) modalFluencia.style.display = 'none';

      let val = '0';
      if (fluenciaCount >= 15) val = '4';
      else if (fluenciaCount >= 12) val = '3';
      else if (fluenciaCount >= 9) val = '2';
      else if (fluenciaCount >= 6) val = '1';

      const radio = document.querySelector(`input[name="cs_fluencia"][value="${val}"]`);
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  }

  window.addEventListener('click', (event) => {
    if (event.target === modalFluencia) {
      if (modalFluencia) modalFluencia.style.display = 'none';
      clearInterval(fluenciaInterval);
    }
  });
}

// Modal de Teste de Marcha
function setupMarchaModal() {
  const btnIniciarMarcha = document.getElementById('btn-iniciar-marcha');
  const modalMarcha = document.getElementById('marcha-modal');
  const closeMarcha = document.querySelector('.close-button-marcha');
  const btnIniciarCronometro = document.getElementById('btn-iniciar-cronometro-marcha');
  const btnPararCronometro = document.getElementById('btn-parar-cronometro-marcha');
  const btnReiniciar = document.getElementById('btn-reiniciar-marcha');
  const btnConcluir = document.getElementById('btn-concluir-marcha');
  const timerDisplay = document.getElementById('marcha-timer-display');
  const resultadoDisplay = document.getElementById('marcha-resultado-display');

  if (!btnIniciarMarcha || !modalMarcha) return;

  let marchaInterval;
  let marchaMilliseconds = 0;
  let marchaVelocidade = 0;

  const updateMarchaUI = () => {
    const seconds = (marchaMilliseconds / 1000).toFixed(1);
    if (timerDisplay) timerDisplay.textContent = `${seconds}s`;
    if (resultadoDisplay) {
      if (marchaVelocidade > 0) {
        resultadoDisplay.textContent = `Velocidade: ${marchaVelocidade.toFixed(2)} m/s`;
        resultadoDisplay.style.color = marchaVelocidade < 0.8 ? '#f44336' : '#4caf50';
      } else {
        resultadoDisplay.textContent = '-';
        resultadoDisplay.style.color = '#666';
      }
    }
  };

  const stopMarcha = () => {
    clearInterval(marchaInterval);
    marchaInterval = null;
    if (btnIniciarCronometro) btnIniciarCronometro.disabled = true;
    if (btnPararCronometro) btnPararCronometro.disabled = true;

    // Calcular velocidade: 4 metros / tempo em segundos
    const tempoEmSegundos = marchaMilliseconds / 1000;
    if (tempoEmSegundos > 0) {
      marchaVelocidade = 4 / tempoEmSegundos;
    }
    updateMarchaUI();
  };

  const startMarcha = () => {
    clearInterval(marchaInterval);
    if (btnIniciarCronometro) btnIniciarCronometro.disabled = true;
    if (btnPararCronometro) btnPararCronometro.disabled = false;
    if (timerDisplay) timerDisplay.style.color = '#3f51b5';

    marchaInterval = setInterval(() => {
      marchaMilliseconds += 100;
      updateMarchaUI();
    }, 100);
  };

  const resetMarcha = () => {
    clearInterval(marchaInterval);
    marchaMilliseconds = 0;
    marchaVelocidade = 0;
    if (btnIniciarCronometro) btnIniciarCronometro.disabled = false;
    if (btnPararCronometro) btnPararCronometro.disabled = true;
    if (timerDisplay) timerDisplay.style.color = '#3f51b5';
    updateMarchaUI();
  };

  const openModal = () => {
    resetMarcha();
    if (modalMarcha) modalMarcha.style.display = 'block';
  };

  const closeModal = () => {
    if (modalMarcha) modalMarcha.style.display = 'none';
    clearInterval(marchaInterval);
  };

  btnIniciarMarcha.addEventListener('click', openModal);
  if (closeMarcha) closeMarcha.addEventListener('click', closeModal);
  if (btnIniciarCronometro) btnIniciarCronometro.addEventListener('click', startMarcha);
  if (btnPararCronometro) btnPararCronometro.addEventListener('click', stopMarcha);
  if (btnReiniciar) btnReiniciar.addEventListener('click', resetMarcha);

  if (btnConcluir) {
    btnConcluir.addEventListener('click', () => {
      clearInterval(marchaInterval);
      closeModal();

      // Atualiza o resultado na página
      const resultadoDiv = document.getElementById('resultado-marcha');
      const velocidadeInput = document.getElementById('teste_marcha_velocidade');
      const testeMarchaInput = document.getElementById('teste_marcha');

      if (resultadoDiv && marchaVelocidade > 0) {
        const velocidadeFormatada = marchaVelocidade.toFixed(2);
        const cor = marchaVelocidade < 0.8 ? '#f44336' : '#4caf50';
        const status = marchaVelocidade < 0.8 ? '(Alterado)' : '(Normal)';

        resultadoDiv.innerHTML = `<strong>Resultado:</strong> <span style="color: ${cor};">${velocidadeFormatada} m/s ${status}</span>`;

        // Preenche os campos hidden
        if (velocidadeInput) velocidadeInput.value = velocidadeFormatada;
        if (testeMarchaInput) testeMarchaInput.value = marchaVelocidade < 0.8 ? 'sim' : 'nao';
      }
    });
  }

  window.addEventListener('click', (event) => {
    if (event.target === modalMarcha) {
      closeModal();
    }
  });
}

// Modal de Sentar e Levantar
function setupSentarLevantar() {
  const btnIniciarSentar = document.getElementById('btn-iniciar-sentar-levantar');
  const modalSentar = document.getElementById('sentar-levantar-modal');
  const closeSentar = document.querySelector('.close-button-sentar-levantar');
  const btnIniciarCronometro = document.getElementById('btn-iniciar-cronometro-sentar');
  const btnPararCronometro = document.getElementById('btn-parar-cronometro-sentar');
  const btnContarRepeticao = document.getElementById('btn-contar-repeticao');
  const btnReiniciar = document.getElementById('btn-reiniciar-sentar');
  const btnConcluir = document.getElementById('btn-concluir-sentar');
  const timerDisplay = document.getElementById('sentar-levantar-timer-display');
  const contadorDisplay = document.getElementById('sentar-levantar-contador-display');

  if (!btnIniciarSentar || !modalSentar) return;

  let sentarInterval;
  let sentarMilliseconds = 0;
  let repeticoes = 0;
  const MAX_REPETICOES = 5;

  const updateSentarUI = () => {
    const seconds = (sentarMilliseconds / 1000).toFixed(1);
    if (timerDisplay) timerDisplay.textContent = `${seconds}s`;
    if (contadorDisplay) {
      contadorDisplay.textContent = `${repeticoes} / ${MAX_REPETICOES} repetições`;
      if (repeticoes >= MAX_REPETICOES) {
        contadorDisplay.style.color = '#4caf50';
      }
    }
  };

  const stopSentar = () => {
    clearInterval(sentarInterval);
    sentarInterval = null;
    if (btnIniciarCronometro) btnIniciarCronometro.disabled = true;
    if (btnPararCronometro) btnPararCronometro.disabled = true;
    if (btnContarRepeticao) btnContarRepeticao.disabled = true;
  };

  const startSentar = () => {
    clearInterval(sentarInterval);
    repeticoes = 0;
    sentarMilliseconds = 0;
    updateSentarUI();

    if (btnIniciarCronometro) btnIniciarCronometro.disabled = true;
    if (btnPararCronometro) btnPararCronometro.disabled = false;
    if (btnContarRepeticao) btnContarRepeticao.disabled = false;
    if (timerDisplay) timerDisplay.style.color = '#3f51b5';

    sentarInterval = setInterval(() => {
      sentarMilliseconds += 100;
      updateSentarUI();
    }, 100);
  };

  const resetSentar = () => {
    clearInterval(sentarInterval);
    sentarMilliseconds = 0;
    repeticoes = 0;
    if (btnIniciarCronometro) btnIniciarCronometro.disabled = false;
    if (btnPararCronometro) btnPararCronometro.disabled = true;
    if (btnContarRepeticao) btnContarRepeticao.disabled = true;
    if (timerDisplay) timerDisplay.style.color = '#3f51b5';
    if (contadorDisplay) contadorDisplay.style.color = '#666';
    updateSentarUI();
  };

  const openModal = () => {
    resetSentar();
    if (modalSentar) modalSentar.style.display = 'block';
  };

  const closeModal = () => {
    if (modalSentar) modalSentar.style.display = 'none';
    clearInterval(sentarInterval);
  };

  btnIniciarSentar.addEventListener('click', openModal);
  if (closeSentar) closeSentar.addEventListener('click', closeModal);
  if (btnIniciarCronometro) btnIniciarCronometro.addEventListener('click', startSentar);
  if (btnPararCronometro) btnPararCronometro.addEventListener('click', stopSentar);
  if (btnReiniciar) btnReiniciar.addEventListener('click', resetSentar);

  if (btnContarRepeticao) {
    btnContarRepeticao.addEventListener('click', () => {
      if (repeticoes < MAX_REPETICOES) {
        repeticoes++;
        updateSentarUI();

        // Para automaticamente quando atinge 5 repetições
        if (repeticoes >= MAX_REPETICOES) {
          stopSentar();
        }
      }
    });
  }

  if (btnConcluir) {
    btnConcluir.addEventListener('click', () => {
      clearInterval(sentarInterval);
      closeModal();

      // Atualiza o resultado na página
      const resultadoDiv = document.getElementById('resultado-sentar-levantar');
      const tempoInput = document.getElementById('teste_sentar_levantar_tempo');
      const testeSentarInput = document.getElementById('teste_sentar_levantar');

      if (resultadoDiv && sentarMilliseconds > 0) {
        const tempoSegundos = (sentarMilliseconds / 1000).toFixed(1);
        const cor = sentarMilliseconds > 15000 ? '#f44336' : '#4caf50';
        const status = sentarMilliseconds > 15000 ? '(Alterado)' : '(Normal)';

        resultadoDiv.innerHTML = `<strong>Resultado:</strong> <span style="color: ${cor};">${tempoSegundos}s ${status}</span>`;

        // Preenche os campos hidden
        if (tempoInput) tempoInput.value = tempoSegundos;
        if (testeSentarInput) testeSentarInput.value = sentarMilliseconds > 15000 ? 'sim' : 'nao';
      }
    });
  }

  window.addEventListener('click', (event) => {
    if (event.target === modalSentar) {
      closeModal();
    }
  });
}

// Modal de Medicamentos
function setupMedicamentosModal() {
  const modal = document.getElementById('medicamento-modal');
  const btnOpenModal = document.getElementById('btn-adicionar-medicamento');
  const spanClose = modal?.getElementsByClassName('close-button')[0];
  const formModal = document.getElementById('form-medicamento-modal');
  const medicamentosContainer = document.getElementById('medicamentos-container');

  if (!modal || !btnOpenModal || !formModal || !medicamentosContainer) return;

  const addMedicationButtonContainer = btnOpenModal.parentElement;

  btnOpenModal.onclick = function () {
    modal.style.display = 'block';
  };

  if (spanClose) {
    spanClose.onclick = function () {
      modal.style.display = 'none';
    };
  }

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };

  formModal.onsubmit = function (event) {
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
    medicamentosContainer.insertAdjacentElement('afterend', addMedicationButtonContainer);

    formModal.reset();
    modal.style.display = 'none';
  };

  medicamentosContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('delete-medicamento')) {
      const medicamentoId = event.target.getAttribute('data-id');
      const medicamentoItem = document.querySelector(`.medicamento-item[data-medicamento-id="${medicamentoId}"]`);
      if (medicamentoItem) medicamentoItem.remove();
    }
  });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  bindActions();

  // Data de nascimento e cálculo de idade
  const dataNascimentoInput = document.getElementById('anamnese_data_nascimento');
  if (dataNascimentoInput) {
    utils.formatDateInput(dataNascimentoInput);

    const idadeInput = document.getElementById('anamnese_idade');
    if (idadeInput) {
      dataNascimentoInput.addEventListener('input', () => {
        idadeInput.value = utils.calculateAge(dataNascimentoInput.value);
      });
    }
  }
});
