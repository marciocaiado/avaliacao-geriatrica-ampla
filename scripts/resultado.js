document.addEventListener('DOMContentLoaded', () => {
  const resultadoContainer = document.getElementById('resultado-container');
  const salvarPdfButton = document.getElementById('salvar-pdf-resultado');
  const fabPdfButton = document.getElementById('fab-pdf');

  const dados = JSON.parse(localStorage.getItem('dadosAvaliacao'));

  if (dados && resultadoContainer) {
    let html = `<div class="resultado-body">`;

    // Exibir dados da anamnese se existirem
    if (dados.anamnese) {
      html += `<section class="anamnese-section">`;
      html += `<h2>Anamnese</h2>`;
      html += `<div class="section-body">`;

      // Função auxiliar para obter valor
      const getValor = (campo) => {
        const item = dados.anamnese[campo];
        if (!item) return null;
        if (typeof item === 'string') return item;
        if (Array.isArray(item)) return item.join(', ');
        if (item.value !== undefined) return item.value;
        if (item.label !== undefined) return item.label;
        return item;
      };

      // Mapeamento de labels
      const labelMap = {
        'anamnese_nome': 'Nome',
        'anamnese_data_nascimento': 'Data de Nascimento',
        'anamnese_idade': 'Idade',
        'anamnese_num_atendimento': 'Nº Atendimento',
        'anamnese_sexo': 'Sexo',
        'anamnese_aposentado': 'Aposentado',
        'anamnese_profissao': 'Profissão',
        'anamnese_renda': 'Renda',
        'anamnese_naturalidade': 'Naturalidade',
        'anamnese_escolaridade': 'Escolaridade',
        'anamnese_cor': 'Cor',
        'anamnese_estado_civil': 'Estado Civil',
        'anamnese_filhos': 'Filhos',
        'anamnese_acompanhante': 'Acompanhante',
        'anamnese_grau_parentesco': 'Grau de Parentesco',
        'polifarmacia': 'Polifarmácia',
        'ppi_benzodiazepinicos': 'PPI - Benzodiazepínicos',
        'ppi_opioides': 'PPI - Opioides',
        'ppi_anticolinergicos': 'PPI - Anticolinérgicos',
        'ppi_sedativos': 'PPI - Sedativos',
        'ppi_relaxantes': 'PPI - Relaxantes Musculares',
        'ppi_antidepressivos': 'PPI - Antidepressivos Tricíclicos',
        'ppi_antipsicoticos': 'PPI - Antipsicóticos',
        'ppi_estabilizadores': 'PPI - Estabilizadores de Humor',
        'medicamentos_alergia': 'Alergias Medicamentosas',
        'internacoes': 'Internações não programadas',
        'vacina_influenza': 'Vacina Influenza',
        'vacina_pneumonia': 'Vacina Pneumonia',
        'vacina_covid': 'Vacina COVID-19',
        'vacina_tetano': 'Vacina Tétano',
        'vacina_herpes': 'Vacina Herpes Zoster',
        'vacina_vsr': 'Vacina VSR',
        'vacina_meningococica': 'Vacina Meningocócica',
        'vacina_hepatite': 'Vacina Hepatite B',
        'morbidade_hipertensao': 'Hipertensão',
        'morbidade_diabetes': 'Diabetes',
        'morbidade_renal': 'Doença Renal Crônica',
        'morbidade_outra': 'Outras Morbidades',
        'patologia_ave': 'AVE',
        'patologia_iam': 'IAM',
        'patologia_outra': 'Outras Patologias',
        'cirurgias_previas': 'Cirurgias Prévias',
        'antecedentes_familiares': 'Antecedentes Familiares',
        'habito_tabagismo': 'Tabagismo',
        'habito_etilismo': 'Etilismo',
        'habito_sedentarismo': 'Sedentarismo',
        'habitos_observacao': 'Observações sobre hábitos',
        'consumo_leite': 'Consumo de Leite e Derivados',
        'consumo_frutas': 'Consumo de Frutas e Verduras',
        'consumo_proteinas': 'Consumo de Proteínas',
        'ingesta_hidrica': 'Ingesta Hídrica',
        'perda_ponderal': 'Perda Ponderal',
        'sintomas_gerais': 'Sintomas Gerais',
        'aparelho_respiratorio': 'Aparelho Respiratório',
        'aparelho_cardiovascular': 'Aparelho Cardiovascular',
        'sistema_digestorio': 'Sistema Digestório',
        'protese_dentaria': 'Prótese Dentária Inadequada',
        'lesoes_orais': 'Lesões Orais',
        'disfagia': 'Disfagia',
        'incontinencia_fecal': 'Incontinência Fecal',
        'sistema_genitourinario': 'Sistema Genitourinário',
        'incontinencia_urinaria': 'Incontinência Urinária',
        'sistema_osteoarticular': 'Sistema Osteoarticular',
        'quedas_ultimo_ano': 'Quedas no Último Ano',
        'dispositivo_marcha': 'Dispositivo de Marcha',
        'sono': 'Sono',
        'humor': 'Humor',
        'neurologico': 'Neurológico',
        'cognicao': 'Cognição',
        'deficit_visual': 'Déficit Visual',
        'deficit_auditivo': 'Déficit Auditivo',
        'peso': 'Peso',
        'altura': 'Altura',
        'imc': 'IMC',
        'forca_preensao': 'Força de Preensão',
        'circunferencia_panturrilha': 'Circunferência da Panturrilha',
        'pa': 'PA',
        'fc': 'FC',
        'fr': 'FR',
        'sat': 'Saturação',
        'tec': 'TEC',
        'hgt': 'HGT',
        'exame_geral': 'Exame Geral',
        'exame_neuro': 'Exame Neurológico',
        'exame_respiratorio': 'Exame Respiratório',
        'exame_cardiovascular': 'Exame Cardiovascular',
        'exame_abdome': 'Exame de Abdome',
        'exame_membros': 'Exame de Membros',
        'teste_marcha': 'Teste de Velocidade de Marcha',
        'teste_sentar_levantar': 'Teste Sentar e Levantar',
        'rastreio_delirium': 'Rastreio de Delirium',
        'rastreio_cognitivo': 'Rastreio Cognitivo 10-CS',
        'rastreio_cognitivo_valor': 'Valor do Rastreio Cognitivo',
        'anamnese_bom_dia': 'O que é um bom dia para você?',
        'anamnese_importante': 'Quem é importante para você?',
        'anamnese_alegria': 'O que lhe traz alegria?',
        'anamnese_vale_pena': 'O que faz a vida valer a pena?',
        'anamnese_medos': 'Medos e preocupações',
        'anamnese_resultado_hospital': 'Resultado desejado no hospital',
        'anamnese_gostaria_fazer': 'O que gostaria de fazer',
        'anamnese_objetivos': 'Objetivos se a saúde piorar',
        'anamnese_confia_decisoes': 'Pessoa de confiança'
      };

      // Organizar campos por categoria
      const categorias = {
        'Identificação': ['anamnese_nome', 'anamnese_data_nascimento', 'anamnese_idade', 'anamnese_num_atendimento', 'anamnese_sexo', 'anamnese_aposentado', 'anamnese_profissao', 'anamnese_renda', 'anamnese_naturalidade', 'anamnese_escolaridade', 'anamnese_cor', 'anamnese_estado_civil', 'anamnese_filhos'],
        'Acompanhante': ['anamnese_acompanhante', 'anamnese_grau_parentesco'],
        'Valores': ['anamnese_bom_dia', 'anamnese_importante', 'anamnese_alegria', 'anamnese_vale_pena', 'anamnese_medos', 'anamnese_resultado_hospital', 'anamnese_gostaria_fazer', 'anamnese_objetivos', 'anamnese_confia_decisoes'],
        'Medicamentos - Informações Gerais': ['polifarmacia', 'ppi_benzodiazepinicos', 'ppi_opioides', 'ppi_anticolinergicos', 'ppi_sedativos', 'ppi_relaxantes', 'ppi_antidepressivos', 'ppi_antipsicoticos', 'ppi_estabilizadores', 'medicamentos_alergia'],
        'Multicomplexidade': ['internacoes', 'vacina_influenza', 'vacina_pneumonia', 'vacina_covid', 'vacina_tetano', 'vacina_herpes', 'vacina_vsr', 'vacina_meningococica', 'vacina_hepatite', 'morbidade_hipertensao', 'morbidade_diabetes', 'morbidade_renal', 'morbidade_outra', 'patologia_ave', 'patologia_iam', 'patologia_outra', 'cirurgias_previas', 'antecedentes_familiares', 'habito_tabagismo', 'habito_etilismo', 'habito_sedentarismo', 'habitos_observacao'],
        'Inventário Alimentar': ['consumo_leite', 'consumo_frutas', 'consumo_proteinas', 'ingesta_hidrica'],
        'Interrogatório Sintomatológico': ['perda_ponderal', 'sintomas_gerais', 'aparelho_respiratorio', 'aparelho_cardiovascular', 'sistema_digestorio', 'protese_dentaria', 'lesoes_orais', 'disfagia', 'incontinencia_fecal', 'sistema_genitourinario', 'incontinencia_urinaria', 'sistema_osteoarticular', 'quedas_ultimo_ano', 'dispositivo_marcha', 'sono', 'humor', 'neurologico', 'cognicao', 'deficit_visual', 'deficit_auditivo'],
        'Exame Físico': ['peso', 'altura', 'imc', 'forca_preensao', 'circunferencia_panturrilha', 'pa', 'fc', 'fr', 'sat', 'tec', 'hgt', 'exame_geral', 'exame_neuro', 'exame_respiratorio', 'exame_cardiovascular', 'exame_abdome', 'exame_membros'],
        'Mobilidade': ['teste_marcha', 'teste_sentar_levantar'],
        'Mente': ['rastreio_delirium', 'rastreio_cognitivo', 'rastreio_cognitivo_valor']
      };

      // Renderizar por categoria
      for (const [categoria, campos] of Object.entries(categorias)) {
        const camposPreenchidos = campos.filter(c => dados.anamnese[c]);
        if (camposPreenchidos.length === 0) continue;

        html += `<h3>${categoria}</h3>`;

        // Se for a categoria Valores, renderizar tudo como texto corrido (linhas)
        if (categoria === 'Valores') {
          camposPreenchidos.forEach(campo => {
            const label = labelMap[campo] || campo;
            const valor = getValor(campo);
            html += `<div class="texto-item"><strong>${label}:</strong> ${valor}</div>`;
          });
        } else {
          // Para outras categorias, manter a lógica de grid para textos curtos
          const camposCurtos = camposPreenchidos.filter(c => {
            const valor = getValor(c);
            return valor && valor.length < 100;
          });

          if (camposCurtos.length > 0) {
            html += `<div class="info-grid">`;
            camposCurtos.forEach(campo => {
              const label = labelMap[campo] || campo;
              const valor = getValor(campo);
              html += `<div class="info-item"><span class="info-label">${label}:</span> <span class="info-value">${valor}</span></div>`;
            });
            html += `</div>`;
          }

          // Campos de texto longo
          const camposLongos = camposPreenchidos.filter(c => {
            const valor = getValor(c);
            return valor && valor.length >= 100;
          });

          camposLongos.forEach(campo => {
            const label = labelMap[campo] || campo;
            const valor = getValor(campo);
            html += `<div class="texto-item"><strong>${label}:</strong> ${valor}</div>`;
          });
        }

        // Renderizar medicamentos logo após "Medicamentos - Informações Gerais"
        if (categoria === 'Medicamentos - Informações Gerais' && dados.anamnese.medicamentos && dados.anamnese.medicamentos.length > 0) {
          html += `<h3>Medicamentos em Uso</h3>`;

          dados.anamnese.medicamentos.forEach((med, index) => {
            html += `<div class="medicamento-card">`;
            html += `<h4>Medicamento ${index + 1}</h4>`;
            html += `<div class="info-grid">`;

            if (med.nome) {
              html += `<div class="info-item"><span class="info-label">Nome:</span> <span class="info-value">${med.nome}</span></div>`;
            }
            if (med.justificativa) {
              html += `<div class="info-item"><span class="info-label">Justificativa:</span> <span class="info-value">${med.justificativa}</span></div>`;
            }
            if (med.dose) {
              html += `<div class="info-item"><span class="info-label">Dose e Posologia:</span> <span class="info-value">${med.dose}</span></div>`;
            }
            if (med.tempo) {
              html += `<div class="info-item"><span class="info-label">Tempo de Uso:</span> <span class="info-value">${med.tempo}</span></div>`;
            }

            html += `</div></div>`;
          });
        }
      }

      html += `</div></section>`;
    }

    for (const secao of dados.secoes) {
      // Adicionar condição para pular seções que duplicam informações da anamnese
      const tituloNormalizado = secao.titulo.toLowerCase();
      if (tituloNormalizado.includes('identificação') || tituloNormalizado.includes('dados pessoais') || tituloNormalizado.includes('anamnese')) {
        continue; // Pula esta seção se for considerada redundante
      }

      if (secao.questoes.length > 0) {
        html += `<section><h2>${secao.titulo}</h2><div class="section-body">`;

        // Agrupar questões em grid quando apropriado (respostas curtas)
        const respostasCurtas = secao.questoes.filter(q => q.resposta.length < 50);
        const respostasLongas = secao.questoes.filter(q => q.resposta.length >= 50);

        if (respostasCurtas.length > 0) {
          html += `<div class="info-grid">`;
          for (const questao of respostasCurtas) {
            html += `<div class="info-item"><span class="info-label">${questao.pergunta}:</span> <span class="info-value">${questao.resposta}</span></div>`;
          }
          html += `</div>`;
        }

        if (respostasLongas.length > 0) {
          for (const questao of respostasLongas) {
            html += `<div class="texto-item"><strong>${questao.pergunta}:</strong> ${questao.resposta}</div>`;
          }
        }

        if (secao.resultado) {
          html += `<div class="resultado"><strong>Resultado:</strong> ${secao.resultado}</div>`;
        }
        html += `</div></section>`;
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
      wrapper.style.padding = '20px';
      wrapper.style.background = '#ffffff';

      // Clonar o conteúdo da página para o wrapper mantendo estilos
      const clone = sourcePage.cloneNode(true);
      clone.style.width = '100%';
      clone.style.boxShadow = 'none';
      clone.style.margin = '0';
      clone.style.padding = '0';

      // Aplicar estilos inline para garantir renderização correta
      const applyInlineStyles = (element) => {
        const computedStyle = window.getComputedStyle(element);

        // Aplicar estilos importantes inline
        element.style.display = computedStyle.display;
        element.style.gridTemplateColumns = computedStyle.gridTemplateColumns;
        element.style.gap = computedStyle.gap;
        element.style.padding = computedStyle.padding;
        element.style.margin = computedStyle.margin;
        element.style.backgroundColor = computedStyle.backgroundColor;
        element.style.border = computedStyle.border;
        element.style.borderRadius = computedStyle.borderRadius;
        element.style.fontSize = computedStyle.fontSize;
        element.style.fontWeight = computedStyle.fontWeight;
        element.style.color = computedStyle.color;
        element.style.pageBreakInside = 'avoid';
        element.style.breakInside = 'avoid';

        // Recursivamente aplicar aos filhos
        Array.from(element.children).forEach(child => applyInlineStyles(child));
      };

      // Aplicar estilos inline aos elementos importantes
      clone.querySelectorAll('.info-grid, .info-item, .texto-item, section, h2, h3').forEach(el => {
        applyInlineStyles(el);
      });

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
      html2canvas(wrapper, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        windowWidth: contentWidthPX,
        logging: false,
        imageTimeout: 0,
        removeContainer: false
      }).then((canvas) => {
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
        alert('Erro ao gerar PDF. Por favor, tente novamente.');
      });
  };
  if (salvarPdfButton) salvarPdfButton.addEventListener('click', gerarPdfHandler);
  if (fabPdfButton) fabPdfButton.addEventListener('click', gerarPdfHandler);
});






