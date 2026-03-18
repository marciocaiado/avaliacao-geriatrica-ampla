document.addEventListener('DOMContentLoaded', () => {
  const resultadoContainer = document.getElementById('resultado-container');
  const salvarPdfButton = document.getElementById('salvar-pdf-resultado');
  const fabPdfButton = document.getElementById('fab-pdf');
  const salvarDocxButton = document.getElementById('salvar-docx-resultado');
  const fabDocxButton = document.getElementById('fab-docx');

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
        'anamnese_religiao': 'Religião',
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
        'panturrilha': 'Panturrilha',
        'peso': 'Peso',
        'altura': 'Altura',
        'imc': 'IMC',
        'forca_preensao': 'Força de Preensão',
        'circunferencia_panturrilha': 'Circunferência da Panturrilha',
        'pas': 'PAS',
        'pad': 'PAD',
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
        'anamnese_confia_decisoes': 'Pessoa de confiança',
        'anamnese_procedimentos_invasivos': 'Desejos sobre procedimentos invasivos',
        'anamnese_morte': 'O que seria pior do que a morte',
        'perda_peso': 'Perda de peso ≥ 4,5 Kg no último ano',
        'perda_peso_quantidade': 'Quantidade de perda de peso',
        'morbidade_ave': 'AVE',
        'morbidade_iam': 'IAM',
        'plano_cuidados': 'Plano de Cuidados',
        'plano_cuidados_ampla': 'Plano de Cuidados'
      };

      // Organizar campos por categoria
      const categorias = {
        'Identificação': ['anamnese_nome', 'anamnese_data_nascimento', 'anamnese_idade', 'anamnese_num_atendimento', 'anamnese_sexo', 'anamnese_aposentado', 'anamnese_profissao', 'anamnese_renda', 'anamnese_naturalidade', 'anamnese_escolaridade', 'anamnese_cor', 'anamnese_estado_civil', 'anamnese_filhos', 'anamnese_religiao'],
        'Acompanhante': ['anamnese_acompanhante', 'anamnese_grau_parentesco'],
        'Valores': ['anamnese_bom_dia', 'anamnese_importante', 'anamnese_alegria', 'anamnese_vale_pena', 'anamnese_medos', 'anamnese_resultado_hospital', 'anamnese_gostaria_fazer', 'anamnese_objetivos', 'anamnese_confia_decisoes', 'anamnese_procedimentos_invasivos', 'anamnese_morte'],
        'Medicamentos - Informações Gerais': ['polifarmacia', 'ppi_benzodiazepinicos', 'ppi_opioides', 'ppi_anticolinergicos', 'ppi_sedativos', 'ppi_relaxantes', 'ppi_antidepressivos', 'ppi_antipsicoticos', 'ppi_estabilizadores', 'medicamentos_alergia'],
        'Multicomplexidade': ['perda_peso', 'perda_peso_quantidade', 'vacina_influenza', 'vacina_pneumonia', 'vacina_covid', 'vacina_tetano', 'vacina_herpes', 'vacina_vsr', 'vacina_meningococica', 'vacina_hepatite', 'morbidade_hipertensao', 'morbidade_diabetes', 'morbidade_renal', 'morbidade_ave', 'morbidade_iam', 'morbidade_outra', 'cirurgias_previas', 'antecedentes_familiares', 'habito_tabagismo', 'habito_etilismo', 'habito_sedentarismo', 'habitos_observacao'],
        'Inventário Alimentar': ['consumo_leite', 'consumo_frutas', 'consumo_proteinas', 'ingesta_hidrica'],
        'Interrogatório Sintomatológico': ['perda_ponderal', 'sintomas_gerais', 'aparelho_respiratorio', 'aparelho_cardiovascular', 'sistema_digestorio', 'protese_dentaria', 'lesoes_orais', 'disfagia', 'incontinencia_fecal', 'sistema_genitourinario', 'incontinencia_urinaria', 'sistema_osteoarticular', 'quedas_ultimo_ano', 'dispositivo_marcha', 'sono', 'humor', 'neurologico', 'cognicao', 'deficit_visual', 'deficit_auditivo'],
        'Exame Físico': ['panturrilha', 'peso', 'altura', 'imc', 'forca_preensao', 'circunferencia_panturrilha', 'pas', 'pad', 'fc', 'fr', 'sat', 'tec', 'hgt', 'exame_geral', 'exame_neuro', 'exame_respiratorio', 'exame_cardiovascular', 'exame_abdome', 'exame_membros'],
        'Mente': ['rastreio_delirium', 'rastreio_cognitivo', 'rastreio_cognitivo_valor'],
        'Plano de Cuidados': ['plano_cuidados', 'plano_cuidados_ampla']
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
              let valor = getValor(campo);

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
      // Pular seções que duplicam informações da anamnese
      const tituloNormalizado = secao.titulo.toLowerCase();
      if (tituloNormalizado.includes('identificação') || tituloNormalizado.includes('dados pessoais') || tituloNormalizado.includes('anamnese')) {
        continue;
      }

      const temQuestoes = secao.questoes && secao.questoes.length > 0;
      const temResultado = secao.resultado;

      if (temQuestoes || temResultado) {
        html += `<section><h2>${secao.titulo}</h2><div class="section-body">`;

        if (temQuestoes) {
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
        }

        if (temResultado) {
          html += `<div class="resultado">${secao.resultado}</div>`;
        }
        html += `</div></section>`;
      }
    }
    // Resumo dos testes é exibido nas seções individuais acima

    html += `</div>`;
    resultadoContainer.innerHTML = html;
  }

  const sanitizeFilePart = (value, fallback = 'paciente') => {
    const normalized = String(value || fallback)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\\/:*?"<>|]+/g, '-')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    return normalized || fallback;
  };

  const buildDocxRuns = (node, inherited = {}) => {
    const docxLib = window.docx;
    if (!docxLib || !node) return [];

    const { TextRun } = docxLib;
    const runs = [];
    const style = {
      bold: Boolean(inherited.bold),
      italics: Boolean(inherited.italics)
    };

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.replace(/\s+/g, ' ').trim();
      if (text) runs.push(new TextRun({ text, bold: style.bold, italics: style.italics }));
      return runs;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return runs;

    const tagName = node.tagName.toUpperCase();
    const nextStyle = {
      bold: style.bold || tagName === 'STRONG' || tagName === 'B',
      italics: style.italics || tagName === 'EM' || tagName === 'I'
    };

    if (tagName === 'BR') {
      runs.push(new TextRun({ text: '', break: 1, bold: nextStyle.bold, italics: nextStyle.italics }));
      return runs;
    }

    Array.from(node.childNodes).forEach((child) => {
      const childRuns = buildDocxRuns(child, nextStyle);
      childRuns.forEach((run) => runs.push(run));
    });

    return runs;
  };

  const textFromElement = (element) => (element ? element.textContent.replace(/\s+/g, ' ').trim() : '');

  const buildResultadoDocxChildren = () => {
    const docxLib = window.docx;
    const {
      Paragraph,
      TextRun,
      HeadingLevel,
      AlignmentType
    } = docxLib;

    const sourcePage = document.querySelector('.page') || document.getElementById('resultado-container');
    const sections = Array.from(sourcePage.querySelectorAll('#resultado-container > .resultado-body > section, #resultado-container > section'));
    const children = [];
    const titulo = 'Resultado da Avaliação';

    children.push(new Paragraph({
      text: titulo,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 }
    }));

    sections.forEach((section) => {
      const h2 = section.querySelector(':scope > h2');
      if (h2) {
        children.push(new Paragraph({
          text: textFromElement(h2),
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 240, after: 120 }
        }));
      }

      const body = section.querySelector(':scope > .section-body') || section;
      Array.from(body.children).forEach((element) => {
        if (element.matches('h3')) {
          children.push(new Paragraph({
            text: textFromElement(element),
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 180, after: 120 }
          }));
          return;
        }

        if (element.matches('.info-grid')) {
          element.querySelectorAll(':scope > .info-item').forEach((item) => {
            const label = textFromElement(item.querySelector('.info-label')).replace(/:\s*$/, '');
            const value = textFromElement(item.querySelector('.info-value'));
            children.push(new Paragraph({
              children: [
                new TextRun({ text: `${label}: `, bold: true }),
                new TextRun(value || '-')
              ],
              spacing: { after: 90 }
            }));
          });
          return;
        }

        if (element.matches('.texto-item')) {
          const strong = element.querySelector('strong');
          const label = textFromElement(strong).replace(/:\s*$/, '');
          const clone = element.cloneNode(true);
          if (clone.querySelector('strong')) clone.querySelector('strong').remove();
          const value = textFromElement(clone);
          children.push(new Paragraph({
            children: [
              new TextRun({ text: `${label}: `, bold: true }),
              new TextRun(value || '-')
            ],
            spacing: { after: 120 }
          }));
          return;
        }

        if (element.matches('.medicamento-card')) {
          const cardTitle = textFromElement(element.querySelector('h4'));
          if (cardTitle) {
            children.push(new Paragraph({
              text: cardTitle,
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 120, after: 80 }
            }));
          }
          element.querySelectorAll('.info-item').forEach((item) => {
            const label = textFromElement(item.querySelector('.info-label')).replace(/:\s*$/, '');
            const value = textFromElement(item.querySelector('.info-value'));
            children.push(new Paragraph({
              children: [
                new TextRun({ text: `${label}: `, bold: true }),
                new TextRun(value || '-')
              ],
              spacing: { after: 80 }
            }));
          });
          return;
        }

        if (element.matches('.resultado')) {
          const resultBlocks = Array.from(element.children);
          if (resultBlocks.length) {
            resultBlocks.forEach((block) => {
              const text = textFromElement(block);
              if (text) {
                children.push(new Paragraph({
                  children: buildDocxRuns(block),
                  spacing: { after: 90 }
                }));
              }
            });
          } else {
            const text = textFromElement(element);
            if (text) {
              children.push(new Paragraph({
                text,
                spacing: { after: 90 }
              }));
            }
          }
          return;
        }

        const text = textFromElement(element);
        if (text) {
          children.push(new Paragraph({
            children: buildDocxRuns(element),
            spacing: { after: 90 }
          }));
        }
      });
    });

    return children;
  };

  const gerarDocxHandler = async () => {
    const docxLib = window.docx;
    if (!docxLib || typeof docxLib.Document !== 'function' || typeof docxLib.Packer?.toBlob !== 'function') {
      alert('A exportação em DOCX não está disponível no momento.');
      return;
    }

    const { Document, Packer } = docxLib;
    const nome = (dados && dados.nome) || 'paciente';
    const data = (dados && dados.data) || new Date().toLocaleDateString('pt-BR');
    const fileName = `avaliacao-${sanitizeFilePart(nome)}-${sanitizeFilePart(data, 'data')}.docx`;

    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: buildResultadoDocxChildren()
        }]
      });

      const blob = await Packer.toBlob(doc);
      if (typeof window.saveAs === 'function') {
        window.saveAs(blob, fileName);
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Erro ao gerar DOCX:', error);
      alert('Erro ao gerar DOCX. Por favor, tente novamente.');
    }
  };

  const gerarPdfHandler = () => {
      const { jsPDF } = window.jspdf;
      const sourcePage = document.querySelector('.page') || document.getElementById('resultado-container');
      const nome = (dados && dados.nome) || 'paciente';
      const data = (dados && dados.data) || new Date().toLocaleDateString('pt-BR');

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
      wrapper.style.padding = '20px';
      wrapper.style.background = '#ffffff';

      const clone = sourcePage.cloneNode(true);
      clone.style.width = '100%';
      clone.style.boxShadow = 'none';
      clone.style.margin = '0';
      clone.style.padding = '0';

      const applyInlineStyles = (element) => {
        const computedStyle = window.getComputedStyle(element);
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
        Array.from(element.children).forEach(child => applyInlineStyles(child));
      };

      clone.querySelectorAll('.info-grid, .info-item, .texto-item, section, h2, h3').forEach(el => {
        applyInlineStyles(el);
      });

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
        const SEL = 'h2, h3, h4, .item, .info-item, .info-grid, .texto-item, .medicamento-card, p, .resultado > div';
        let passes = 50;
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

      html2canvas(wrapper, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        windowWidth: contentWidthPX,
        logging: false,
        imageTimeout: 0,
        removeContainer: false
      }).then((canvas) => {
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

        pdf.save(`avaliacao-${sanitizeFilePart(nome)}-${sanitizeFilePart(data, 'data')}.pdf`);
      }).catch((e) => {
        console.error('Erro ao gerar PDF:', e);
        alert('Erro ao gerar PDF. Por favor, tente novamente.');
      });
  };
  if (salvarPdfButton) salvarPdfButton.addEventListener('click', gerarPdfHandler);
  if (fabPdfButton) fabPdfButton.addEventListener('click', gerarPdfHandler);
  if (salvarDocxButton) salvarDocxButton.addEventListener('click', gerarDocxHandler);
  if (fabDocxButton) fabDocxButton.addEventListener('click', gerarDocxHandler);
});






