# Avaliação Geriátrica Ampla (HGG)

Projeto web para coleta e geração de resultados da Avaliação Geriátrica Ampla, com foco em uso móvel e exportação para PDF em formato A4 com margens padronizadas.

## Visão geral
- Interface responsiva (mobile e desktop)
- Formulário com seções colapsáveis
- Resultado com destaque para Nome e Data
- Exportação para PDF em A4 com margem de 15 mm e paginação automática

## Estrutura
- `index.html` — página principal com formulário
- `resultado.html` — página de exibição do resultado e botão para salvar PDF
- `styles.css` — estilos globais, responsividade e impressão
- `scripts/`:
  - `app.js` — lógica do formulário (preenchimento e fluxo)
  - `data.js` — dados/constantes de apoio
  - `resultado.js` — montagem do resultado e geração de PDF

## Principais melhorias recentes
- Responsividade mobile (títulos, grid, espaçamentos, botões full-width)
- Centralização do campo de data
- Cabeçalho do resultado em duas linhas: “Avaliação de:” e “Nome - Data”
- Redução tipográfica do conteúdo após “Nome - Data” via `.resultado-body`
- Cor azul para radios/checkboxes via `accent-color`
- PDF em A4 independente do tamanho da tela, com margem fixa de 15 mm, sem incluir a barra de ações e mantendo proporções (sem esticar)

## Como usar localmente
1. Abra `index.html` em um navegador moderno (Chrome/Edge/Safari/Firefox).
2. Preencha o formulário e avance para o resultado.
3. Na página `resultado.html`, use o botão “Salvar como PDF”.

Observação: O fluxo de PDF usa `html2canvas` e `jsPDF` via CDN (em `resultado.html`).

## Publicação no GitHub
1. Crie um repositório no GitHub (público ou privado).
2. Inicialize o repositório local, faça o commit e envie:
   - `git init`
   - `git add .`
   - `git commit -m "feat: primeira versão do site HGG"`
   - `git branch -M main`
   - `git remote add origin https://github.com/<usuario>/<repo>.git`
   - `git push -u origin main`

### GitHub Pages (opcional)
- Ative o GitHub Pages no repositório (Settings → Pages)
- Fonte: `Deploy from a branch`
- Branch: `main` e pasta `/root`
- Acesse a URL gerada para ver o site online.

## Requisitos de navegador
- Navegadores modernos (2022+) para melhor suporte a:
  - `accent-color` nos inputs
  - seletor `:has()` usado para centralizar o input de data

Se precisar de compatibilidade mais ampla, podemos substituir `:has()` por uma classe no HTML e ajustar o CSS.

## Licença
Sem licença específica definida. Adapte conforme sua necessidade.

# avaliacao-geriatrica-ampla
