# Avaliação Geriátrica Ampla

Sistema web para avaliação geriátrica completa com múltiplas escalas validadas.

## 🚀 Como Executar

### ⚠️ IMPORTANTE: Módulos ES6 e CORS

Esta aplicação usa **módulos ES6 nativos** do JavaScript. Por questões de segurança, navegadores **não permitem** carregar módulos usando o protocolo `file://` (abrir o arquivo HTML diretamente).

**Você DEVE usar um servidor HTTP local.**

### Opção 1: Python (Recomendado - mais simples)

Se você tem Python 3 instalado:

```bash
# Na pasta do projeto, execute:
python serve.py

# Ou especifique uma porta:
python serve.py 3000
```

Depois acesse: `http://localhost:8000`

### Opção 2: Node.js

Se você tem Node.js instalado:

```bash
# Na pasta do projeto, execute:
node serve.js

# Ou especifique uma porta:
node serve.js 3000
```

Depois acesse: `http://localhost:8000`

### Opção 3: PHP

Se você tem PHP instalado:

```bash
php -S localhost:8000
```

Depois acesse: `http://localhost:8000`

### Opção 4: Extensão VS Code

Se você usa VS Code, instale a extensão **Live Server**:

1. Instale a extensão "Live Server" (Ritwick Dey)
2. Clique com botão direito no `index.html`
3. Selecione "Open with Live Server"

### Opção 5: http-server (npm)

```bash
npx http-server -p 8000
```

## 📋 Escalas Implementadas

A aplicação inclui as seguintes escalas geriátricas:

### Rastreio e Vulnerabilidade
- **SRH** - Pergunta Única Global de Saúde
- **IVCF-20** - Índice de Vulnerabilidade Clínico-Funcional
- **CFS** - Escala Clínica de Fragilidade

### Funcionalidade
- **Barthel** - Índice de Barthel
- **Katz** - Escala de Katz
- **Lawton** - Escala de Lawton
- **Pfeffer** - Questionário de Pfeffer

### Condições Específicas
- **FRAIL** - Escala FRAIL de Fragilidade
- **SARC-F** - Rastreio de Sarcopenia
- **MAN** - Mini Avaliação Nutricional
- **GDS-15** - Escala de Depressão Geriátrica
- **10-CS** - Rastreio Cognitivo 10 pontos
- **Zucchelli** - Predição de Delirium
- **CAM** - Confusion Assessment Method

### Social
- **APGAR Familiar** - Avaliação Funcional Familiar

## 📁 Estrutura do Projeto

```
.
├── index.html              # Página principal
├── resultado.html          # Página de resultados
├── styles.css             # Estilos
├── scripts/
│   ├── app.js             # Aplicação principal (coordenador)
│   ├── constants.js       # Constantes e configurações
│   ├── utils.js           # Funções utilitárias
│   ├── calculations.js    # Lógica de cálculo das escalas
│   ├── dom.js            # Manipulação do DOM
│   └── resultado.js       # Lógica da página de resultados
├── serve.js              # Servidor HTTP (Node.js)
├── serve.py              # Servidor HTTP (Python)
└── README.md             # Este arquivo
```

## 🔧 Arquitetura

A aplicação foi completamente refatorada para usar **módulos ES6**:

- **Modular**: Código dividido em módulos especializados
- **Manutenível**: Fácil de entender e modificar
- **Testável**: Funções isoladas e puras
- **Sem duplicação**: Uma única fonte de verdade

Veja [REFACTORING.md](REFACTORING.md) para detalhes da refatoração.

## 🌐 Compatibilidade

### Navegadores Suportados
- ✅ Chrome/Edge 61+
- ✅ Firefox 60+
- ✅ Safari 11+
- ❌ Internet Explorer (não suportado)

### Requisitos
- Navegador moderno com suporte a módulos ES6
- Servidor HTTP local (veja opções acima)

## 💾 Funcionalidades

- ✅ Preenchimento de anamnese completa
- ✅ Múltiplas escalas geriátricas
- ✅ Cálculo automático de resultados
- ✅ Geração de relatório em PDF
- ✅ Armazenamento local (LocalStorage)
- ✅ Interface responsiva
- ✅ Suporte a medicamentos
- ✅ Valores e preferências do paciente

## 🐛 Solução de Problemas

### Erro "CORS policy" ou "ERR_FAILED"

**Causa**: Você está tentando abrir o arquivo HTML diretamente (`file://` protocol).

**Solução**: Use um dos servidores HTTP listados acima. **Não** abra o arquivo diretamente no navegador.

### Módulos não carregam

1. Verifique se está usando um servidor HTTP
2. Abra o console do navegador (F12) e veja os erros
3. Confirme que seu navegador suporta módulos ES6
4. Limpe o cache do navegador (Ctrl+Shift+Delete)

### Erros de JavaScript

1. Abra o console do navegador (F12)
2. Verifique a mensagem de erro
3. Confirme que todos os arquivos `.js` estão na pasta `scripts/`

## 📝 Como Usar

1. **Inicie o servidor** (veja seção "Como Executar")
2. **Acesse** `http://localhost:8000` no navegador
3. **Preencha** a anamnese e escalas
4. **Visualize** os resultados automaticamente
5. **Gere** o relatório em PDF

## 🔐 Privacidade

- Todos os dados são armazenados **localmente** no navegador
- **Nenhum dado** é enviado para servidores externos
- Use o botão "Limpar" para remover dados

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
