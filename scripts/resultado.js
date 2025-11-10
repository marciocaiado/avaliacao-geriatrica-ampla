document.addEventListener('DOMContentLoaded', () => {
  const resultadoContainer = document.getElementById('resultado-container');
  const salvarPdfButton = document.getElementById('salvar-pdf-resultado');
  const fabPdfButton = document.getElementById('fab-pdf');

  const dados = JSON.parse(localStorage.getItem('dadosAvaliacao'));

  if (dados && resultadoContainer) {
    let html = `<h1>Avaliação de:</h1><h2>${dados.nome} - ${dados.data}</h2><div class="resultado-body">`;

    for (const secao of dados.secoes) {
      if (secao.questoes.length > 0) {
        html += `<h2>${secao.titulo}</h2>`;
        for (const questao of secao.questoes) {
          html += `<div class="q">`;
          html += `<p><strong>${questao.pergunta}</strong></p>`;
          html += `<p>  - ${questao.resposta}</p>`;
          html += `</div>`;
        }
        if (secao.resultado) {
          html += `<div class="resultado"><strong>Resultado:</strong> ${secao.resultado}</div>`;
        }
      }
    }
    html += `</div>`;
    resultadoContainer.innerHTML = html;
  }

  const gerarPdfHandler = () => {
      const { jsPDF } = window.jspdf;
      const sourcePage = document.querySelector('.page') || document.getElementById('resultado-container');
      const nome = (dados && dados.nome) || 'paciente';
      const data = (dados && dados.data) || new Date().toLocaleDateString('pt-BR');

      // Parâmetros A4 fixos
      const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth(); // 210
      const pageHeight = pdf.internal.pageSize.getHeight(); // 297
      const margin = 15; // mm confirmada
      const contentWidthMM = pageWidth - margin * 2; // área útil

      // Definir uma densidade de pixels estável para o canvas offscreen
      const PX_PER_MM = 3.78; // ~96 DPI
      const contentWidthPX = Math.round(contentWidthMM * PX_PER_MM);

      // Criar um container offscreen para renderização estável em A4
      const wrapper = document.createElement('div');
      wrapper.style.position = 'fixed';
      wrapper.style.left = '-10000px';
      wrapper.style.top = '0';
      wrapper.style.width = `${contentWidthPX}px`;
      wrapper.style.padding = '0';
      wrapper.style.background = '#ffffff';

      // Clonar o conteúdo da página para o wrapper mantendo estilos
      const clone = sourcePage.cloneNode(true);
      clone.style.width = '100%';
      clone.style.boxShadow = 'none';
      clone.style.margin = '0';
      clone.style.padding = '0';

      // Remover apenas a última barra de ações dentro do clone
      try {
        const actionsList = clone.querySelectorAll('.actions');
        if (actionsList.length) {
          const lastActions = actionsList[actionsList.length - 1];
          lastActions.parentNode && lastActions.parentNode.removeChild(lastActions);
        }
      } catch (_) { /* ignora se não existir */ }

      // Conteúdo interno: queremos apenas a área útil dentro de .page
      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);

      // Renderizar o wrapper em alta escala para mais nitidez
      html2canvas(wrapper, { scale: 2, useCORS: true, backgroundColor: '#ffffff', windowWidth: contentWidthPX }).then((canvas) => {
        // Remover o wrapper após a captura
        document.body.removeChild(wrapper);

        // Paginação para A4: dividir o canvas em fatias de altura da área útil
        const imgPxWidth = canvas.width;
        const imgPxHeight = canvas.height;

        // Altura útil em px mantendo a mesma escala PX_PER_MM
        const contentHeightMM = pageHeight - margin * 2;
        const contentHeightPX = Math.floor(contentHeightMM * PX_PER_MM * 2); // multiplicado pela escala (2)

        let offset = 0;
        let first = true;
        while (offset < imgPxHeight) {
          const sliceHeightPx = Math.min(contentHeightPX, imgPxHeight - offset);

          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = imgPxWidth; // mesma largura do canvas principal
          pageCanvas.height = sliceHeightPx;
          const ctx = pageCanvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(canvas, 0, offset, imgPxWidth, sliceHeightPx, 0, 0, imgPxWidth, sliceHeightPx);

          const pageImg = pageCanvas.toDataURL('image/png');
          if (!first) pdf.addPage();

          // Preserva proporção do slice ao converter para mm
          const sliceRatio = imgPxWidth / sliceHeightPx; // largura/altura em px
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

        pdf.save(`avaliacao-${nome.replace(/\s+/g, '-')}-${data}.pdf`);
      }).catch((e) => {
        console.error('Erro ao gerar PDF:', e);
      });
  };
  if (salvarPdfButton) salvarPdfButton.addEventListener('click', gerarPdfHandler);
  if (fabPdfButton) fabPdfButton.addEventListener('click', gerarPdfHandler);
});






