document.addEventListener('DOMContentLoaded', () => {
  const resultadoContainer = document.getElementById('resultado-container');
  const resumoContainer = document.getElementById('resumo-tests');
  const emptyStateElement = document.getElementById('resumo-vazio');
  const metaBox = document.getElementById('resumo-meta');
  const metaNome = document.getElementById('resumo-meta-nome');
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

  let resumoSnapshot = null;
  try {
    const rawSnapshot = localStorage.getItem('resumoTestsData');
    resumoSnapshot = rawSnapshot ? JSON.parse(rawSnapshot) : null;
  } catch (error) {
    console.warn('[Resumo] Não foi possível ler resumoTestsData do localStorage:', error);
  }

  const pacienteNome = safeTrim(resumoSnapshot?.paciente?.nome) || safeTrim(dados?.nome);
  const pacienteData = safeTrim(resumoSnapshot?.paciente?.data) || safeTrim(dados?.data);

  const renderPacienteInfo = () => {
    if (!metaBox) return;
    const hasInfo = Boolean(pacienteNome || pacienteData);
    metaBox.hidden = !hasInfo;
    if (!hasInfo) return;
    if (metaNome) metaNome.textContent = pacienteNome || '-';
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

      const PX_PER_MM = 3.78;
      const contentWidthPX = Math.round(contentWidthMM * PX_PER_MM);

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

      html2canvas(wrapper, { scale: 2, useCORS: true, backgroundColor: '#ffffff', windowWidth: contentWidthPX }).then((canvas) => {
        document.body.removeChild(wrapper);

        const imgPxWidth = canvas.width;
        const imgPxHeight = canvas.height;

        const contentHeightMM = pageHeight - margin * 2;
        const contentHeightPX = Math.floor(contentHeightMM * PX_PER_MM * 2);

        let offset = 0;
        let first = true;
        while (offset < imgPxHeight) {
          const sliceHeightPx = Math.min(contentHeightPX, imgPxHeight - offset);

          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = imgPxWidth;
          pageCanvas.height = sliceHeightPx;
          const ctx = pageCanvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(canvas, 0, offset, imgPxWidth, sliceHeightPx, 0, 0, imgPxWidth, sliceHeightPx);

          const pageImg = pageCanvas.toDataURL('image/png');
          if (!first) pdf.addPage();

          const sliceRatio = imgPxWidth / sliceHeightPx;
          let renderW = contentWidthMM;
          let renderH = renderW / sliceRatio;
          if (renderH > contentHeightMM) {
            renderH = contentHeightMM;
            renderW = renderH * sliceRatio;
          }

          pdf.addImage(pageImg, 'PNG', margin, margin, renderW, renderH);

          first = false;
          offset += sliceHeightPx;
        }

        pdf.save(`resumo-avaliacao-${nome.replace(/\s+/g, '-')}-${data}.pdf`);
      }).catch((e) => {
        console.error('Erro ao gerar PDF:', e);
      });
  };
  if (salvarPdfButton) salvarPdfButton.addEventListener('click', gerarPdfHandler);
  if (fabPdfButton) fabPdfButton.addEventListener('click', gerarPdfHandler);
});
