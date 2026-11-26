/**
 * reveal.js — Habilidades Dinâmicas, Contadores Odômetro & Animações ao Rolar
 * - Dados estruturados de habilidades reais
 * - Filtro dinâmico por categoria
 * - Animação de preenchimento neon das barras de proficiência (IntersectionObserver)
 * - Odômetro numérico animado para contadores
 * - Efeito Spotlight (glow que segue o mouse nos cards)
 * Dênio Mingote | 2026
 */

document.addEventListener('DOMContentLoaded', () => {
  initContadores();
  initHabilidades();
  initSpotlight();
});

/* ==========================================================================
   1. CONTADORES NUMÉRICOS (ODÔMETRO DIGITAL AO ROLAR)
   ========================================================================== */
function initContadores() {
  const contadores = document.querySelectorAll('.contador__numero');
  if (!contadores.length) return;

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const elemento = entry.target;
        const alvo = parseInt(elemento.getAttribute('data-alvo'), 10) || 0;

        if (isReducedMotion) {
          elemento.textContent = alvo;
        } else {
          animarContador(elemento, alvo, 1400);
        }

        obs.unobserve(elemento); // Executa uma única vez
      }
    });
  }, { threshold: 0.3 });

  contadores.forEach(c => observer.observe(c));

  function animarContador(el, final, duracao) {
    let inicio = null;

    function frame(tempo) {
      if (!inicio) inicio = tempo;
      const progresso = Math.min((tempo - inicio) / duracao, 1);
      // Curva easeOutExpo para aceleração inicial rápida e desaceleração suave
      const ease = progresso === 1 ? 1 : 1 - Math.pow(2, -10 * progresso);
      const valorAtual = Math.floor(ease * final);

      el.textContent = valorAtual;

      if (progresso < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = final;
      }
    }

    requestAnimationFrame(frame);
  }
}

/* ==========================================================================
   2. HABILIDADES DINÂMICAS & BARRAS DE NÍVEL
   ========================================================================== */
const HABILIDADES_DATA = [
  // Desenvolvimento
  {
    id: 'java',
    nome: 'Java (POO & Padrões)',
    categoria: 'dev',
    nivel: 85,
    tag: 'Back-end',
    detalhe: 'POO avançada, Singleton, Factory Method, Gson, Javadoc e Coleções.'
  },
  {
    id: 'web',
    nome: 'HTML5, CSS3 & JavaScript',
    categoria: 'dev',
    nivel: 85,
    tag: 'Front-end',
    detalhe: 'Construção de sites responsivos, SEO, acessibilidade, DOM e Canvas.'
  },
  {
    id: 'python',
    nome: 'Python & Automação',
    categoria: 'dev',
    nivel: 80,
    tag: 'Automação & Scripts',
    detalhe: 'Scripts utilitários, automação de tarefas e manipulação de arquivos.'
  },
  {
    id: 'sql',
    nome: 'SQL & Bancos Relacionais',
    categoria: 'dev',
    nivel: 75,
    tag: 'Banco de Dados',
    detalhe: 'Consultas relacionais, modelagem de dados e integridade referencial.'
  },

  // Segurança & Redes
  {
    id: 'redes',
    nome: 'Redes de Computadores',
    categoria: 'seguranca',
    nivel: 80,
    tag: 'Infraestrutura',
    detalhe: 'Arquitetura TCP/IP, camadas do modelo OSI, portas, protocolos e serviços.'
  },
  {
    id: 'linux',
    nome: 'Linux (CLI & Shell)',
    categoria: 'seguranca',
    nivel: 75,
    tag: 'Sistemas',
    detalhe: 'Navegação por terminal, gestão de processos, permissões e scripts bash.'
  },
  {
    id: 'security',
    nome: 'Segurança da Informação',
    categoria: 'seguranca',
    nivel: 75,
    tag: 'Cybersecurity',
    detalhe: 'Fundamentos de ethical hacking, análise de vulnerabilidades e boas práticas.'
  },
  {
    id: 'lgpd',
    nome: 'Conformidade & LGPD',
    categoria: 'seguranca',
    nivel: 70,
    tag: 'Privacidade',
    detalhe: 'Noções de privacidade de dados, conformidade legal e termos éticos.'
  },

  // Dados & Análise
  {
    id: 'analise-dados',
    nome: 'Análise Estatística de Dados',
    categoria: 'dados',
    nivel: 80,
    tag: 'Análise de Mercado',
    detalhe: 'Fechamento de índices financeiros, análise comparativa de fundos e consórcios.'
  },
  {
    id: 'dashboards',
    nome: 'Relatórios & Dashboards',
    categoria: 'dados',
    nivel: 85,
    tag: 'Business Intelligence',
    detalhe: 'Elaboração de relatórios analíticos e visualização para tomada de decisão.'
  },
  {
    id: 'excel',
    nome: 'Excel Avançado',
    categoria: 'dados',
    nivel: 85,
    tag: 'Produtividade',
    detalhe: 'Funções avançadas, fórmulas, análise de planilhas e consolidação.'
  },

  // Processos & Gestão
  {
    id: 'kanban',
    nome: 'Metodologia Kanban & Ágil',
    categoria: 'processos',
    nivel: 90,
    tag: 'Gestão Ágil',
    detalhe: 'Gestão de fluxos de demandas na Diamante Prime e priorização contínua.'
  },
  {
    id: 'bpmn',
    nome: 'Modelagem em BPMN',
    categoria: 'processos',
    nivel: 75,
    tag: 'Processos de Negócio',
    detalhe: 'Mapeamento, padronização e documentação de fluxos operacionais.'
  },
  {
    id: 'lideranca',
    nome: 'Gestão de Eventos & Equipes',
    categoria: 'processos',
    nivel: 85,
    tag: 'Soft Skills',
    detalhe: 'Gerente de eventos na NextStep e liderança na Atlética universitária.'
  }
];

