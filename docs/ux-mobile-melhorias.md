# Melhorias de UX/UI para uso mobile — Avaliação Geriátrica Ampla

> Diagnóstico feito sobre o código atual da branch `feature/app-mobile` (`index.html`, `styles.css`, `scripts/app.js`, `scripts/persistence.js`).
> Cenário-alvo: profissional de geriatria à beira do leito, smartphone em uma mão, paciente idoso à frente, interrupções frequentes.

## Resumo executivo

O app já tem boas bases para mobile: `inputmode="numeric"` nos campos numéricos, fonte de 16px nos inputs (evita o zoom do iOS), alvos de rádio com `padding` e `min-width: 44px`, cálculo automático de idade e IMC, cronômetros em modal (marcha, sentar-levantar, fluência) e imagem do MEEM em tela cheia.

Os maiores riscos hoje são três:

1. **Perda de dados.** O estado fica em `sessionStorage` e só é salvo de novo no `beforeunload`, que o navegador mobile frequentemente não dispara.
2. **Navegação.** Uma página única com cerca de 2.500 linhas e acordeões aninhados em 3 níveis, sem indicador de progresso nem atalho para as escalas.
3. **Ações destrutivas sem proteção.** Os botões "Limpar" de cada escala apagam as respostas sem confirmação e sem opção de desfazer.

### Prioridades sugeridas

| # | Melhoria | Impacto | Esforço |
|---|----------|---------|---------|
| 1 | Persistência robusta (localStorage/IndexedDB + `visibilitychange`) | Muito alto | Baixo |
| 2 | "Desfazer" nos botões Limpar e Limpar resumo | Alto | Baixo |
| 3 | Barra fixa do paciente + barra inferior de ações | Alto | Médio |
| 4 | Status por escala (respondidas/total, pontuação) no cabeçalho do acordeão | Alto | Médio |
| 5 | Chips/seleção no lugar de texto livre (estado civil, escolaridade etc.) | Médio | Baixo |
| 6 | Wake Lock + feedback tátil nos testes cronometrados | Médio | Baixo |
| 7 | Índice/atalho para as escalas ("Ir para…") | Médio | Médio |
| 8 | Ditado por voz nos campos abertos (Valores, antecedentes) | Médio | Médio |
| 9 | Ajustes visuais (cabeçalho, cor vermelha, cabeçalhos fixos aninhados) | Médio | Baixo |

---

## 1. Fluxo de navegação

### 1.1 Não há mapa da avaliação nem progresso
**Problema.** A avaliação tem 4 blocos de nível 1 (Hospital Amigo do Idoso, AGA, Outros Testes, Resumo), 6 dimensões e mais de 20 escalas, todas em acordeões aninhados (`section.collapsible` dentro de `section.collapsible`). No celular, o profissional não sabe quantas escalas faltam, nem quais já foram respondidas, e precisa rolar e abrir vários níveis para chegar ao MEEM.

**Solução.**
- Mostrar o **status no cabeçalho de cada escala**, calculado a partir dos `name` já listados em `constants.js` (`camposBarthel`, `camposKatz`…):
  `Índice de Barthel  ·  7/10  ●` → `Índice de Barthel  ·  85 pts ✓`
- Adicionar um botão **"Ir para…"** (na barra inferior, ver 1.3) que abre uma folha (*bottom sheet*) com a lista de escalas agrupadas por dimensão e o mesmo status ao lado. Ao tocar, abre os acordeões pais e rola até a escala.
- Mostrar o progresso geral numa barra fina abaixo do cabeçalho: "12 de 23 escalas".

```js
// Exemplo: status por escala, reaproveitando constants.js
function statusEscala(campos) {
  const respondidas = campos.filter(n => document.querySelector(`input[name="${n}"]:checked`)).length;
  return { respondidas, total: campos.length };
}
```

### 1.2 Acordeões: abrir um não fecha os outros
**Problema.** Em `bindActions()` (`scripts/app.js:591`) o clique só alterna (`toggle`) a classe `open`. Com várias escalas abertas, a página fica enorme e o usuário se perde. Além disso, o estado aberto/fechado não é salvo: depois de um recarregamento tudo volta fechado.

