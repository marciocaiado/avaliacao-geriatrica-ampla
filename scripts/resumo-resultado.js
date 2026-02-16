document.addEventListener('DOMContentLoaded', () => {
  const resultadoContainer = document.getElementById('resultado-container');
  const resumoContainer = document.getElementById('resumo-tests');
  const emptyStateElement = document.getElementById('resumo-vazio');
  const metaBox = document.getElementById('resumo-meta');
  const metaNome = document.getElementById('resumo-meta-nome');
  const metaIdade = document.getElementById('resumo-meta-idade');
  const metaAtendimento = document.getElementById('resumo-meta-atendimento');
  const metaData = document.getElementById('resumo-meta-data');
  const salvarPdfButton = document.getElementById('salvar-pdf-resultado');
  const fabPdfButton = document.getElementById('fab-pdf');

  const resumoHTML = localStorage.getItem('resumoTestsHTML');

  const safeTrim = (value) => (typeof value === 'string' ? value.trim() : '');

  let dados = null;
  try {
    const raw = localStorage.getItem('dadosAvaliacao');
    dados = raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn('[Resumo] Não foi possível ler dadosAvaliacao do localStorage:', error);
  }

  // Ler dados do formulário do sessionStorage (persistence.js) como fonte principal
  let formState = null;
  try {
    const rawForm = sessionStorage.getItem('formState');
    formState = rawForm ? JSON.parse(rawForm) : null;
  } catch (error) {
    console.warn('[Resumo] Não foi possível ler formState do sessionStorage:', error);
  }

  const pacienteNome = safeTrim(formState?.anamnese_nome) || safeTrim(dados?.nome);
  const pacienteIdade = safeTrim(formState?.anamnese_idade) || safeTrim(dados?.idade);
  const pacienteAtendimento = safeTrim(formState?.anamnese_num_atendimento) || safeTrim(dados?.numAtendimento);
  const pacienteData = safeTrim(dados?.data) || new Date().toLocaleDateString('pt-BR');

  const renderPacienteInfo = () => {
    if (!metaBox) return;
    const hasInfo = Boolean(pacienteNome || pacienteIdade || pacienteAtendimento);
    metaBox.hidden = !hasInfo;
    if (!hasInfo) return;
    if (metaNome) metaNome.textContent = pacienteNome || '-';
    if (metaIdade) metaIdade.textContent = pacienteIdade ? `${pacienteIdade} anos` : '-';
    if (metaAtendimento) metaAtendimento.textContent = pacienteAtendimento || '-';
    if (metaData) metaData.textContent = pacienteData || '-';
  };

  const toggleEmptyState = (hasContent) => {
    if (!emptyStateElement) return;
    emptyStateElement.hidden = !!hasContent;
  };

  const renderFallbackResumo = () => {
    if (!resumoContainer) return false;

    const itensSnapshot = Array.isArray(resumoSnapshot?.itens) ? resumoSnapshot.itens : [];
    if (itensSnapshot.length) {
      resumoContainer.innerHTML = itensSnapshot.map(({ html }) => `<div class="item">${html}</div>`).join('');
      return true;
    }

    const secoes = Array.isArray(dados?.secoes) ? dados.secoes : [];
    if (!secoes.length) return false;

    const blocos = secoes.map(({ titulo, resultado }) => {
      const linhas = (resultado || '')
        .split(/\n+/)
        .map((linha) => linha.trim())
        .filter(Boolean);
      const corpo = linhas.length ? linhas.map((linha) => `<div>${linha}</div>`).join('') : '<div>-</div>';
      return `<div class="item"><strong>${titulo}:</strong><div>${corpo}</div></div>`;
    }).join('');

    resumoContainer.innerHTML = blocos;
    return true;
  };

  if (resumoContainer) {
    if (resumoHTML && resumoHTML.trim()) {
      resumoContainer.innerHTML = resumoHTML;
      toggleEmptyState(true);
    } else if (renderFallbackResumo()) {
      toggleEmptyState(true);
    } else {
      resumoContainer.innerHTML = '';
      toggleEmptyState(false);
    }
  } else if (resultadoContainer && !resultadoContainer.querySelector('#resumo-vazio')) {
    const fallbackMessage = document.createElement('p');
    fallbackMessage.textContent = 'Não há dados para exibir. Volte e realize a avaliação.';
    resultadoContainer.appendChild(fallbackMessage);
  }

  renderPacienteInfo();

  const gerarPdfHandler = () => {
      const { jsPDF } = window.jspdf;
      const sourcePage = document.querySelector('.page') || document.getElementById('resultado-container');
      const nome = pacienteNome || 'paciente';
      const data = pacienteData || new Date().toLocaleDateString('pt-BR');

      const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidthMM = pageWidth - margin * 2;
      const contentHeightMM = pageHeight - margin * 2;

      const PX_PER_MM = 3.78;
      const contentWidthPX = Math.round(contentWidthMM * PX_PER_MM);
      const pageHeightCSS = Math.floor(contentHeightMM * PX_PER_MM);

      const wrapper = document.createElement('div');
      wrapper.style.position = 'fixed';
      wrapper.style.left = '-10000px';
      wrapper.style.top = '0';
      wrapper.style.width = `${contentWidthPX}px`;
      wrapper.style.padding = '0';
      wrapper.style.background = '#ffffff';

      const clone = sourcePage.cloneNode(true);
      clone.style.width = '100%';
      clone.style.boxShadow = 'none';
      clone.style.margin = '0';
      clone.style.padding = '0';

      try {
        const actionsList = clone.querySelectorAll('.actions');
        if (actionsList.length) {
          const lastActions = actionsList[actionsList.length - 1];
          lastActions.parentNode && lastActions.parentNode.removeChild(lastActions);
        }
      } catch (_) { }

      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);

      // Ajustar layout para evitar cortar conteúdo entre páginas do PDF
      (() => {
        const SEL = 'h2, h3, .item, .resultado.meta > div, p';
        let passes = 30;
        while (passes-- > 0) {
          let changed = false;
          const wTop = wrapper.getBoundingClientRect().top;
          for (const el of wrapper.querySelectorAll(SEL)) {
            const r = el.getBoundingClientRect();
            const top = r.top - wTop;
            const bottom = r.bottom - wTop;
            const h = bottom - top;
            if (h <= 0 || h >= pageHeightCSS * 0.9) continue;
            const pTop = Math.floor(top / pageHeightCSS);
            const pBot = Math.floor((bottom - 1) / pageHeightCSS);
            if (pTop !== pBot) {
              const spacer = document.createElement('div');
              spacer.style.height = `${(pTop + 1) * pageHeightCSS - top + 2}px`;
              el.parentNode.insertBefore(spacer, el);
              changed = true;
              break;
            }
          }
          if (!changed) break;
        }
        // Evitar títulos órfãos (título em uma página, conteúdo na seguinte)
        let hPasses = 10;
        while (hPasses-- > 0) {
          let changed = false;
          const wTop = wrapper.getBoundingClientRect().top;
          for (const heading of wrapper.querySelectorAll('h2, h3, h4')) {
            const next = heading.nextElementSibling;
            if (!next) continue;
            const hTop = heading.getBoundingClientRect().top - wTop;
            const nTop = next.getBoundingClientRect().top - wTop;
            const hPage = Math.floor(hTop / pageHeightCSS);
            const nPage = Math.floor(nTop / pageHeightCSS);
            if (nPage > hPage) {
              const spacer = document.createElement('div');
              spacer.style.height = `${(hPage + 1) * pageHeightCSS - hTop + 2}px`;
              heading.parentNode.insertBefore(spacer, heading);
              changed = true;
              break;
            }
          }
          if (!changed) break;
        }
      })();

      html2canvas(wrapper, { scale: 2, useCORS: true, backgroundColor: '#ffffff', windowWidth: contentWidthPX }).then((canvas) => {
        document.body.removeChild(wrapper);

        const imgPxWidth = canvas.width;
        const imgPxHeight = canvas.height;
        const contentHeightPX = Math.floor(contentHeightMM * PX_PER_MM * 2);

        let offset = 0;
        let first = true;
        while (offset < imgPxHeight) {
          const cutHeight = Math.min(contentHeightPX, imgPxHeight - offset);

          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = imgPxWidth;
          pageCanvas.height = cutHeight;
          const ctx = pageCanvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(canvas, 0, offset, imgPxWidth, cutHeight, 0, 0, imgPxWidth, cutHeight);

          const pageImg = pageCanvas.toDataURL('image/png');
          if (!first) pdf.addPage();

          const sliceRatio = imgPxWidth / cutHeight;
          let renderW = contentWidthMM;
          let renderH = renderW / sliceRatio;
          if (renderH > contentHeightMM) {
            renderH = contentHeightMM;
            renderW = renderH * sliceRatio;
          }

          pdf.addImage(pageImg, 'PNG', margin, margin, renderW, renderH);

          first = false;
          offset += cutHeight;
        }

        pdf.save(`resumo-avaliacao-${nome.replace(/\s+/g, '-')}-${data}.pdf`);
      }).catch((e) => {
        console.error('Erro ao gerar PDF:', e);
      });
  };
  if (salvarPdfButton) salvarPdfButton.addEventListener('click', gerarPdfHandler);
  if (fabPdfButton) fabPdfButton.addEventListener('click', gerarPdfHandler);
});