function initHabilidades() {
  const container = document.getElementById('habilidades-container');
  const filtroBtns = document.querySelectorAll('.hab-filtro__btn');

  if (!container) return;

  function renderizarHabilidades(categoriaFiltro = 'todos') {
    const lista = categoriaFiltro === 'todos'
      ? HABILIDADES_DATA
      : HABILIDADES_DATA.filter(h => h.categoria === categoriaFiltro);

    container.innerHTML = lista.map((h, index) => `
      <div class="habilidade__card spotlight-card" role="listitem" data-categoria="${h.categoria}" style="animation-delay: ${index * 60}ms">
        <div class="habilidade__header">
          <div class="habilidade__info">
            <span class="habilidade__tag">${h.tag}</span>
            <h3 class="habilidade__nome">${h.nome}</h3>
          </div>
          <span class="habilidade__percentual">${h.nivel}%</span>
        </div>

        <div class="habilidade__barra-trilho" aria-hidden="true">
          <div class="habilidade__barra-progresso" data-nivel="${h.nivel}" style="--progresso: ${h.nivel}%;"></div>
        </div>

        <p class="habilidade__detalhe">${h.detalhe}</p>
      </div>
    `).join('');

    // Dispara animação das barras após renderizar
    animarBarras();
  }

  function animarBarras() {
    const barras = container.querySelectorAll('.habilidade__barra-progresso');
    
    // Observer para acionar a barra apenas quando visível na tela
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('habilidade__barra-progresso--animar');
        }
      });
    }, { threshold: 0.15 });

    barras.forEach(b => observer.observe(b));
  }

  // Eventos de filtro
  filtroBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filtroBtns.forEach(b => b.classList.remove('hab-filtro__btn--ativo'));
      btn.classList.add('hab-filtro__btn--ativo');

      const categoria = btn.getAttribute('data-hab-filtro');
      renderizarHabilidades(categoria);

      if (window.soundFX) {
        window.soundFX.playClick();
      }
    });
  });

  // Render inicial com todas as habilidades
  renderizarHabilidades('todos');
}

/* ==========================================================================
   3. EFEITO SPOTLIGHT (BRILHO RADIAL QUE SEGUE O CURSOR NOS CARDS)
   ========================================================================== */
function initSpotlight() {
  document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.spotlight-card');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Define variáveis locais para o gradiente CSS
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}