**Solução.**
- No mobile, fechar as escalas **irmãs** ao abrir uma (modo acordeão real) e rolar o cabeçalho aberto para o topo (`scrollIntoView({block: 'start'})`).
- Salvar quais seções estavam abertas junto com o formulário, para que o profissional volte exatamente onde parou.

### 1.3 Ações principais estão no fim da página
**Problema.** "Visualizar Resultado" e "Resumo" ficam dentro do último acordeão ("Resumo dos Testes Aplicados"), no fim da página. "Novo" fica no topo. Para gerar o resultado, o usuário precisa rolar a página inteira e abrir mais um acordeão.

**Solução.** Criar uma **barra inferior fixa**, na zona do polegar, com 3 ações:

```
┌───────────────────────────────────────┐
│  ☰ Ir para   │  ✓ Salvo 14:32  │  Resultado ▸ │
└───────────────────────────────────────┘
```

- Usar `padding-bottom: env(safe-area-inset-bottom)` e adicionar `viewport-fit=cover` ao `<meta name="viewport">`.
- Mover "Novo" para um menu (⋮), longe da área de toque frequente: é uma ação destrutiva.

### 1.4 Identificação do paciente some ao rolar
**Problema.** Quando o profissional está no GDS-15, o nome e a idade do paciente estão a muitas telas de distância. Numa enfermaria com vários leitos, isso facilita registrar dados no paciente errado.

**Solução.** Uma **barra fixa compacta no topo**, que aparece assim que a seção de Identificação sai da tela:
`Maria S. · 82a · F · Atend. 123456`

---

## 2. Design da interface

### 2.1 O cabeçalho ocupa muito espaço vertical
**Problema.** `.header-logo { max-height: 160px }`, somado a `padding` e ao bloco do botão "Novo" (`padding: 20px 0`), ocupa cerca de 30% da altura de um celular de 6".

**Solução.** No `@media (max-width: 720px)`, reduzir o logo para cerca de 48px de altura, ou mostrá-lo apenas na tela inicial.

### 2.2 Cabeçalhos fixos aninhados se sobrepõem
**Problema.** `section > h1` e `section > h2` usam `position: sticky; top: -1px`. Com seções aninhadas (dimensão → escala), os dois cabeçalhos grudam no mesmo `top` e um cobre o outro.

**Solução.** Usar *offsets* em cascata: h1 em `top: 0` e h2 em `top: var(--h1-height)`. Outra opção é manter fixo só o cabeçalho da escala atual, com o nome da dimensão como prefixo pequeno ("Funcional › Barthel").

### 2.3 Uso do vermelho para títulos
**Problema.** `.section-body h3 { color: red }` ("MAIS IMPORTANTE", "MEDICAMENTOS", "MULTICOMPLEXIDADE"). Em interfaces clínicas, vermelho significa erro ou alerta crítico. Usá-lo em títulos enfraquece o sinal quando houver um alerta real (ex.: CAM positivo para delirium).

**Solução.** Usar a cor primária (`#3f51b5`) ou um cinza escuro nos títulos, e reservar o vermelho e o âmbar para resultados alterados e erros.

### 2.4 Alvos de toque pequenos ou mal posicionados
| Elemento | Hoje | Recomendado |
|---|---|---|
| Rádio/checkbox | 18×18px (o `label` inteiro é clicável, o que ajuda) | Manter o label clicável, com `min-height: 48px` |
| Fechar modal (`.close-button`, `&times;`) | Texto de 28px sem área de toque, no canto superior direito (longe do polegar) | Botão de 48×48px **e** botão "Cancelar" no rodapé do modal |
| Excluir medicamento (`.delete-medicamento`) | "×" de 20px dentro do cabeçalho clicável do acordeão: risco de excluir ao tentar abrir | Mover para dentro do card aberto, com confirmação ou desfazer |
| Botões "Limpar" | `width: 100%` no mobile, empilhados ao lado das ações primárias | Ver 4.3 |

