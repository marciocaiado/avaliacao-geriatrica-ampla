/**
 * Aplicação Principal - Avaliação Geriátrica Ampla
 * Arquivo principal que coordena todas as funcionalidades
 */

// Importações dos módulos
import * as constants from './constants.js?v=2';
import * as utils from './utils.js?v=2';
import * as calculations from './calculations.js?v=2';
import * as dom from './dom.js?v=2';
import { salvarFormulario, restaurarFormulario, limparFormularioSalvo } from './persistence.js?v=2';

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

function formatarEDG4({ pontos, classificacao, respondidas, totalPerguntas, completo }) {
  const progresso = `<div class="score">Respostas: ${respondidas}/${totalPerguntas}</div>`;
  const legenda = `
    <div class="help">
      <strong>Interpretação (EDG-4):</strong><br>
      0–1: Sem suspeita de depressão<br>
      2: Suspeita de depressão leve<br>
      3–4: Suspeita de depressão
    </div>
  `;
  return `
    <div><strong>${completo ? 'EDG-4' : 'EDG-4 (parcial)'}:</strong> ${pontos} pontos</div>
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

function formatarAGC10({ pontuacao, classificacao, respondidas, totalPerguntas, completo, itensAvaliados }) {
  const progresso = `<div class="score">Itens avaliados: ${itensAvaliados}/${totalPerguntas}</div>`;
  const legenda = `
    <div class="help">
      <strong>Interpretação (AGC-10):</strong><br />
      0-0,29: Baixo risco<br />
      0,3-0,39: Médio risco<br />
      0,4-1: Alto risco
    </div>
  `;
  return `
    <div><strong>${completo ? 'AGC-10' : 'AGC-10 (parcial)'}:</strong> ${pontuacao}</div>
    <div class="score"><strong>Risco:</strong> ${classificacao}</div>
    ${legenda}
    ${progresso}
  `;
}

function formatarMEEM({ pontos, interpretacao, respondidas, totalPerguntas, completo }) {
  const progresso = `<div class="score">Respostas: ${respondidas}/${totalPerguntas}</div>`;
  const legenda = `
    <div class="help">
      <strong>Pontos de corte por escolaridade:</strong><br />
      Analfabetos: ≤ 20 | 1-4 anos: ≤ 25 | 5-8 anos: ≤ 26 | 9-11 anos: ≤ 28 | >11 anos: ≤ 29
    </div>
  `;
  return `
    <div><strong>${completo ? 'MEEM' : 'MEEM (parcial)'}:</strong> ${pontos}/30 pontos — ${interpretacao}</div>
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

function mostrarEDG4() {
  dom.exibirResultado('resultado-edg4', calculations.calcularEDG4, formatarEDG4);
}

function mostrarApgar() {
  dom.exibirResultado('resultado-apgar', calculations.calcularApgar, formatarApgar);
}

function mostrarAGC10() {
  dom.exibirResultado('resultado-agc10', calculations.calcularAGC10, formatarAGC10);
  dom.exibirResultado('resultado-agc10-inline', calculations.calcularAGC10, formatarAGC10);
}

function mostrarMEEM() {
  dom.exibirResultado('resultado-meem', calculations.calcularMEEM, formatarMEEM);
}

// Recalcula todos os testes (usado após restaurar formulário)
function recalcularTodosResultados() {
  mostrarIVCF();
  mostrarSRH();
  mostrarMAN();
  mostrarPfeffer();
  mostrar10CS();
  mostrarCFS();
  mostrarLawton();
  mostrarZucchelli();
  mostrarCAM();
  mostrarFrail();
  mostrarSarcF();
  mostrarBarthel();
  mostrarKatz();
  mostrarGDS();
  mostrarEDG4();
  mostrarApgar();
  mostrarMEEM();
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
  if (constants.camposEDG4.includes(name)) mostrarEDG4();
  if (constants.camposApgar.includes(name)) mostrarApgar();
  if (constants.camposAGC10.includes(name)) mostrarAGC10();
  if (constants.camposMEEM.includes(name)) mostrarMEEM();
}

// Função para visualizar resultado completo
function visualizarResultado() {
  const nomeEl = document.getElementById('anamnese_nome');
  const nome = nomeEl ? nomeEl.value : 'paciente';
  const data = new Date().toLocaleDateString('pt-BR');

  // Coletar dados de anamnese de todos os campos que NÃO estão dentro de <form>
  // (campos de testes estão dentro de forms; campos de anamnese estão fora)
  const anamnese = {};
  let hasAnamneseData = false;

  document.querySelectorAll('main input, main textarea, main select').forEach(element => {
    if (element.closest('form')) return;
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
  const anamneseSection = document.querySelector('main > section.collapsible');
  if (anamneseSection) {
    const medicamentos = [];
    const medicamentoItems = anamneseSection.querySelectorAll('.medicamento-item');

    medicamentoItems.forEach((item, index) => {
      const id = item.getAttribute('data-medicamento-id') || (index + 1);
      const medNome = item.querySelector(`[name="med${id}_nome"]`)?.value || '';
      const justificativa = item.querySelector(`[name="med${id}_justificativa"]`)?.value || '';
      const dose = item.querySelector(`[name="med${id}_dose"]`)?.value || '';
      const tempo = item.querySelector(`[name="med${id}_tempo"]`)?.value || '';

      if (medNome || justificativa || dose || tempo) {
        medicamentos.push({ id, nome: medNome, justificativa, dose, tempo });
        hasAnamneseData = true;
      }
    });

    if (medicamentos.length > 0) {
      anamnese.medicamentos = medicamentos;
    }
  }

  // Coletar resultados dos testes a partir dos divs de resultado
  const coleta = [
    ['Autoavaliação de Saúde', 'resultado-srh'],
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
    ['APGAR Familiar', 'resultado-apgar'],
    ['AGC-10', 'resultado-agc10'],
    ['MEEM', 'resultado-meem'],
  ];

  const secoes = [];
  coleta.forEach(([titulo, id]) => {
    const el = document.getElementById(id);
    if (!el) return;
    const texto = el.textContent.trim();
    if (!texto) return;
    secoes.push({ titulo, resultado: texto });
  });

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
    mainElement.addEventListener('change', (e) => {
      aoAlterarResposta(e);
      salvarFormulario();
    });

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
  if (pesoInput) pesoInput.addEventListener('input', () => { calcularImc(); salvarFormulario(); });
  if (alturaInput) alturaInput.addEventListener('input', () => { calcularImc(); salvarFormulario(); });

  // Botão visualizar resultado
  const visualizarResultadoButton = document.getElementById('visualizar-resultado');
  if (visualizarResultadoButton) {
    visualizarResultadoButton.addEventListener('click', visualizarResultado);
  }

  // Botão Resumo
  const btnResumo = document.getElementById('btn-resumo');
  if (btnResumo) {
    btnResumo.addEventListener('click', () => {
      dom.atualizarResumo();
      window.location.href = 'resumo-resultados.html';
    });
  }

  // Botão Novo
  const btnNovo = document.getElementById('btn-novo');
  if (btnNovo) {
    btnNovo.addEventListener('click', () => {
      if (confirm('Deseja limpar todos os dados do teste? Esta ação não pode ser desfeita.')) {
        // Limpar sessionStorage
        limparFormularioSalvo();

        // Limpar todos os campos do formulário
        const formElement = document.getElementById('form-ivcf');
        if (formElement) {
          formElement.reset();
        }

        // Limpar todos os resultados
        dom.limparResultados();

        // Recarregar a página
        window.location.reload();
      }
    });
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

  // Modal de Katz
  setupKatzModal();

  // Modal de EDG-4
  setupEDG4Modal();

  // Sincronização do Katz com AGC-10
  setupAGC10KatzSync();

  // Sincronização da EDG-4 com AGC-10
  setupAGC10EDG4Sync();

  // Sincronização do 10-CS com AGC-10
  setupAGC10CognicaoSync();

  // Tela cheia "FECHE OS OLHOS"
  setupFecheOlhosFullscreen();
}

function setupFecheOlhosFullscreen() {
  // Função auxiliar para abrir overlay com suporte ao botão voltar
  function abrirOverlay(overlay) {
    overlay.style.display = 'flex';
    history.pushState({ overlay: overlay.id }, '');
  }

  function fecharOverlay(overlay) {
    overlay.style.display = 'none';
  }

  // Listener global: ao pressionar "voltar", fecha o overlay ativo
  window.addEventListener('popstate', () => {
    const overlays = document.querySelectorAll('#feche-olhos-fullscreen, #meem-imagem-fullscreen');
    overlays.forEach(ol => {
      if (ol.style.display === 'flex') {
        fecharOverlay(ol);
      }
    });
  });

  const trigger = document.getElementById('feche-olhos-trigger');
  const fullscreen = document.getElementById('feche-olhos-fullscreen');

  if (trigger && fullscreen) {
    trigger.addEventListener('click', () => {
      abrirOverlay(fullscreen);
    });

    fullscreen.addEventListener('click', () => {
      fecharOverlay(fullscreen);
      history.back();
    });
  }

  const meemImgTrigger = document.getElementById('meem-imagem-trigger');
  const meemImgFullscreen = document.getElementById('meem-imagem-fullscreen');

  if (meemImgTrigger && meemImgFullscreen) {
    meemImgTrigger.addEventListener('click', () => {
      abrirOverlay(meemImgFullscreen);
    });

    meemImgFullscreen.addEventListener('click', () => {
      fecharOverlay(meemImgFullscreen);
      history.back();
    });
  }
}

// Configuração dos botões de limpar
function setupLimparButtons() {
  const limparButton = document.querySelector('[data-action="limpar"]');
  const formElement = document.getElementById('form-ivcf');
  if (limparButton && formElement) {
    limparButton.addEventListener('click', () => {
      formElement.reset();
      dom.limparResultados();
      limparFormularioSalvo();
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
    { action: 'limpar-agc10', campos: constants.camposAGC10, resultados: ['resultado-agc10', 'resultado-agc10-inline'] },
    { action: 'limpar-meem', campos: constants.camposMEEM, resultados: ['resultado-meem'] },
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

// Modal de Teste de Katz
function setupKatzModal() {
  const modal = document.getElementById('katz-modal');
  const closeBtn = document.querySelector('.close-button-katz');
  const formModal = document.getElementById('form-katz-modal');
  const btnConcluir = document.getElementById('btn-concluir-katz');

  if (!modal) return;

  // Fechar modal
  const closeModal = () => {
    modal.style.display = 'none';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Salvar resultado do Katz
  if (btnConcluir) {
    btnConcluir.addEventListener('click', () => {
      // Obter valores do modal
      const modalValues = {
        'modal_katz_banho': document.querySelector('input[name="modal_katz_banho"]:checked')?.value,
        'modal_katz_vestir': document.querySelector('input[name="modal_katz_vestir"]:checked')?.value,
        'modal_katz_banheiro': document.querySelector('input[name="modal_katz_banheiro"]:checked')?.value,
        'modal_katz_mobilidade': document.querySelector('input[name="modal_katz_mobilidade"]:checked')?.value,
        'modal_katz_continencia': document.querySelector('input[name="modal_katz_continencia"]:checked')?.value,
        'modal_katz_alimentacao': document.querySelector('input[name="modal_katz_alimentacao"]:checked')?.value,
      };

      // Verificar se todas as respostas foram preenchidas
      const allAnswered = Object.values(modalValues).every(v => v !== undefined);
      if (!allAnswered) {
        alert('Por favor, responda todas as perguntas do teste de Katz.');
        return;
      }

      // Transferir valores para os campos reais do formulário
      const katzFields = [
        { modal: 'modal_katz_banho', real: 'katz_banho' },
        { modal: 'modal_katz_vestir', real: 'katz_vestir' },
        { modal: 'modal_katz_banheiro', real: 'katz_banheiro' },
        { modal: 'modal_katz_mobilidade', real: 'katz_mobilidade' },
        { modal: 'modal_katz_continencia', real: 'katz_continencia' },
        { modal: 'modal_katz_alimentacao', real: 'katz_alimentacao' },
      ];

      katzFields.forEach(field => {
        const value = modalValues[field.modal];
        const selector = `input[name="${field.real}"][value="${value}"]`;
        const element = document.querySelector(selector);

        if (element) {
          element.checked = true;
          element.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });

      // Fechar modal
      closeModal();

      // Salvar formulário
      salvarFormulario();

      // Exibir resultado do Katz
      mostrarKatz();
    });
  }
}

// Sincronização do Katz com AGC-10
function setupAGC10KatzSync() {
  const btnIrKatz = document.getElementById('btn-ir-katz');
  const katzResultContainer = document.getElementById('agc10_katz_resultado');
  const katzScoreDisplay = document.getElementById('agc10_katz_score');
  const katzVazioMsg = document.getElementById('agc10_katz_vazio');
  const funcionalidadeValueInput = document.getElementById('agc10_funcionalidade_value');

  // Botão para ir para Katz
  if (btnIrKatz) {
    btnIrKatz.addEventListener('click', (e) => {
      e.preventDefault();

      const katzModal = document.getElementById('katz-modal');
      if (katzModal) {
        katzModal.style.display = 'block';
      }
    });
  }

  // Monitorar mudanças no Katz
  const katzFields = constants.camposKatz;
  const mainElement = document.querySelector('main');
  if (mainElement) {
    mainElement.addEventListener('change', (e) => {
      if (katzFields.includes(e.target.name)) {
        atualizarAGC10KatzResultado();
      }
    });
  }

  // Função para atualizar o resultado
  function atualizarAGC10KatzResultado() {
    const katzResult = calculations.calcularKatz();

    if (katzResult && katzResult.completo) {
      const { pontos, classificacao } = katzResult;

      let agc10Value;
      if (pontos === 0) {
        agc10Value = '0.0';
      } else if (pontos >= 1 && pontos <= 2) {
        agc10Value = '0.5';
      } else {
        agc10Value = '1.0';
      }

      katzScoreDisplay.textContent = `${pontos} pontos - ${classificacao}`;
      funcionalidadeValueInput.value = agc10Value;

      if (katzResultContainer) {
        katzResultContainer.style.display = 'block';
      }
      if (katzVazioMsg) {
        katzVazioMsg.style.display = 'none';
      }

      // Disparar evento de mudança para atualizar o AGC-10
      funcionalidadeValueInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  // Chamar ao inicializar se Katz já foi preenchido
  setTimeout(() => {
    atualizarAGC10KatzResultado();
  }, 100);
}

// Modal de Teste EDG-4
function setupEDG4Modal() {
  const modal = document.getElementById('edg4-modal');
  const closeBtn = document.querySelector('.close-button-edg4');
  const formModal = document.getElementById('form-edg4-modal');
  const btnConcluir = document.getElementById('btn-concluir-edg4');

  if (!modal) return;

  // Fechar modal
  if (closeBtn) {
    closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
  }
  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

  // Salvar resultado da EDG-4
  if (btnConcluir) {
    btnConcluir.addEventListener('click', () => {
      const modalValues = {
        'modal_edg4_satisfeito': document.querySelector('input[name="modal_edg4_satisfeito"]:checked')?.value,
        'modal_edg4_abandonou': document.querySelector('input[name="modal_edg4_abandonou"]:checked')?.value,
        'modal_edg4_feliz': document.querySelector('input[name="modal_edg4_feliz"]:checked')?.value,
        'modal_edg4_prefere_casa': document.querySelector('input[name="modal_edg4_prefere_casa"]:checked')?.value,
      };

      const allAnswered = Object.values(modalValues).every(v => v !== undefined);
      if (!allAnswered) {
        alert('Por favor, responda todas as perguntas antes de concluir.');
        return;
      }

      const edg4Fields = [
        { modal: 'modal_edg4_satisfeito', real: 'edg4_satisfeito' },
        { modal: 'modal_edg4_abandonou', real: 'edg4_abandonou' },
        { modal: 'modal_edg4_feliz', real: 'edg4_feliz' },
        { modal: 'modal_edg4_prefere_casa', real: 'edg4_prefere_casa' },
      ];

      edg4Fields.forEach(field => {
        const value = modalValues[field.modal];
        const selector = `input[name="${field.real}"][value="${value}"]`;
        const realInput = document.querySelector(selector);
        if (realInput) {
          realInput.checked = true;
          realInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });

      modal.style.display = 'none';
      salvarFormulario();
      mostrarEDG4();
    });
  }
}

// Sincronização da EDG-4 com AGC-10
function setupAGC10EDG4Sync() {
  const btnIrEDG4 = document.getElementById('btn-ir-edg4');
  const edg4ResultContainer = document.getElementById('agc10_edg4_resultado');
  const edg4ScoreDisplay = document.getElementById('agc10_edg4_score');
  const edg4VazioMsg = document.getElementById('agc10_edg4_vazio');
  const depressaoValueInput = document.getElementById('agc10_depressao_value');

  // Botão para ir para EDG-4
  if (btnIrEDG4) {
    btnIrEDG4.addEventListener('click', (e) => {
      e.preventDefault();
      const edg4Modal = document.getElementById('edg4-modal');
      if (edg4Modal) {
        edg4Modal.style.display = 'block';
      }
    });
  }

  // Monitorar mudanças na EDG-4
  const edg4Fields = constants.camposEDG4;
  const mainElement = document.querySelector('main');
  if (mainElement) {
    mainElement.addEventListener('change', (e) => {
      if (edg4Fields.includes(e.target.name)) {
        atualizarAGC10EDG4Resultado();
      }
    });
  }

  function atualizarAGC10EDG4Resultado() {
    const edg4Result = calculations.calcularEDG4();

    if (edg4Result && edg4Result.completo) {
      const { pontos, classificacao } = edg4Result;

      let agc10Value;
      if (pontos <= 1) {
        agc10Value = '0.0';
      } else if (pontos === 2) {
        agc10Value = '0.5';
      } else {
        agc10Value = '1.0';
      }

      if (edg4ScoreDisplay) {
        edg4ScoreDisplay.textContent = `${pontos} pontos - ${classificacao}`;
      }
      if (depressaoValueInput) {
        depressaoValueInput.value = agc10Value;
      }

      if (edg4ResultContainer) {
        edg4ResultContainer.style.display = 'block';
      }
      if (edg4VazioMsg) {
        edg4VazioMsg.style.display = 'none';
      }

      // Selecionar automaticamente o radio correspondente no AGC-10
      const agc10Radio = document.querySelector(`input[name="agc10_depressao"][value="${agc10Value}"]`);
      if (agc10Radio) {
        agc10Radio.checked = true;
        agc10Radio.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }

  setTimeout(() => {
    atualizarAGC10EDG4Resultado();
  }, 100);
}

// Sincronização do 10-CS com AGC-10
function setupAGC10CognicaoSync() {
  const btnIr10CS = document.getElementById('btn-ir-10cs');

  // Botão para ir para 10-CS
  if (btnIr10CS) {
    btnIr10CS.addEventListener('click', (e) => {
      e.preventDefault();

      let target = null;
      const headings = document.querySelectorAll('h2');
      for (const h of headings) {
        if (h.textContent.includes('Cognição') && h.textContent.includes('10-CS')) {
          target = h;
          break;
        }
      }

      if (target) {
        // Abrir seções colapsáveis pai
        let parent = target.closest('section.collapsible');
        while (parent) {
          if (!parent.classList.contains('open')) {
            parent.classList.add('open');
          }
          parent = parent.parentElement?.closest('section.collapsible');
        }

        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      }
    });
  }

  // Botão para ir para AGC-10
  const btnIrAGC10 = document.getElementById('btn-ir-agc10');

  if (btnIrAGC10) {
    btnIrAGC10.addEventListener('click', (e) => {
      e.preventDefault();

      const agc10CognicaoInput = document.querySelector('input[name="agc10_cognicao"]');

      if (agc10CognicaoInput) {
        let section = agc10CognicaoInput.closest('section.collapsible');
        while (section) {
          if (!section.classList.contains('open')) {
            section.classList.add('open');
          }
          section = section.parentElement?.closest('section.collapsible');
        }

        setTimeout(() => {
          agc10CognicaoInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => {
            window.scrollBy({ top: -300, behavior: 'smooth' });
          }, 600);
        }, 50);
      }
    });
  }

  // Monitorar mudanças no 10-CS
  const campos10CS = constants.campos10CS;
  const mainElement = document.querySelector('main');
  if (mainElement) {
    mainElement.addEventListener('change', (e) => {
      if (campos10CS.includes(e.target.name)) {
        atualizarAGC1010CSResultado();
      }
    });
  }

  // Função para atualizar o resultado e auto-selecionar o input
  function atualizarAGC1010CSResultado() {
    const csResult = calculations.calcular10CS();

    if (csResult && csResult.completo) {
      const { pontos } = csResult;

      let agc10Value;
      if (pontos >= 8) {
        agc10Value = '0.0';
      } else if (pontos >= 6) {
        agc10Value = '0.5';
      } else {
        agc10Value = '1.0';
      }

      // Auto-selecionar o input correspondente
      const radioInput = document.querySelector(`input[name="agc10_cognicao"][value="${agc10Value}"]`);
      if (radioInput) {
        radioInput.checked = true;
        radioInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }

  // Chamar ao inicializar se 10-CS já foi preenchido
  setTimeout(() => {
    atualizarAGC1010CSResultado();
  }, 100);
}

// Função para tornar radio buttons desmarcáveis ao clicar novamente
function setupToggleableRadios() {
  const radioInputs = document.querySelectorAll('input[type="radio"]');

  let isUnchecking = false;

  radioInputs.forEach((radio) => {
    const label = radio.closest('label');
    if (label) {
      label.addEventListener('mousedown', function () {
        if (isUnchecking) return;
        radio._wasChecked = radio.checked;
      });
    }

    radio.addEventListener('click', function () {
      if (isUnchecking) return;

      if (this._wasChecked) {
        isUnchecking = true;
        this.checked = false;
        this._wasChecked = false;
        this.dispatchEvent(new Event('change', { bubbles: true }));
        isUnchecking = false;
      }
    });
  });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  bindActions();

  // Tornar radio buttons desmarcáveis
  setupToggleableRadios();

  // Data de nascimento e cálculo de idade
  const dataNascimentoInput = document.getElementById('anamnese_data_nascimento');
  if (dataNascimentoInput) {
    utils.formatDateInput(dataNascimentoInput);

    const idadeInput = document.getElementById('anamnese_idade');
    if (idadeInput) {
      dataNascimentoInput.addEventListener('input', () => {
        idadeInput.value = utils.calculateAge(dataNascimentoInput.value);
        salvarFormulario();
      });
    }
  }

  // Restaurar formulário salvo na sessão
  restaurarFormulario();

  // Limpar campos do Katz (devem sempre começar vazios)
  constants.camposKatz.forEach(campo => {
    const radios = document.querySelectorAll(`input[type="radio"][name="${campo}"]`);
    radios.forEach(radio => {
      radio.checked = false;
    });
  });

  recalcularTodosResultados();
});
