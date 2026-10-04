/**
 * Módulo de Feedback Visual
 * Snackbar com ação (ex.: "Desfazer") e diálogo de confirmação
 */

let snackbarTimer = null;

/**
 * Mostra uma mensagem temporária na parte inferior da tela
 * @param {Object} opcoes
 * @param {string} opcoes.mensagem - Texto exibido
 * @param {string} [opcoes.acaoLabel] - Rótulo do botão de ação
 * @param {Function} [opcoes.onAcao] - Chamado ao tocar na ação
 * @param {number} [opcoes.duracao=6000] - Tempo visível em ms
 */
export function mostrarSnackbar({ mensagem, acaoLabel, onAcao, duracao = 6000 }) {
  let snackbar = document.getElementById('snackbar');
  if (!snackbar) {
    snackbar = document.createElement('div');
    snackbar.id = 'snackbar';
    snackbar.className = 'snackbar';
    snackbar.setAttribute('role', 'status');
    snackbar.setAttribute('aria-live', 'polite');
    document.body.appendChild(snackbar);
  }

  snackbar.innerHTML = '';
  const texto = document.createElement('span');
  texto.textContent = mensagem;
  snackbar.appendChild(texto);

  if (acaoLabel && onAcao) {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'snackbar-acao';
    botao.textContent = acaoLabel;
    botao.addEventListener('click', () => {
      esconderSnackbar();
      onAcao();
    });
    snackbar.appendChild(botao);
  }

  snackbar.classList.add('visivel');
  clearTimeout(snackbarTimer);
  snackbarTimer = setTimeout(esconderSnackbar, duracao);
}

export function esconderSnackbar() {
  clearTimeout(snackbarTimer);
  document.getElementById('snackbar')?.classList.remove('visivel');
}

/**
 * Pede confirmação ao usuário em um diálogo próprio (substitui confirm())
 * @param {Object} opcoes
 * @param {string} opcoes.titulo
 * @param {string} opcoes.mensagem
 * @param {string} [opcoes.confirmarLabel='Confirmar']
 * @returns {Promise<boolean>}
 */
export function confirmar({ titulo, mensagem, confirmarLabel = 'Confirmar' }) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'dialogo-overlay';
    overlay.innerHTML = `
      <div class="dialogo" role="alertdialog" aria-modal="true" aria-labelledby="dialogo-titulo" aria-describedby="dialogo-mensagem">
        <h2 id="dialogo-titulo"></h2>
        <p id="dialogo-mensagem"></p>
        <div class="dialogo-acoes">
          <button type="button" class="secondary" data-resposta="nao">Cancelar</button>
          <button type="button" class="perigo" data-resposta="sim"></button>
        </div>
      </div>
    `;
    overlay.querySelector('#dialogo-titulo').textContent = titulo;
    overlay.querySelector('#dialogo-mensagem').textContent = mensagem;
    overlay.querySelector('[data-resposta="sim"]').textContent = confirmarLabel;

    const fechar = (resposta) => {
      document.removeEventListener('keydown', aoTeclar);
      overlay.remove();
      resolve(resposta);
    };
    const aoTeclar = (e) => { if (e.key === 'Escape') fechar(false); };

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) return fechar(false);
      const resposta = e.target.closest('[data-resposta]')?.dataset.resposta;
      if (resposta) fechar(resposta === 'sim');
    });
    document.addEventListener('keydown', aoTeclar);

    document.body.appendChild(overlay);
    overlay.querySelector('[data-resposta="nao"]').focus();
  });
}
