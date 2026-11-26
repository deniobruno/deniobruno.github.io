/**
 * projects.js — Carregamento Dinâmico de Projetos, Filtros, Busca, Tilt 3D & Modal
 * Dênio Mingote | 2026
 */

document.addEventListener('DOMContentLoaded', () => {
  initProjects();
});

async function initProjects() {
  const container = document.getElementById('projetos-container');
  const filtroBtns = document.querySelectorAll('.projetos__filtros .filtro__btn');
  const buscaInput = document.getElementById('busca-projetos');

  // Elementos do Modal
  const modal = document.getElementById('modal-projeto');
  const modalOverlay = modal ? modal.querySelector('.modal__overlay') : null;
  const modalFecharBtn = modal ? modal.querySelector('.modal__fechar') : null;
  const modalTitulo = document.getElementById('modal-titulo');
  const modalAno = modal ? modal.querySelector('.modal__ano') : null;
  const modalCategorias = modal ? modal.querySelector('.modal__categorias') : null;
  const modalDescricao = modal ? modal.querySelector('.modal__descricao') : null;
  const modalTecnologias = modal ? modal.querySelector('.modal__tecnologias') : null;
  const modalLinks = modal ? modal.querySelector('.modal__links') : null;

  if (!container) return;

  let todosProjetos = [];
  let categoriaAtiva = 'todos';
  let termoBusca = '';

  // 1. Carrega os projetos do JSON via fetch
  try {
    const resposta = await fetch('./data/projetos.json');
    if (!resposta.ok) throw new Error(`HTTP error! status: ${resposta.status}`);
    todosProjetos = await resposta.json();

    // Ordenação: Destaques primeiro, depois ano decrescente
    todosProjetos.sort((a, b) => {
      if (a.destaque && !b.destaque) return -1;
      if (!a.destaque && b.destaque) return 1;
      return (b.ano || 0) - (a.ano || 0);
    });

    renderizarGrid();
  } catch (erro) {
    console.error('Erro ao carregar projetos.json:', erro);
    container.innerHTML = `
      <div class="projetos__erro">
        <p class="erro__terminal-msg">
          <span class="erro__prompt">&gt;</span> Erro ao carregar <code>data/projetos.json</code> via <code>fetch()</code>.
        </p>
        <p class="erro__dica">
          Se você abriu o arquivo diretamente no navegador (<code>file:///</code>), o navegador bloqueia requisições locais por segurança (CORS).
          <br><br>
          <strong>Como resolver:</strong> Execute um servidor local no terminal com <code>python -m http.server 8000</code> ou abra usando a extensão <strong>Live Server</strong> no VS Code.
        </p>
      </div>
    `;
    return;
  }

  // 2. Renderização do Grid com Filtros e Busca
  function renderizarGrid() {
    let filtrados = todosProjetos.filter(projeto => {
      // Filtro de Categoria
      const matchCategoria = categoriaAtiva === 'todos' ||
        (projeto.categorias && projeto.categorias.map(c => c.toLowerCase()).includes(categoriaAtiva.toLowerCase()));

      // Filtro de Texto (título, descrição, tecnologias)
      const busca = termoBusca.toLowerCase().trim();
      const matchBusca = !busca ||
        (projeto.titulo && projeto.titulo.toLowerCase().includes(busca)) ||
        (projeto.descricaoCurta && projeto.descricaoCurta.toLowerCase().includes(busca)) ||
        (projeto.tecnologias && projeto.tecnologias.some(t => t.toLowerCase().includes(busca)));

      return matchCategoria && matchBusca;
    });

    if (filtrados.length === 0) {
      container.innerHTML = `
        <div class="projetos__vazio">
          <div class="vazio__icon">🔍</div>
          <p class="vazio__titulo">// Nenhum projeto encontrado</p>
          <p class="vazio__sub">Tente buscar por outro termo ou selecione a categoria "Todos".</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtrados.map((projeto, index) => {
      // Imagem ou wireframe fallback futurista
      const imagemHtml = projeto.imagem
        ? `<div class="projeto__thumb">
             <img src="${projeto.imagem}" alt="Captura do projeto ${projeto.titulo}" loading="lazy" onerror="this.parentElement.innerHTML = '${criarFallbackWireframe(projeto.titulo)}'">
           </div>`
        : `<div class="projeto__thumb">${criarFallbackWireframe(projeto.titulo)}</div>`;

      // Badges de tecnologias
      const tagsHtml = (projeto.tecnologias || []).slice(0, 4).map(tec => `
        <span class="projeto__tech-badge">${tec}</span>
      `).join('');

      // Botões de ação
      const btnDemo = projeto.demo ? `
        <a href="${projeto.demo}" target="_blank" rel="noopener noreferrer" class="projeto__link-btn projeto__link-btn--demo" aria-label="Acessar demonstração ao vivo de ${projeto.titulo}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          Demo
        </a>
      ` : '';

      const btnGithub = projeto.github ? `
        <a href="${projeto.github}" target="_blank" rel="noopener noreferrer" class="projeto__link-btn projeto__link-btn--github" aria-label="Ver código-fonte de ${projeto.titulo} no GitHub">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
          Código
        </a>
      ` : '';

      return `
        <article class="projeto__card spotlight-card" role="listitem" data-id="${projeto.id}" style="animation-delay: ${index * 80}ms">
          ${imagemHtml}
          
          <div class="projeto__corpo">
            <div class="projeto__header">
              <span class="projeto__ano">${projeto.ano || ''}</span>
              ${projeto.destaque ? '<span class="projeto__destaque-tag">Destaque</span>' : ''}
            </div>

            <h3 class="projeto__titulo">${projeto.titulo}</h3>
            <p class="projeto__descricao">${projeto.descricaoCurta}</p>

            <div class="projeto__techs">
              ${tagsHtml}
            </div>

            <div class="projeto__rodape">
              <button class="projeto__detalhes-btn" data-id="${projeto.id}" aria-label="Ver mais detalhes sobre ${projeto.titulo}">
                <span>Ver detalhes</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>

              <div class="projeto__links-externos">
                ${btnGithub}
                ${btnDemo}
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Vincula eventos de detalhes e efeito 3D Tilt
    bindCardEvents();
  }

  // Fallback visual de wireframe para quando não houver imagem
  function criarFallbackWireframe(titulo) {
    return `
      <div class="wireframe-fallback">
        <div class="wireframe__header">
          <span class="terminal-dot terminal-dot--red"></span>
          <span class="terminal-dot terminal-dot--yellow"></span>
          <span class="terminal-dot terminal-dot--green"></span>
        </div>
        <div class="wireframe__content">
          <svg class="wireframe__icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          <span class="wireframe__label">${titulo.replace('Site Institucional — ', '').replace('Sistema de Gestão — ', '')}</span>
        </div>
      </div>
    `;
  }

  // 3. Efeito Tilt 3D & Abertura do Modal
  function bindCardEvents() {
    const cards = container.querySelectorAll('.projeto__card');
    const isMouse = window.matchMedia('(pointer: fine)').matches;

    cards.forEach(card => {
      // Efeito Tilt 3D no mouse
      if (isMouse) {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;

          const tiltX = -y * 12; // Rotação no eixo X
          const tiltY = x * 12;  // Rotação no eixo Y

          card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-4px) scale3d(1.015, 1.015, 1.015)`;
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)';
        });
      }

      // Clique no card ou botão de detalhes para abrir modal
      card.addEventListener('click', (e) => {
        // Se o clique foi direto num link externo (demo ou github), deixa abrir o link sem disparar o modal
        if (e.target.closest('.projeto__link-btn')) return;

        const id = card.getAttribute('data-id');
        abrirModal(id);
      });
    });
  }

  // 4. Modal de Detalhes
  function abrirModal(id) {
    const projeto = todosProjetos.find(p => p.id === id);
    if (!projeto || !modal) return;

    modalTitulo.textContent = projeto.titulo;

    if (modalAno) {
      modalAno.textContent = projeto.ano ? `Ano: ${projeto.ano}` : '';
    }

    if (modalCategorias) {
      modalCategorias.innerHTML = (projeto.categorias || []).map(cat => `
        <span class="modal__categoria-tag">${cat.toUpperCase()}</span>
      `).join('');
    }

    if (modalDescricao) {
      modalDescricao.innerHTML = `
        <p class="modal__p">${projeto.descricaoLonga || projeto.descricaoCurta}</p>
      `;
    }

    if (modalTecnologias) {
      modalTecnologias.innerHTML = `
        <div class="modal__section-label">Tecnologias aplicadas:</div>
        <div class="modal__tech-tags">
          ${(projeto.tecnologias || []).map(t => `<span class="modal__tech-tag">${t}</span>`).join('')}
        </div>
      `;
    }

    if (modalLinks) {
      const demoBtn = projeto.demo ? `
        <a href="${projeto.demo}" target="_blank" rel="noopener noreferrer" class="btn btn--primary" aria-label="Acessar ${projeto.titulo} no ar">
          <span>Acessar site no ar</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      ` : '';

      const gitBtn = projeto.github ? `
        <a href="${projeto.github}" target="_blank" rel="noopener noreferrer" class="btn btn--secondary" aria-label="Ver repositório de ${projeto.titulo} no GitHub">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
          <span>Repositório GitHub</span>
        </a>
      ` : '';

      modalLinks.innerHTML = `${demoBtn} ${gitBtn}`;
    }

    // Abre o modal
    modal.classList.add('modal--aberto');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (window.soundFX) window.soundFX.playClick();

    // Foca o botão de fechar para navegação por teclado
    if (modalFecharBtn) modalFecharBtn.focus();
  }

  function fecharModal() {
    if (!modal) return;
    modal.classList.remove('modal--aberto');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (window.soundFX) window.soundFX.playHover();
  }

  if (modalFecharBtn) modalFecharBtn.addEventListener('click', fecharModal);
  if (modalOverlay) modalOverlay.addEventListener('click', fecharModal);

  // Fecha com a tecla Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('modal--aberto')) {
      fecharModal();
    }
  });

  // 5. Eventos dos Filtros por Categoria
  filtroBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filtroBtns.forEach(b => b.classList.remove('filtro__btn--ativo'));
      btn.classList.add('filtro__btn--ativo');

      categoriaAtiva = btn.getAttribute('data-filtro') || 'todos';
      renderizarGrid();

      if (window.soundFX) window.soundFX.playClick();
    });
  });

  // 6. Evento de Busca em Tempo Real
  if (buscaInput) {
    buscaInput.addEventListener('input', (e) => {
      termoBusca = e.target.value;
      renderizarGrid();
    });
  }
}