### 2.5 Modais
**Problema.** `.modal-content { margin: 15% auto; width: 80% }`: no celular o modal fica centralizado, com margens grandes, e o teclado virtual cobre os campos do modal de medicamento.

**Solução.** No mobile, abrir os modais como *bottom sheet* em tela cheia (`width: 100%; margin: 0; min-height: 100dvh`), com os botões de ação fixos no rodapé.

### 2.6 Desempenho e legibilidade do fundo
**Problema.** `background: … url('assets/background-pagina.png') … fixed`: `background-attachment: fixed` é ignorado no iOS e causa *repaints* caros no Android. A imagem atrás de cards brancos não ajuda na leitura.

**Solução.** No mobile, usar um fundo sólido (`#f7f7fb`).

### 2.7 Acessibilidade
- Os cabeçalhos clicáveis (`h1`/`h2`) não são focáveis nem anunciados como botões. Envolver o texto num `<button aria-expanded>`.
- Garantir contraste mínimo de 4.5:1. `.help` (#555 em 13px) passa, mas `.legend` com 12px fica no limite: subir para 14px.
- Respeitar o tamanho de fonte do sistema: usar `rem` em vez de `px` fixos.
- Opcional: modo escuro (`prefers-color-scheme`) para plantões noturnos, quando o paciente dorme e a tela clara incomoda.

---

## 3. Entrada de dados

### 3.1 Texto livre onde caberia uma seleção
**Problema.** Na Identificação, `Cor`, `Estado Civil`, `Escolaridade`, `Religião`, `Grau de Parentesco` e `Aposentado/Renda` são `<input type="text">`. Digitar no celular é lento e gera dados inconsistentes ("casada", "Casado(a)", "cas.").

**Solução.** Usar **chips de seleção única** (o mesmo padrão `.row > label` já usado em Sexo), com a opção "Outro" abrindo um campo de texto:

```html
<div class="row chips">
  <label><input type="radio" name="anamnese_estado_civil" value="solteiro"> Solteiro(a)</label>
  <label><input type="radio" name="anamnese_estado_civil" value="casado"> Casado(a)</label>
  <label><input type="radio" name="anamnese_estado_civil" value="viuvo"> Viúvo(a)</label>
  <label><input type="radio" name="anamnese_estado_civil" value="divorciado"> Divorciado(a)</label>
  <label><input type="radio" name="anamnese_estado_civil" value="outro"> Outro</label>
</div>
```

Escolaridade como chips de faixas (analfabeto, 1–4 anos, 5–8, 9–11, ≥12) tem um ganho clínico direto: os pontos de corte do MEEM dependem da escolaridade.

### 3.2 Teclados e formatos
- `peso`, `altura` e `imc` usam `inputmode="numeric"`, que no iOS **não mostra vírgula**. Usar `inputmode="decimal"` em peso e altura.
- `imc` é calculado: deveria ser `readonly`, visualmente diferente (fundo cinza) e fora da ordem de tabulação.
- Datas: `data_nascimento` usa `DD/MM/AAAA` e `data_avaliacao` usa `DD-MM-YYYY`. Padronizar e preencher `data_avaliacao` automaticamente com a data de hoje.
- Adicionar `enterkeyhint="next"` nos campos de texto e `autocapitalize="words"` nos nomes.

### 3.3 Medicamentos
**Problema.** O modal tem 4 campos de texto livre (nome, justificativa, dose, tempo). A lista de Prescrição Potencialmente Inapropriada é marcada à mão, sem relação com o que foi digitado. O checkbox "Não" pode ser marcado junto com os outros.

**Solução.**
- Usar `<datalist>` com os medicamentos mais comuns da enfermaria para autocompletar o nome.
- Sugerir automaticamente a categoria PPI quando o nome bater com uma lista conhecida (ex.: clonazepam → Benzodiazepínico) e pedir confirmação ao usuário.
- Marcar polifarmácia automaticamente quando houver 5 ou mais itens, permitindo correção manual.
- Fazer "Não" ser mutuamente exclusivo com os demais checkboxes de PPI.

### 3.4 Entrada por voz nos campos abertos
**Problema.** As perguntas de **Valores** ("O que é um bom dia para você?", "O que seria pior do que a morte?") pedem respostas longas e pessoais. Digitar durante essa conversa quebra o contato visual com o paciente.

**Solução.**
1. **Mínimo, sem código:** aumentar os `textarea` (de `rows="2"` para `rows="4"` com `field-sizing: content`) e orientar o uso do microfone do teclado nativo (Gboard/iOS).
2. **Botão 🎤 dentro do campo**, usando a Web Speech API (`webkitSpeechRecognition`, `lang='pt-BR'`). Funciona no Chrome para Android; no iOS o suporte é parcial, então o botão só deve aparecer quando a API existir.
   - Mostrar claramente quando está gravando (borda pulsante e texto "Ouvindo…").
   - **Atenção (LGPD):** no Chrome, o áudio é processado por servidores do Google. Isso precisa ser validado com a instituição antes de ativar para dados de pacientes.

### 3.5 Escalas: avançar automaticamente
**Problema.** Escalas como IVCF-20, GDS-15 e Barthel têm muitas perguntas binárias. Depois de cada resposta, o usuário precisa rolar com precisão até a próxima.

**Solução.** Opção (desligada por padrão) de **avançar automaticamente**: ao marcar uma resposta, rolar suavemente até a próxima pergunta sem resposta e destacá-la. Também vale o botão "Próxima não respondida ↓" na barra inferior.

---

## 4. Feedback visual

### 4.1 Status de salvamento
**Problema.** O salvamento é silencioso. O profissional não tem como saber se os dados estão seguros.

**Solução.** Indicador discreto na barra inferior: "✓ Salvo 14:32" (atualizado a cada `change`), que muda para "⚠ Não salvo" em caso de erro de armazenamento.

### 4.2 Resultados de cada escala
**Problema.** O resultado aparece em `.resultado` no fim da escala, com texto e cor uniformes. Em escalas longas, ele fica fora da tela no momento da última resposta.

**Solução.**
- Mostrar a pontuação **no cabeçalho fixo da escala** (ver 1.1), atualizada a cada resposta.
- Usar *badges* com cor semântica e ícone, não só cor (acessibilidade para daltônicos):
  `● Normal` (verde) · `▲ Risco moderado` (âmbar) · `■ Alterado` (vermelho).
- Para achados que mudam conduta (ex.: **CAM positivo**, Zucchelli alto risco), mostrar um alerta em destaque também no Resumo.

### 4.3 Ações destrutivas
**Problema.**
- Os botões "Limpar" de cada escala (`setupLimparButtons`, `scripts/app.js:754`) e "Limpar resumo" apagam os dados **sem confirmação**. No mobile eles ocupam 100% da largura, logo acima ou abaixo de botões primários, e um toque acidental apaga um MEEM inteiro.
- "Novo" usa `confirm()` nativo, que é bloqueante e com visual pouco claro.

**Solução.** Usar **desfazer** em vez de confirmação: ao limpar, guardar o estado anterior e mostrar um *snackbar* por cerca de 6 segundos com "MEEM limpo · **Desfazer**". Diminuir o peso visual do "Limpar" (botão de texto, alinhado à esquerda, longe do botão primário). Para "Novo", usar um modal próprio que mostra o nome do paciente que será apagado ("Apagar avaliação de Maria S.?").

### 4.4 Validação
**Problema.** Os rádios têm `required`, mas não há validação visível. O Katz usa `alert('Por favor, responda todas as perguntas…')` (`scripts/app.js:1333`) sem indicar **quais** perguntas faltam.

**Solução.** Ao tentar concluir, rolar até a primeira pergunta sem resposta e destacá-la (borda âmbar + "Sem resposta"), com um contador: "2 perguntas sem resposta".

---

## 5. Contexto clínico

### 5.1 Interrupções: o dado não pode se perder
**Problema (crítico).** `persistence.js` usa `sessionStorage`, que é apagado quando a aba fecha. A gravação final depende de `beforeunload` (`scripts/app.js:1732`), que **não é disparado de forma confiável no mobile**: quando o profissional troca para o WhatsApp ou atende uma ligação, o sistema pode encerrar a aba em segundo plano. Os campos de texto também só salvam no `change` (ao perder o foco), então um texto longo em digitação pode se perder.

**Solução.**
```js
// persistence.js — trocar sessionStorage por localStorage (ou IndexedDB)
localStorage.setItem(STORAGE_KEY, JSON.stringify({ savedAt: Date.now(), state }));

// app.js — salvar quando o app vai para segundo plano (confiável no mobile)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') salvarFormulario();
});
// e salvar durante a digitação, com debounce
main.addEventListener('input', debounce(salvarFormulario, 800));
```
Ao abrir o app com dados salvos, mostrar: "Continuar avaliação de **Maria S.** (iniciada às 14:05)? [Continuar] [Nova]".

> Como os dados são sensíveis, definir um prazo de expiração (ex.: 12h) e apagar automaticamente depois do resultado exportado.

### 5.2 Testes cronometrados (marcha, sentar-levantar, fluência verbal)
- **Screen Wake Lock API** (`navigator.wakeLock.request('screen')`) enquanto o modal estiver aberto: hoje a tela pode apagar no meio dos 60s da fluência verbal.
- **Vibração e aviso sonoro** ao terminar o tempo (`navigator.vibrate(300)`): o profissional está olhando para o paciente, não para a tela.
- O botão "+1 Animal" já é grande, o que é ótimo. Adicionar "−1" para corrigir toques duplos e manter os botões na metade inferior da tela.

### 5.3 Ordem natural da anamnese e modo "paciente"
- Permitir **pular** e voltar a perguntas sem perder o lugar, com o estado "pulado" diferente de "não respondido" (ex.: paciente cansou e a escala será concluída depois).
- Para perguntas lidas em voz alta ou mostradas ao paciente (GDS-15, comandos do MEEM, "Feche os olhos"), oferecer um **modo leitura**: texto da pergunta em fonte grande, como já é feito no `feche-olhos-fullscreen`. Isso ajuda pacientes com baixa visão e facilita a leitura em voz alta.
- Escalas com pré-requisitos (ex.: CAM só se Zucchelli indicar risco) podem sugerir a próxima escala: "Zucchelli: alto risco → aplicar CAM?".

### 5.4 Resultado
- Na página de resultado, os FABs de PDF/DOCX (`#fab-pdf`, `#fab-docx`) ficam sobre o conteúdo. Adicionar `padding-bottom` no fim da página e `env(safe-area-inset-bottom)`.
- Incluir no topo do resultado um **resumo de 1 tela**: escalas alteradas primeiro, normais depois.

### 5.5 Instalação como app (PWA)
Adicionar `manifest.json` e um *service worker* simples (cache dos arquivos estáticos). Com isso o app abre em tela cheia pelo ícone na tela inicial, ganha espaço vertical e **funciona sem internet**, o que é útil em enfermarias com Wi-Fi instável.

---

## Plano de implementação sugerido

**Sprint 1, segurança dos dados e ações (baixo esforço):**
5.1 persistência · 4.3 desfazer · 3.2 `inputmode="decimal"` e IMC somente leitura · 2.3 cor dos títulos · 2.1 cabeçalho menor · 2.6 fundo sólido.

**Sprint 2, navegação:**
1.3 barra inferior · 1.4 barra do paciente · 1.1 status por escala e "Ir para…" · 1.2 acordeão exclusivo · 4.1 indicador de salvamento.

**Sprint 3, entrada de dados e contexto clínico:**
3.1 chips · 3.3 medicamentos · 5.2 Wake Lock e vibração · 4.4 validação · 2.5 modais em *bottom sheet*.

**Sprint 4, evolução:**
3.4 voz (após validação LGPD) · 3.5 avanço automático · 5.3 modo leitura · 5.5 PWA.

### Como validar
- Testar em pelo menos um Android de entrada (tela de cerca de 6", Chrome) e um iPhone (Safari).
- Teste de uso com 3 a 5 profissionais da equipe, aplicando IVCF-20 + MEEM num paciente simulado, medindo **tempo total**, **toques fora do alvo** e **dados perdidos após interrupção** (trocar de app por 2 minutos no meio da avaliação).
